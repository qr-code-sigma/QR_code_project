from django.contrib import admin
from .models import User, UserEvent, Event


admin.site.register(User)
admin.site.register(UserEvent)
admin.site.register(Event)
