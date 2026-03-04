from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import FileResponse, HttpResponseNotFound
import os

def serve_react(request, *args, **kwargs):
    index_path = os.path.join(settings.BASE_DIR, 'staticfiles', 'frontend', 'index.html')
    if os.path.exists(index_path):
        return FileResponse(open(index_path, 'rb'), content_type='text/html')
    index_path2 = os.path.join(settings.BASE_DIR, 'static', 'frontend', 'index.html')
    if os.path.exists(index_path2):
        return FileResponse(open(index_path2, 'rb'), content_type='text/html')
    return HttpResponseNotFound("index.html not found")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("pharmacy.urls")),
    path("", serve_react),
    path("<path:path>", serve_react),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)