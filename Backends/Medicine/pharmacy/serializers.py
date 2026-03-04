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

    class Meta:
        model = Medicine
        fields = "__all__"

    def get_discount_percent(self, obj):
        return obj.discount_percent()


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