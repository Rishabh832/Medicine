from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    MedicineViewSet,
    OfferViewSet,
    PrescriptionViewSet,
    ConsultationViewSet,
    OrderViewSet,
    CartView,
    AddCartItemView,
)

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"medicines", MedicineViewSet, basename="medicine")
router.register(r"offers", OfferViewSet, basename="offer")
router.register(r"prescriptions", PrescriptionViewSet, basename="prescription")
router.register(r"consultations", ConsultationViewSet, basename="consultation")
router.register(r"orders", OrderViewSet, basename="order")

urlpatterns = [

    # ── Cart APIs ─────────────────────────────
    path("cart/create/", CartView.as_view(), name="cart-create"),
    path("cart/<int:cart_id>/", CartView.as_view(), name="cart-detail"),
    path("cart/add/", AddCartItemView.as_view(), name="cart-add-item"),

    # ── Router APIs ───────────────────────────
    path("", include(router.urls)),
]