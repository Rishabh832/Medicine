from django.contrib import admin
from .models import (
    Category, Medicine, Offer,
    Prescription, Cart, CartItem,
    Order, OrderItem, Consultation,
)

# ─────────────────────────────────────────────
# CATEGORY
# ─────────────────────────────────────────────

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "icon")
    prepopulated_fields = {"slug": ("name",)}


# ─────────────────────────────────────────────
# MEDICINE
# ─────────────────────────────────────────────

@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = (
        "name", "brand", "category",
        "price", "mrp", "stock",
        "requires_prescription", "is_active"
    )
    list_filter = ("category", "requires_prescription", "is_active")
    search_fields = ("name", "brand")
    list_editable = ("price", "stock", "is_active")


# ─────────────────────────────────────────────
# OFFER
# ─────────────────────────────────────────────

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = (
        "title", "code",
        "discount_percent", "discount_flat",
        "is_active", "valid_until"
    )
    list_filter = ("is_active",)


# ─────────────────────────────────────────────
# PRESCRIPTION
# ─────────────────────────────────────────────

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = (
        "id", "customer_name",
        "customer_phone", "status",
        "uploaded_at"
    )
    list_filter = ("status",)
    search_fields = ("customer_name", "customer_phone")
    actions = ["mark_verified", "mark_rejected"]

    @admin.action(description="Mark selected as Verified")
    def mark_verified(self, request, queryset):
        queryset.update(status="verified")

    @admin.action(description="Mark selected as Rejected")
    def mark_rejected(self, request, queryset):
        queryset.update(status="rejected")


# ─────────────────────────────────────────────
# CART
# ─────────────────────────────────────────────

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("customer_name", "customer_phone", "created_at")
    inlines = [CartItemInline]


# ─────────────────────────────────────────────
# ORDER
# ─────────────────────────────────────────────

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("subtotal",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "customer_phone",
        "status",
        "total_amount",
        "discount_amount",
        "created_at"
    )
    list_filter = ("status",)
    search_fields = ("customer_name", "customer_phone")
    inlines = [OrderItemInline]
    actions = ["mark_dispatched", "mark_delivered"]

    @admin.action(description="Mark selected as Dispatched")
    def mark_dispatched(self, request, queryset):
        queryset.update(status="dispatched")

    @admin.action(description="Mark selected as Delivered")
    def mark_delivered(self, request, queryset):
        queryset.update(status="delivered")


# ─────────────────────────────────────────────
# CONSULTATION
# ─────────────────────────────────────────────

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "customer_phone",
        "specialty",
        "appointment_date",
        "status"
    )
    list_filter = ("specialty", "status")
    search_fields = ("customer_name", "customer_phone")