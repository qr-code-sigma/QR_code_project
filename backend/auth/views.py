import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


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
