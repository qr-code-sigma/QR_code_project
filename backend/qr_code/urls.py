from django.urls import path
from qr_code import views

urlpatterns = [
    path("get_qr_code/<int:event_id>", views.get_qr),
    path("invitation/")
]