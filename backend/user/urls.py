from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_users),
    path("<int:id>/", views.get_user),
    path("<int:id>/edit", views.edit_user_view),
    path("<int:event_id>/register_for_event", views.event_registration_view),
]
