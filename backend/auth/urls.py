from django.urls import path
from . import views 

urlpatterns = [
    path("register", views.register, name="register"),
    path("csrf-token", views.get_csrf_token, name="csrf_token"),
    path("logout", views.logout_)
]