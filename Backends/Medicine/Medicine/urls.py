from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("pharmacy.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# React app — production mein serve karo
if not settings.DEBUG:
    urlpatterns += [
        re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),
    ]