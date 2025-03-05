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

@csrf_exempt
@require_POST
def login_view(request):
    data = json.loads(request.body)
    print(data)
    username = data.get('username')
    password = data.get('password')

    user = authenticate(username=username, password=password)

    if user is None:
        print("Ivalid credentials")
        return JsonResponse({'details': 'Invalid credentials!'}, status = 400)

    login(request, user)
    return JsonResponse({'details': 'Login successful!'}, status = 200)

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
    message = f"""
    Hi {user.username},
    Thank you for registering! Your verification code: {verification_code}
    If you did not request this, please ignore this email.
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
        print("Nichogo")
        return JsonResponse({"details":"Invalid data"}, status = 400)

    actual_code = int(cache.get(f"otp_{email}"))
    print(actual_code)
    if int(code) != actual_code:
        return JsonResponse({"verified":False}, status = 400)
    else:
        user.is_active = True
        login(request, user)
        return JsonResponse({"verified":True}, status = 200)

@csrf_exempt
@require_POST
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
                user.is_active = False
                user = serizalizer.save()
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
            return JsonResponse({"details":"User already exists"})
    return JsonResponse({"details":"Invalid method"})


def get_csrf_token(request):
    response = JsonResponse({"csrfToken": get_token(request)})
    response.set_cookie("csrftoken", get_token(request))
    return response

@require_GET
def get_me(request):
    if request.user.is_authenticated:
        user = request.user
        username = user.username
        email = user.email
        first_name = user.first_name
        last_name = user.last_name
        response = {
            "username":username,
            "email":email,
            "first_name":first_name,
            "last_name":last_name
        }
        return JsonResponse(response, status = 200)        
    else:
        print("User not authenticated")
        return JsonResponse({"error":"User is not authenticated"}, status = 403)