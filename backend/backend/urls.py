from django.contrib import admin
from django.urls import path, include
from api.views import event_list, event_detail, base
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/events/', event_list, name='events-list'),
    path('api/v1/events/<int:id>', event_detail, name="event-detail"),
    path('api/v1/home', base, name="base")
    path('api/v1/auth/', include('auth.urls'))
]

