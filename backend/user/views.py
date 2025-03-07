import json

from django.views.decorators.csrf import csrf_exempt
from api.models import User, Event, UserEvent
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.core.exceptions import ObjectDoesNotExist

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

    return JsonResponse({ "details" : "Successfully registered for the event." }, status = 200)

@csrf_exempt
@require_POST
def edit_user_view(request, id):
    try:
        user = User.objects.get(id=id)
    except ObjectDoesNotExist:
        return JsonResponse({ "error": "User does not exist" }, status = 404)

    data = json.loads(request.body)
    new_first_name = data.get("first_name")
    new_last_name = data.get("last_name")
    new_username = data.get("username")
    new_password = data.get("password")

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


    if new_first_name is not None:
        user.first_name = new_first_name
    if new_last_name is not None:
        user.last_name = new_last_name
    if new_username is not None:
        user.username = new_username
    if new_password is not None:
        user.password = new_password
    user.save()

    return JsonResponse({"details": "User was successfully updated"}, status = 200)
