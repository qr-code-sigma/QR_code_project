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
            if places < 10:
                raise serializers.ValidationError("Number of places can not be less than 10")
        return attr