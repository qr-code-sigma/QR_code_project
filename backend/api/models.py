from django.db import models


class Event(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    places = models.IntegerField()
    location = models.CharField(max_length=100)
    date = models.DateField()

    class Meta:
        db_table = "events"
        managed = False


class User(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.CharField(max_length=90, unique=True)
    password = models.CharField(max_length=100)
    status = models.CharField(
        max_length=10,
        choices=[('admin', 'Admin'), ('guest', 'Guest'), ('employee', 'Employee')]
    )

    class Meta:
        db_table = "users"
        unique_together = ('first_name', 'last_name')
        managed = False


class UserEvent(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    class Meta:
        db_table = "user_event"
        unique_together = ('user', 'event')
        managed = False
