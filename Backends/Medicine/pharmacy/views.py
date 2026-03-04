from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q, F   # ← F added for stock update
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

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


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.filter(is_active=True).select_related("category")
    serializer_class = MedicineSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
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


class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.filter(is_active=True)
    serializer_class = OfferSerializer
    permission_classes = [permissions.AllowAny]


class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all().order_by("-uploaded_at")
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # ✅ JSONParser add kiya

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


class AddCartItemView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart_id     = request.data.get("cart_id")
        medicine_id = request.data.get("medicine_id")

        # ✅ BUG 1 FIX — safe int conversion
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

        item, _ = CartItem.objects.get_or_create(cart=cart, medicine=medicine)
        item.quantity = quantity
        item.save()
        return Response(CartSerializer(cart, context={"request": request}).data)


# ── ORDER ─────────────────────────────────────────────────────────────────────

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class   = OrderSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names  = ["get", "post"]

    # ✅ BUG 5 FIX — orders only visible by phone number
    def get_queryset(self):
        phone = self.request.query_params.get("phone")
        qs = Order.objects.prefetch_related("items__medicine")
        if phone:
            return qs.filter(customer_phone=phone)
        return qs.none()   # no phone = nothing exposed

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

        total = float(cart.total())

        # ✅ BUG 4 FIX — apply offer/discount
        offer_code = request.data.get("offer_code")
        discount   = 0.0
        offer_obj  = None

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

        # ✅ BUG 2 FIX — decrement stock on order
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


# ── CONSULTATION ──────────────────────────────────────────────────────────────

class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all().order_by("-created_at")
    serializer_class   = ConsultationSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ["get", "post", "patch", "put", "delete"]