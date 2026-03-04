from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import FileResponse, HttpResponse
import os


def spa_view(request, path=""):
    index = os.path.join(settings.BASE_DIR, "static", "frontend", "index.html")
    if not os.path.exists(index):
        index = os.path.join(settings.STATIC_ROOT, "index.html")
    if os.path.exists(index):
        return FileResponse(open(index, "rb"), content_type="text/html")
    return HttpResponse("Frontend not built. Run: npm run build", status=200)


def asset_view(request, path):
    asset = os.path.join(settings.BASE_DIR, "static", "frontend", "assets", path)
    if not os.path.exists(asset):
        asset = os.path.join(settings.STATIC_ROOT, "assets", path)
    if os.path.exists(asset):
        if path.endswith(".js"):
            ct = "application/javascript"
        elif path.endswith(".css"):
            ct = "text/css"
        elif path.endswith(".svg"):
            ct = "image/svg+xml"
        elif path.endswith(".png"):
            ct = "image/png"
        elif path.endswith(".jpg") or path.endswith(".jpeg"):
            ct = "image/jpeg"
        else:
            ct = "application/octet-stream"
        return FileResponse(open(asset, "rb"), content_type=ct)
    return HttpResponse("Not found", status=404)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("pharmacy.urls")),
    path("assets/<path:path>", asset_view),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + [  # ✅ media pehle
    path("", spa_view),
    path("<path:path>", spa_view),
]