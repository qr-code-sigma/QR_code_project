import os
import django
import random
import json
import io
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.backend.settings')
django.setup()

from rest_framework.test import APITestCase
from rest_framework import status
from django.core.cache import cache
from django.test import override_settings
from django.urls import reverse
from django.contrib.auth import get_user_model
from unittest.mock import patch

User = get_user_model()


class SuppressOutput:

    def __enter__(self):
        self.stdout = sys.stdout
        sys.stdout = io.StringIO()
        return self

    def __exit__(self, *args):
        sys.stdout = self.stdout


CACHE_OVERRIDE = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}


@override_settings(CACHES=CACHE_OVERRIDE)
class AuthTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser1",
            email="test@gmail.com",
            password="strongpassword123",
            status="guest",
            first_name="Test",
            last_name="User",
            is_active=True
        )

        self.admin_user = User.objects.create_user(
            username="adminuser",
            email="admin@gmail.com",
            password="adminpassword",
            status="admin",
            first_name="Admin",
            last_name="User",
            is_active=True
        )

        self.new_user_data = {
            "username": "newuser",
            "email": "newuser@gmail.com",
            "password": "NewUser123!",
            "password2": "NewUser123!",
            "first_name": "New",
            "last_name": "User"
        }

        self.login_url = reverse('login_view')
        self.logout_url = reverse('logout_view')
        self.register_url = reverse('register')
        self.get_me_url = reverse('get_me')
        self.confirm_email_url = reverse('confirm_email')
        self.csrf_token_url = reverse('csrf_token')

    def test_csrf_token(self):
        with SuppressOutput():
            response = self.client.get(self.csrf_token_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response_data = json.loads(response.content)
            self.assertIn('csrfToken', response_data)

    def test_login_success(self):
        with SuppressOutput():
            login_data = {
                "username": "testuser1",
                "password": "strongpassword123"
            }
            response = self.client.post(self.login_url, login_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response_data = json.loads(response.content)
            self.assertTrue(response_data["isAuthenticated"])
            self.assertEqual(response_data["userData"]["username"], "testuser1")
            self.assertEqual(response_data["userData"]["email"], "test@gmail.com")

    def test_login_invalid_credentials(self):
        with SuppressOutput():
            login_data = {
                "username": "testuser1",
                "password": "wrongpassword"
            }
            response = self.client.post(self.login_url, login_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            response_data = json.loads(response.content)
            self.assertIn("Invalid credentials", response_data["details"])

    def test_logout(self):
        with SuppressOutput():
            self.client.login(username="testuser1", password="strongpassword123")

            response = self.client.post(self.logout_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response_data = json.loads(response.content)
            self.assertIn("Logout successful", response_data["details"])

            get_me_response = self.client.get(self.get_me_url)
            self.assertEqual(get_me_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logout_not_authenticated(self):
        with SuppressOutput():
            response = self.client.post(self.logout_url)
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
            response_data = json.loads(response.content)
            self.assertIn("not logged in", response_data["details"].lower())

    @patch('threading.Thread')
    def test_register_user(self, mock_thread):
        with SuppressOutput():
            mock_thread_instance = mock_thread.return_value
            mock_thread_instance.start.return_value = None

            response = self.client.post(self.register_url, self.new_user_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response_data = json.loads(response.content)
            self.assertIn("success", response_data)
            self.assertTrue(User.objects.filter(username="newuser").exists())

            new_user = User.objects.get(username="newuser")
            self.assertFalse(new_user.is_active)

            mock_thread.assert_called_once()

    def test_register_password_mismatch(self):
        with SuppressOutput():
            mismatched_data = self.new_user_data.copy()
            mismatched_data["password2"] = "DifferentPassword123!"

            response = self.client.post(self.register_url, mismatched_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            response_data = json.loads(response.content)
            self.assertIn("password", response_data["details"])
            self.assertIn("not match", response_data["details"]["password"].lower())

    def test_register_duplicate_user(self):
        with SuppressOutput():
            duplicate_data = self.new_user_data.copy()
            duplicate_data["username"] = "testuser1"

            response = self.client.post(self.register_url, duplicate_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            response_data = json.loads(response.content)
            self.assertTrue(
                "already exists" in str(response_data).lower() or
                "user with that username already exists" in str(response_data).lower()
            )

    @patch('threading.Thread')
    def test_register_while_authenticated(self, mock_thread):
        with SuppressOutput():
            self.client.login(username="testuser1", password="strongpassword123")

            response = self.client.post(self.register_url, self.new_user_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
            response_data = json.loads(response.content)
            self.assertIn("already authenticated", response_data["details"].lower())

    def test_get_me_authenticated(self):
        with SuppressOutput():
            self.client.login(username="testuser1", password="strongpassword123")

            response = self.client.get(self.get_me_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response_data = json.loads(response.content)
            self.assertTrue(response_data["isAuthenticated"])
            self.assertEqual(response_data["userData"]["username"], "testuser1")
            self.assertEqual(response_data["userData"]["email"], "test@gmail.com")
            self.assertEqual(response_data["userData"]["first_name"], "Test")
            self.assertEqual(response_data["userData"]["last_name"], "User")
            self.assertEqual(response_data["userData"]["status"], "guest")

    def test_get_me_not_authenticated(self):
        with SuppressOutput():
            response = self.client.get(self.get_me_url)
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
            response_data = json.loads(response.content)
            self.assertIn("not authenticated", response_data["details"].lower())

    def test_verify_otp(self):
        with SuppressOutput():
            user = User.objects.create_user(
                username="otptest",
                email="otptest@gmail.com",
                password="OtpTest123!",
                first_name="OTP",
                last_name="Test",
                is_active=False
            )

            verification_code = random.randint(100000, 999999)
            cache.set(f"otp_{user.email}", verification_code, timeout=5000)

            verify_data = {
                "code": str(verification_code),
                "email": user.email
            }

            response = self.client.post(self.confirm_email_url, verify_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response_data = json.loads(response.content)
            self.assertTrue(response_data["verified"])

            user.refresh_from_db()
            self.assertTrue(user.is_active)

    def test_verify_otp_invalid_code(self):
        with SuppressOutput():
            user = User.objects.create_user(
                username="otptest2",
                email="otptest2@gmail.com",
                password="OtpTest123!",
                first_name="OTP",
                last_name="Test",
                is_active=False
            )

            actual_code = 123456
            cache.set(f"otp_{user.email}", actual_code, timeout=5000)

            verify_data = {
                "code": "654321",
                "email": user.email
            }

            response = self.client.post(self.confirm_email_url, verify_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            response_data = json.loads(response.content)
            self.assertFalse(response_data["verified"])

            user.refresh_from_db()
            self.assertFalse(user.is_active)

    def test_verify_otp_invalid_email(self):
        with SuppressOutput():
            verify_data = {
                "code": "123456",
                "email": "nonexistent@gmail.com"
            }

            response = self.client.post(self.confirm_email_url, verify_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            response_data = json.loads(response.content)
            self.assertIn("Invalid code", response_data["details"])