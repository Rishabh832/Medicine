from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q, F
from django.contrib.auth.models import User

from .models import (
    Category, Medicine, Offer,
    Prescription, Cart, CartItem,
    Order, OrderItem, Consultation,
)
from .serializers import (
    CategorySerializer, MedicineSerializer, OfferSerializer,
    PrescriptionSerializer,
    CartSerializer, CartItemSerializer,
    OrderSerializer, ConsultationSerializer,
)


# ── SETUP (ek baar use karo, phir hata do) ────────────────────────────────────

@api_view(['GET'])
def setup_admin(request):
    secret = request.query_params.get('secret')
    if secret != 'medirun_setup_2026':
        return Response({'error': 'forbidden'}, status=403)

    # Saari medicines active karo
    count = Medicine.objects.all().update(is_active=True)

    # Superuser banao ya password reset karo
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@medirun.com', 'Admin@123')
        user_msg = "Superuser 'admin' bana diya!"
    else:
        u = User.objects.get(username='admin')
        u.set_password('Admin@123')
        u.save()
        user_msg = "Password reset ho gaya!"

    return Response({
        'medicines_activated': count,
        'user': user_msg,
        'django_admin': 'Login: /admin/ | user: admin | pass: Admin@123'
    })


# ── CATEGORIES ────────────────────────────────────────────────────────────────

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


# ── MEDICINES ─────────────────────────────────────────────────────────────────

class MedicineViewSet(viewsets.ModelViewSet):
    serializer_class = MedicineSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser] 

    def get_queryset(self):
        qs = Medicine.objects.all().select_related("category")

        is_admin = self.request.query_params.get("admin")
        if not is_admin:
            qs = qs.filter(is_active=True)

        search   = self.request.query_params.get("q")
        category = self.request.query_params.get("category")
        rx       = self.request.query_params.get("rx")

        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(brand__icontains=search))
        if category:
            qs = qs.filter(category__slug=category)
        if rx is not None:
            qs = qs.filter(requires_prescription=(rx.lower() == "true"))

        return qs

    def get_object(self):
        queryset = Medicine.objects.all().select_related("category")
        obj = queryset.get(pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj


# ── OFFERS ────────────────────────────────────────────────────────────────────

class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.filter(is_active=True)
    serializer_class = OfferSerializer
    permission_classes = [permissions.AllowAny]


# ── PRESCRIPTIONS ─────────────────────────────────────────────────────────────

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all().order_by("-uploaded_at")
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# ── CART ──────────────────────────────────────────────────────────────────────

class CartView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        name  = request.data.get("customer_name")
        phone = request.data.get("customer_phone")
        if not name or not phone:
            return Response(
                {"detail": "customer_name and customer_phone required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        cart = Cart.objects.create(customer_name=name, customer_phone=phone)
        return Response(CartSerializer(cart, context={"request": request}).data)

    def get(self, request, cart_id=None):
        try:
            cart = Cart.objects.get(pk=cart_id)
            return Response(CartSerializer(cart, context={"request": request}).data)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, cart_id=None):
        try:
            cart = Cart.objects.get(pk=cart_id)
            cart.items.all().delete()
            return Response({"detail": "Cart cleared"})
        except Cart.DoesNotExist:
            return Response({"detail": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)


# ── CART ITEMS ────────────────────────────────────────────────────────────────

class AddCartItemView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart_id     = request.data.get("cart_id")
        medicine_id = request.data.get("medicine_id")

        try:
            quantity = int(request.data.get("quantity", 1))
        except (TypeError, ValueError):
            return Response({"detail": "Invalid quantity."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart     = Cart.objects.get(pk=cart_id)
            medicine = Medicine.objects.get(pk=medicine_id, is_active=True)
        except (Cart.DoesNotExist, Medicine.DoesNotExist):
            return Response({"detail": "Invalid cart or medicine"}, status=status.HTTP_400_BAD_REQUEST)

        if quantity < 1:
            CartItem.objects.filter(cart=cart, medicine=medicine).delete()
            return Response(CartSerializer(cart, context={"request": request}).data)

        if quantity > medicine.stock:
            return Response(
                {"detail": f"Only {medicine.stock} unit(s) available in stock."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        item, _ = CartItem.objects.get_or_create(cart=cart, medicine=medicine)
        item.quantity = quantity
        item.save()
        return Response(CartSerializer(cart, context={"request": request}).data)


# ── ORDERS ────────────────────────────────────────────────────────────────────

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class   = OrderSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names  = ["get", "post"]

    def get_queryset(self):
        phone    = self.request.query_params.get("phone")
        is_admin = self.request.query_params.get("admin")
        qs = Order.objects.prefetch_related("items__medicine")
        if is_admin:
            return qs.all()
        if phone:
            return qs.filter(customer_phone=phone)
        return qs.none()

    def create(self, request):
        cart_id          = request.data.get("cart_id")
        delivery_address = request.data.get("delivery_address")

        if not delivery_address:
            return Response(
                {"detail": "delivery_address is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            cart = Cart.objects.get(pk=cart_id)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

        if not cart.items.exists():
            return Response({"detail": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        out_of_stock = []
        for item in cart.items.select_related("medicine"):
            if item.medicine.stock < item.quantity:
                out_of_stock.append(
                    f"{item.medicine.name} (available: {item.medicine.stock}, requested: {item.quantity})"
                )
        if out_of_stock:
            return Response(
                {"detail": "Insufficient stock for: " + ", ".join(out_of_stock)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        total    = float(cart.total())
        discount = 0.0
        offer_obj = None

        offer_code = request.data.get("offer_code")
        if offer_code:
            try:
                offer_obj = Offer.objects.get(code=offer_code, is_active=True)
                if total >= float(offer_obj.min_order_value):
                    if offer_obj.discount_percent:
                        discount = total * offer_obj.discount_percent / 100
                    elif offer_obj.discount_flat:
                        discount = float(offer_obj.discount_flat)
                else:
                    return Response(
                        {"detail": f"Minimum order value for this offer is Rs.{offer_obj.min_order_value}."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except Offer.DoesNotExist:
                return Response(
                    {"detail": "Invalid or expired offer code."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        order = Order.objects.create(
            customer_name    = cart.customer_name,
            customer_phone   = cart.customer_phone,
            delivery_address = delivery_address,
            total_amount     = total,
            discount_amount  = round(discount, 2),
            offer            = offer_obj,
        )

        for item in cart.items.select_related("medicine"):
            OrderItem.objects.create(
                order      = order,
                medicine   = item.medicine,
                quantity   = item.quantity,
                unit_price = item.medicine.price,
            )
            Medicine.objects.filter(pk=item.medicine.pk).update(
                stock=F("stock") - item.quantity
            )

        cart.items.all().delete()

        return Response(
            OrderSerializer(order, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


# ── CONSULTATIONS ─────────────────────────────────────────────────────────────

class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all().order_by("-created_at")
    serializer_class   = ConsultationSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names  = ["get", "post", "patch", "put", "delete"]