import json
from django.core.cache import cache
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_POST, require_GET
from django.middleware.csrf import get_token
from api.models import User, UserEvent
from django.core.mail import EmailMessage
from .serializers import UserSerializer
import threading
import random
from datetime import datetime, timezone

@csrf_exempt
@require_POST
def login_view(request):
    data = json.loads(request.body)
    print(data)
    username = data.get('username')
    password = data.get('password')

    user = authenticate(username=username, password=password)
    print(f"User auth: {user}")
    if user is None:
        print("Ivalid credentials")
        return JsonResponse({'details': 'Invalid credentials!'}, status = 400)

    login(request, user)
    print(f"User after login: {request.user}")
    userdata = get_userdata(user)
    
    return JsonResponse({"userData":userdata, "isAuthenticated":True}, status = 200)

@csrf_exempt
@require_POST
def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'details': 'You are not logged in!'}, status = 403)

    logout(request)
    return JsonResponse({'details': 'Logout successful!'}, status = 200)

def activate_email(request, user, to_email):
    verification_code = random.randint(100000, 999999)
    id_ = user.email
    cache.set(f"otp_{id_}", verification_code, timeout=5000)
    print("Sending email...")
    email_subject = "Account Activation"
    current_time = datetime.now(timezone.utc)
    message = f"""
    Hi {user.username},
    Thank you for registering! Your verification code: {verification_code}
    If you did not request this, please ignore this email. This email was sent at {current_time}, UTC+0
    """
    email = EmailMessage(email_subject, message, to=[to_email])
    if email.send():
        print("Email sent")

@require_POST
@csrf_exempt
def verify_otp(request):
    data = json.loads(request.body)
    try:
        code = data.get('code')
        email = data.get('email')
        user = User.objects.get(email = email)
        print(user)
    except Exception:
        print("Invalid code")
        return JsonResponse({"details":"Invalid code"}, status = 400)

    actual_code = int(cache.get(f"otp_{email}"))
    print(f"Actual code: {actual_code}, entered: {code}")
    if int(code) != actual_code:
        return JsonResponse({"verified":False}, status = 400)
    else:
        print("Valid code, authorizing...")
        user.is_active = True
        user.save()
        login(request, user)
        print(request.user.is_authenticated)
        return JsonResponse({"verified":True}, status = 200)

@csrf_exempt
def register(request):
    if request.user.is_authenticated:
        print("Already authenticated")
        return JsonResponse({"details":"Already authenticated"}, status = 403)
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)
        except json.JSONDecodeError:
            print("Bad json could not decode")
            return JsonResponse({"details":"Server error"}, status = 500)
        serizalizer = UserSerializer(data=data)
        try:
            if serizalizer.is_valid():
                user = serizalizer.save()
                user.is_active = False
                user.save()
                print(user)
                email_thread = threading.Thread(target = activate_email, args = [request, user, user.email])
                email_thread.start()
                return JsonResponse({"success":"User signed up"}, status = 200)
            else:
                details = {k : str(v[0]) for k, v in serizalizer.errors.items() }
                print(details)
                return JsonResponse({"details":details}, status = 400)
        except Exception:
            return JsonResponse({"details":"User already exists"}, status = 403)
    return JsonResponse({"details":"Invalid method"}, status = 400)

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})


@require_GET
def get_me(request):
    print(request.user)
    if request.user.is_authenticated:
        user = request.user
        userdata = get_userdata(user)
        response = {
            "userData": userdata,
            "isAuthenticated": True
        }
        return JsonResponse(response, status = 200)
    else:
        print("User not authenticated")
        return JsonResponse({"details":"User is not authenticated"}, status = 403)

def get_userdata(user):
    username = user.username
    email = user.email
    first_name = user.first_name
    last_name = user.last_name
    status = user.status
    response = {
            "username":username,
            "email":email,
            "first_name":first_name,
            "last_name":last_name,
            "status":status
        }
    return response
