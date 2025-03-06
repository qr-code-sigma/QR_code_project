from django.db import models
from django.contrib.auth.models import AbstractUser

class Event(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    places = models.IntegerField()
    location = models.CharField(max_length=100)
    date = models.DateField()
    status = models.CharField(max_length=20)

    class Meta:
        db_table = "events"

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=90, unique=True)
    password = models.CharField(max_length=100)
    status = models.CharField(
        max_length=10,
        choices=[('admin', 'Admin'), ('guest', 'Guest'), ('employee', 'Employee')]
    )

    class Meta:
        unique_together = ('first_name', 'last_name')
        db_table = "users"

class UserEvent(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'event')
        db_table = "user_events"
