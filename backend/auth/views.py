import json
from django.core.cache import cache
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.middleware.csrf import get_token
from api.models import User
from django.core.mail import EmailMessage
from .serializers import UserSerizalizer
import threading 
import random
from datetime import datetime, timezone

@csrf_exempt
@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    
    # CRITICAL DEBUGGING PRINT STATEMENTS
    print("Login Attempt Received")
    print(f"Username: {username}")
    
    # Check authentication mechanism
    user = authenticate(username=username, password=password)
    print(f"Authentication Result: {user}")
    
    if user is None:
        print("Authentication Failed")
        return JsonResponse({'details': 'Invalid credentials!'}, status=400)

    # CRITICAL: Check login process
    try:
        login(request, user)
        print(f"Login Successful for user: {user.username}")
        print(f"Session Key: {request.session.session_key}")
        print(f"Session Exists: {request.session.exists(request.session.session_key)}")
    except Exception as e:
        print(f"Login Exception: {e}")
        return JsonResponse({'details': 'Login failed due to internal error'}, status=500)

    # Explicit session creation debugging
    print(f"Session Data: {request.session.items()}")
    print(f"Session Cookies: {request.COOKIES}")
    
    # Explicitly create and set session cookie
    response = JsonResponse({
        'details': 'Login successful!',
        'session_key': request.session.session_key
    }, status=200)
    
    # Manually set session cookie
    response.set_cookie(
        'sessionid', 
        request.session.session_key, 
        httponly=True, 
        samesite='Lax',  # or 'None' if using HTTPS
        secure=False  # set to True in production with HTTPS
    )
    
    # Additional logging for cookie setting
    print(f"Set-Cookie Header: {response.headers.get('Set-Cookie', 'No Set-Cookie header')}")
    
    return response

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
        login(request, user)
        print(request.user)
        print(request.user.is_authenticated)
        print(request.COOKIES.get('sessionid'))
        request.session.set_expiry(3600)  
        request.session.save()
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
        serizalizer = UserSerizalizer(data=data)
        try:
            if serizalizer.is_valid():
                user = serizalizer.save()
                user.is_active = False
                print(user)
                email_thread = threading.Thread(target = activate_email, args = [request, user, user.email])
                email_thread.start()
                #email_thread.join()
                return JsonResponse({"success":"User signed up"}, status = 200)
            else:
                details = {k : str(v[0]) for k, v in serizalizer.errors.items() }
                print(details)
                return JsonResponse({"details":details}, status = 400)
        except Exception:
            return JsonResponse({"details":"User already exists"}, status = 403)
    return JsonResponse({"details":"Invalid method"}, status = 400)

@csrf_exempt
def get_csrf_token(request):
    response = JsonResponse({"csrfToken": get_token(request)})
    response.set_cookie("csrftoken", get_token(request))
    return response

@csrf_exempt
@require_GET
def get_me(request):
    if request.user.is_authenticated:
        user = request.user
        username = user.username
        email = user.email
        first_name = user.first_name
        last_name = user.last_name
        response = {
            "userData" : {
                "username":username,
                "email":email,
                "first_name":first_name,
                "last_name":last_name},
            "isAuthenticated" : True
        }
        return JsonResponse(response, status = 200)        
    else:
        print("User not authenticated")
        return JsonResponse({"details":"User is not authenticated"}, status = 403)