import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.backend.settings')
django.setup()

from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Event

User = get_user_model()


class EventTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser1",
            email="test@gmail.com",
            password="mostcommonpassword1",
            status="guest",
            first_name="Test",
            last_name="User"
        )

        self.admin_user = User.objects.create_user(
            username="adminuser",
            email="admin@example.com",
            password="adminpassword",
            status="admin",
            first_name="Admin",
            last_name="User"
        )

        self.client.login(username="testuser1", password="mostcommonpassword1")

        self.event = Event.objects.create(
            name="Test event",
            description="This is a test event",
            places=50,
            location="New York",
            date="2025-05-20",
            status="Public"
        )

        self.private_event = Event.objects.create(
            name="Private event",
            description="This is a private event",
            places=25,
            location="Paris",
            date="2025-06-10",
            status="Private"
        )
        self.base_url = "/api/v1/"
        self.events_url = "/api/v1/events/"
        self.event_url = f"/api/v1/events/{self.event.id}"
        self.private_event_url = f"/api/v1/events/{self.private_event.id}"

    def test_base_endpoint(self):
        response = self.client.get(self.base_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("<h1>Hello</h1>", response.content.decode())

    def test_get_all_events(self):
        response = self.client.get(self.events_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["count"], 1)

    def test_get_all_events_as_admin(self):
        self.client.logout()
        self.client.login(username="adminuser", password="adminpassword")

        response = self.client.get(self.events_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertEqual(response.data["count"], 2)

    def test_get_events_with_filter(self):
        self.client.logout()
        self.client.login(username="adminuser", password="adminpassword")

        response = self.client.get("/api/v1/events/?location=New York")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["location"], "New York")

    def test_get_single_event(self):
        response = self.client.get(self.event_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Test event")

    def test_get_private_event_as_guest(self):
        response = self.client.get(self.private_event_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Private event")

    def test_get_nonexistent_event(self):
        response = self.client.get("/api/v1/events/9999")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_event(self):
        new_event = {
            "name": "New test event",
            "description": "Another test event",
            "places": 100,
            "location": "Vinnytsia",
            "date": "2025-06-15",
            "status": "Private"
        }
        response = self.client.post("/api/v1/events/", new_event, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Event.objects.count(), 3)

        created_event = Event.objects.get(name="New test event")
        self.assertEqual(created_event.location, "Vinnytsia")
        self.assertEqual(created_event.places, 100)

    def test_create_event_invalid_data(self):
        invalid_event = {
            "name": "",
            "description": "Invalid event",
            "date": "not-a-date"
        }
        response = self.client.post(self.events_url, invalid_event, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Event.objects.count(), 2)

    def test_update_event(self):
        updated_event = {
            "name": "Updated Event",
            "description": "Updated description",
            "places": 75,
            "location": "Vegas",
            "date": "2025-07-10",
            "status": "Public"
        }
        response = self.client.put(self.event_url, updated_event, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.event.refresh_from_db()
        self.assertEqual(self.event.name, "Updated Event")
        self.assertEqual(self.event.location, "Vegas")
        self.assertEqual(self.event.places, 75)

    def test_partial_update_event(self):
        patch_data = {
            "name": "Partially updated event",
            "places": 60
        }
        response = self.client.patch(self.event_url, patch_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.event.refresh_from_db()
        self.assertEqual(self.event.name, "Partially updated event")
        self.assertEqual(self.event.places, 60)
        self.assertEqual(self.event.location, "New York")

    def test_update_event_invalid_data(self):
        invalid_data = {
            "name": "",
            "places": -10
        }
        response = self.client.put(self.event_url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.event.refresh_from_db()
        self.assertEqual(self.event.name, "Test event")

    def test_delete_event(self):
        response = self.client.delete(self.event_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Event.objects.filter(id=self.event.id).exists())

    def test_events_by_pattern(self):
        Event.objects.create(
            name="Test event XYZ",
            description="Another test event",
            places=40,
            location="Kyiv",
            date="2025-08-15",
            status="Public"
        )

        response = self.client.get("/api/v1/events/Test/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

        for event in response.data["results"]:
            self.assertIn("Test", event["name"])

    def test_https_conversion_in_pagination(self):
        for i in range(50):
            Event.objects.create(
                name=f"Pagination test {i}",
                description=f"Event {i} for pagination testing",
                places=10,
                location="Dombass",
                date="2025-09-01",
                status="Public"
            )

        response = self.client.get(self.events_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn("next", response.data)
        if response.data["next"]:
            self.assertTrue(response.data["next"].startswith("https://"))