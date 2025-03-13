import json

from django.views.decorators.csrf import csrf_exempt
from api.models import User, Event, UserEvent
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import redirect
from django.urls import reverse
from auth.serializers import UserSerizalizer

@csrf_exempt
@require_GET
def get_user_events_view(request, id):
    try:
        user_id = int(id)
    except ValueError:
        return JsonResponse({"error": "Invalid id"}, status=400)

    try:
        user = User.objects.get(pk=user_id)
    except ObjectDoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    user_request = request.user

    if user_request.username != user.username:
        return JsonResponse({"error": "User not authorized"}, status=401)

    event_ids = UserEvent.objects.filter(user=user_id).values_list('event', flat=True)
    events = Event.objects.filter(id=event_ids)

    return JsonResponse({"events": events}, status=200)

@csrf_exempt
@require_GET
def get_user(request, id):
    try:
        user = User.objects.get(id=id)
    except ObjectDoesNotExist:
        return JsonResponse({"error":"User does not exist"}, status = 404)
    response = {
        "username":user.username,
        "first_name":user.first_name,
        "last_name":user.last_name
    }
    return JsonResponse(response, status = 200)

@csrf_exempt
@require_GET
def get_users(request):
    users = User.objects.all()
    user_list = [{"username":user.username, "first_name":user.first_name, "last_name":user.last_name} for user in users]
    return JsonResponse({"users":user_list}, status = 200)

@csrf_exempt
@require_POST
def event_registration_view(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except ObjectDoesNotExist:
        return JsonResponse({ "error" : "Event does not exist" }, status = 404)

    user = request.user

    if UserEvent.objects.filter(event=event, user=user).exists():
        return JsonResponse({ "error" : "You are already registered for this event." }, status = 400)

    user_event = UserEvent.objects.create(event=event, user=user)
    user_event.save()

    return redirect(reverse("qr_code:get_qr_code", args=[event_id]))

@csrf_exempt
def edit_user_view(request):
    if request.method != 'PUT':
        return JsonResponse({"erorr":"Invalid method"}, status = 405)
    try:
        user = request.user
    except Exception:
        return JsonResponse({ "error": "User unathorized" }, status = 401)

    data = json.loads(request.body)
    if not data.get('old_password'):
        return JsonResponse({'error':"old password not specified"}, status = 403)
    new_first_name = data.get("first_name") if data.get('first_name') else user.first_name
    new_last_name = data.get("last_name") if data.get('last_name') else user.last_name
    new_username = data.get("username") if data.get('username') else user.username
    new_password = data.get("new_password") if data.get('new_password') else user.password
    new_data = {"first_name":new_first_name, "last_name":new_last_name, "username":new_username, "password":new_password}
    serializer = UserSerizalizer(data=new_data)
    
    if new_first_name:
        if len(new_first_name) > 50:
            return JsonResponse({ "error": "First name is too long" }, status = 400)

    if new_last_name:
        if len(new_last_name) > 50:
            return JsonResponse({ "error": "Last name is too long" }, status = 400)

    if new_username:
        if len(new_username) > 50:
            return JsonResponse({ "error": "Username is too long" }, status = 400)

        existing_user = User.objects.exclude(pk=id).filter(username=new_username)
        if existing_user:
            return JsonResponse({ "error": "User already exists" }, status = 404)

    if new_password:
        if len(new_password) > 100:
            return JsonResponse({ "error": "Password is too long" }, status = 400)
    try:
        if serializer.is_valid():
            user = serializer.save()
            user.save()
    except Exception:
        return JsonResponse({'details':"Could not create user"})

    return JsonResponse({"details": "User was successfully updated"}, status = 200)
