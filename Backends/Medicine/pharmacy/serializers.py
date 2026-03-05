from rest_framework import serializers
from .models import (
    Category, Medicine, Offer,
    Prescription, Cart, CartItem,
    Order, OrderItem, Consultation,
)

# ─────────── CATEGORY ───────────

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


# ─────────── MEDICINE ───────────

class MedicineSerializer(serializers.ModelSerializer):
    discount_percent = serializers.SerializerMethodField()
    category_slug = serializers.SlugRelatedField(
        source='category',
        slug_field='slug',
        queryset=Category.objects.all(),
        required=False,
        allow_null=True,
        write_only=True
    )

    class Meta:
        model = Medicine
        fields = "__all__"
        extra_fields = ['category_slug']

    def get_discount_percent(self, obj):
        return obj.discount_percent()

    def to_internal_value(self, data):
        # category slug ko ID mein convert karo
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'category' in data and isinstance(data['category'], str):
            try:
                cat = Category.objects.get(slug=data['category'])
                data['category'] = cat.id
            except Category.DoesNotExist:
                pass
        # discount_percent write attempt ignore karo
        data.pop('discount_percent', None)
        return super().to_internal_value(data)


# ─────────── OFFER ───────────

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"


# ─────────── PRESCRIPTION ───────────

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = "__all__"


# ─────────── CART ───────────

class CartItemSerializer(serializers.ModelSerializer):
    medicine = MedicineSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = "__all__"

    def get_subtotal(self, obj):
        return float(obj.subtotal())


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = "__all__"

    def get_total(self, obj):
        return float(obj.total())


# ─────────── ORDER ───────────

class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = "__all__"

    def get_subtotal(self, obj):
        return float(obj.subtotal())


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    net_amount = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = "__all__"

    def get_net_amount(self, obj):
        return float(obj.net_amount())


# ─────────── CONSULTATION ───────────

class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = "__all__"