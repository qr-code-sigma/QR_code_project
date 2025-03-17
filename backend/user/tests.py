from django.test import TestCase
from rest_framework.test import APIClient
from api.models import User, Event, UserEvent
from rest_framework import status
from django.urls import reverse
import datetime


class UserTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpassword123",
            email="testuser@example.com",
            first_name="First1",
            last_name="Last1",
            status="guest"
        )
        self.user2 = User.objects.create_user(
            username="testuser2",
            password="testpassword1234",
            email="testuser2@example.com",
            first_name="First2",
            last_name="Last2",
            status="guest"
        )

        self.event = Event.objects.create(
            name="Test event",
            places=50,
            date=datetime.date.today(),
            location="Test Location",
            status="Active"
        )
        self.client = APIClient()

    def test_get_users(self):
        url = reverse('get_users')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertIn('users', response_data)

    def test_get_user(self):
        url = reverse('get_user', args=[self.user.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertEqual(response_data['username'], self.user.username)

    def test_event_registration(self):
        self.client.login(username="testuser", password="testpassword123")
        url = reverse('event_registration_view', args=[self.event.id])
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response_data = response.json()

        self.assertIn('error', response_data)

    def test_edit_user(self):
        self.client.login(username="testuser", password="testpassword123")
        url = reverse('edit_user_view')
        data = {
            "old_password": "testpassword123",
            "new_first_name": "Updated first name",
            "new_last_name": "Updated last name",
        }

        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertEqual(response_data['userData']['first_name'], "Updated first name")
        self.assertEqual(response_data['userData']['last_name'], "Updated last name")


    def test_get_user_events(self):
        self.client.login(username="testuser", password="testpassword123")
        UserEvent.objects.create(user=self.user, event=self.event)

        url = reverse('get_user_events_view')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertIn('results', response_data)

    def test_user_events_by_pattern(self):
        self.client.login(username="testuser", password="testpassword123")
        UserEvent.objects.create(user=self.user, event=self.event)

        url = reverse('user_events_by_pattern', args=["Test"])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertIn('results', response_data)

    def test_get_user_events_not_authenticated(self):
        url = reverse('get_user_events_view')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response_data = response.json()
        self.assertIn('error', response_data)

    def test_get_user_by_nonexistent_id(self):
        url = reverse('get_user', args=[9999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        response_data = response.json()
        self.assertIn('error', response_data)