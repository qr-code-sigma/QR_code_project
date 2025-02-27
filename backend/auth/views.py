from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, logout
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from api.models import User
from .serializers import UserSerizalizer
import json

#from django.contrib.auth.decorators import


@csrf_exempt
def register(request):
    print("???")
    if request.user.is_authenticated:
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
            login(request, user)
            print(user)
            return JsonResponse({"success":"User signed up"}, status = 200)
        else:
            return JsonResponse({"error":"Invalid data received"}, status = 400)
    return JsonResponse({"error":"Invalid method"})


def get_csrf_token(request):
    response = JsonResponse({"csrfToken": get_token(request)})
    response.set_cookie("csrftoken", get_token(request))
    return response


def logout_(request):
    logout(request)
    return HttpResponse("Logged Out")
