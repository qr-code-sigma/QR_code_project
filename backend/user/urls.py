from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_users),
    path("<int:id>/", views.get_user),
    path("edit", views.edit_user_view),
    path("<int:event_id>/register_for_event", views.event_registration_view),
    path("user_events/", views.get_user_events_view),
    path("user_event/<str:pattern>/", views.user_events_by_pattern)
]
