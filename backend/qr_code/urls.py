from django.urls import path
from qr_code import views

app_name = "qr_code"

urlpatterns = [
    path("get_qr_code/<int:event_id>", views.get_qr, name = "get_qr_code"),
    path("invitation/<str:event_user_id>", views.render_qr_page, name="Invitation")
]