from django.urls import path
from auth import views

urlpatterns = [
    path('login/', views.login_view, name='login_view'),
    path('logout/', views.logout_view, name='logout_view'),
    path("register", views.register, name="register"),
    path("csrf-token/", views.get_csrf_token, name="csrf_token"),
    path("confirm_email", views.verify_otp, name = "confirm_email"),
    path("get_me", views.get_me),
    path("fake", views.fake_func)
]
