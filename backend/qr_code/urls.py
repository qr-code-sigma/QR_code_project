from django.urls import path
from qr_code import views

urlpatterns = [
    path("get_qr_code/<int:event_id>", views.get_qr),
    path("invitation/<int:event_user_id>", views.render_qr_page, name="Invitation")
]