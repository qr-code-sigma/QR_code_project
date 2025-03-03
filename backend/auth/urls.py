from django.urls import path
from auth import views

urlpatterns = [
    path('login/', views.login_view, name='login_view'),
    path('logout/', views.logout_view, name='logout_view'),
    path("register", views.register, name="register"),
    path("csrf-token", views.get_csrf_token, name="csrf_token"),
    path("confirm_email", views.verify_otp)
    #path('activate/<uidb64>/<token>', views.activate_account, name='activate')
]
