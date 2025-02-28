from django.urls import path
from . import views 

urlpatterns = [
    path("register", views.register, name="register"),
    path("csrf-token", views.get_csrf_token, name="csrf_token"),
    path('activate/<uidb64>/<token>', views.activate_account, name='activate')
]