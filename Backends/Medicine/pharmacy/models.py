from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=10, blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Medicine(models.Model):
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name="medicines"
    )
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    requires_prescription = models.BooleanField(default=False)
    image = models.ImageField(upload_to="medicines/", null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def discount_percent(self):
        if self.mrp > 0:
            return round((1 - float(self.price) / float(self.mrp)) * 100)
        return 0

    def __str__(self):
        return f"{self.name} ({self.brand})"


class Offer(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, blank=True)
    code = models.CharField(max_length=30, blank=True, unique=True, null=True, default=None)
    discount_percent = models.PositiveIntegerField(default=0)
    discount_flat = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    color = models.CharField(max_length=10, default="#00b894")
    emoji = models.CharField(max_length=5, blank=True)
    badge = models.CharField(max_length=30, blank=True)
    valid_until = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.title


# 👇 Cart

class Cart(models.Model):
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)

    def total(self):
        return sum(item.subtotal() for item in self.items.all())

    def __str__(self):
        return f"Cart — {self.customer_name}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def subtotal(self):
        return self.medicine.price * self.quantity

    def __str__(self):
        return f"{self.quantity}x {self.medicine.name}"


class Order(models.Model):
    STATUS_CHOICES = [
        ("placed", "Placed"),
        ("confirmed", "Confirmed"),
        ("packed", "Packed"),
        ("dispatched", "Dispatched"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15)
    delivery_address = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="placed")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    offer = models.ForeignKey(Offer, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    def net_amount(self):
        return self.total_amount - self.discount_amount

    def __str__(self):
        return f"Order #{self.pk} — {self.customer_name}"

class Prescription(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("verified", "Verified"),
        ("rejected", "Rejected"),
    ]

    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15)
    image = models.ImageField(upload_to="prescriptions/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Rx #{self.pk} — {self.customer_name}"
    
class Consultation(models.Model):
    SPECIALTY_CHOICES = [
        ("general", "General Physician"),
        ("cardiology", "Cardiologist"),
        ("neurology", "Neurologist"),
        ("dentist", "Dentist"),
        ("dermatology", "Dermatologist"),
    ]

    STATUS_CHOICES = [
        ("requested", "Requested"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15)
    specialty = models.CharField(max_length=30, choices=SPECIALTY_CHOICES)
    symptoms = models.TextField()
    appointment_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="requested")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Consult #{self.pk} — {self.customer_name}"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def subtotal(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.quantity}x {self.medicine.name}"