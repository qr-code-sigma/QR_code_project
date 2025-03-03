import json
from django.core.cache import cache
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.middleware.csrf import get_token
from api.models import User
from django.core.mail import EmailMessage
from django.contrib.auth.tokens import default_token_generator
from .serializers import UserSerizalizer
import threading 
import random 

@csrf_exempt
@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({'details': 'Invalid credentials!'})

    login(request, user)
    return JsonResponse({'details': 'Login successful!'})

@csrf_exempt
@require_POST
def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'details': 'You are not logged in!'})

    logout(request)
    return JsonResponse({'details': 'Logout successful!'})

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
        return JsonResponse({"error":"Invalid data"}, status = 400)

    actual_code = int(cache.get(f"otp_{email}"))
    print(actual_code)
    if int(code) != actual_code:
        print("Shos")
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
        return JsonResponse({"error":"Already authenticated"}, status = 403)
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            print("Bad json could not decode")
            return JsonResponse({"error":"bad request"}, status = 400)
        serizalizer = UserSerizalizer(data=data)
        if serizalizer.is_valid():
            user = serizalizer.save()
            user.is_active = False
            print(user)
            email_thread = threading.Thread(target = activate_email, args = [request, user, user.email])
            email_thread.start()
            return JsonResponse({"success":"User signed up"}, status = 200)
        else:
            [print(f'Field {k} : {v}') for k , v in serizalizer.errors.items()]
            return JsonResponse({"error":"Invalid data received"}, status = 400)
    return JsonResponse({"error":"Invalid method"})


def get_csrf_token(request):
    response = JsonResponse({"csrfToken": get_token(request)})
    response.set_cookie("csrftoken", get_token(request))
    return response



# def activate_account(request, uidb64, token):
#     try:
#         uid = force_str(urlsafe_base64_decode(uidb64))
#         user = get_user_model().objects.get(pk=uid)
        
#         if default_token_generator.check_token(user, token):
#             user.is_active = True
#             user.save()
#             return None #ssilka na front
#         else:
#             return None
        
#     except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
#         return redirect('register')
