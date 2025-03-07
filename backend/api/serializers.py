from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'places', 'location', 'date', 'status', 'count']

