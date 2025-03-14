from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'places', 'location', 'date', 'status', 'count']

    def validate(self, attr):
        places = attr.get("places")
        if places is not None:
            if places < 0:
                raise serializers.ValidationError("Number of places ca not be negative")
        return attr