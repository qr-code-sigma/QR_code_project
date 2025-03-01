import json

from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.middleware.csrf import get_token
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.contrib import messages
from django.contrib.auth.tokens import default_token_generator
from .serializers import UserSerizalizer

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
    print("Sending email...")
    email_subject = "Account Activation"
    activation_link = f"{'https' if request.is_secure() else 'http'}://{get_current_site(request).domain}/api/v1/auth/activate/{urlsafe_base64_encode(force_bytes(user.pk))}/{default_token_generator.make_token(user)}"
    message = f"""
    Hi {user.username},
    Thank you for registering! Please activate your account by clicking the link below:
    {activation_link}
    If you did not request this, please ignore this email.
    """
    messages.success(request, "Thank you for registration! Please confirm your email by clicking the activation link we sent!")
    
    email = EmailMessage(email_subject, message, to=[to_email])
    if email.send():
        print("Email sent")


@csrf_exempt
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
            activate_email(request, user, user.email)
            return JsonResponse({"success":"User signed up"}, status = 200)
        else:
            [print(f'Field {k} : {v}') for k , v in serizalizer.errors.items()]
            return JsonResponse({"error":"Invalid data received"}, status = 400)
    return JsonResponse({"error":"Invalid method"})


def get_csrf_token(request):
    response = JsonResponse({"csrfToken": get_token(request)})
    response.set_cookie("csrftoken", get_token(request))
    return response



def activate_account(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = get_user_model().objects.get(pk=uid)
        
        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            messages.success(request, "Your account has been activated")
            return redirect('/api/v1/events')
        else:
            messages.error(request, "Invalid or expired token")
            return redirect("register")
        
    except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
        messages.error(request, "Invalid link")
        return redirect('register')
