import json

from django.views.decorators.csrf import csrf_exempt
from api.models import User, Event, UserEvent
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import redirect
from django.urls import reverse
from auth.serializers import UserSerizalizer
from django.contrib.auth.password_validation import validate_password
from django.db.models import Q, Count
from rest_framework.pagination import PageNumberPagination
from api.serializers import EventSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_user_events_view(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"error": "User not authenticated"}, status=401)
    
    try:
        event_ids = UserEvent.objects.filter(user=user).values_list('event', flat=True)
        events = Event.objects.filter(id__in=event_ids)
        events = events.annotate(count=Count('userevent__user'))
        events = events.order_by('id')
        
        paginator = PageNumberPagination()
        paginator.page_size = 21
        
        paginated_events = paginator.paginate_queryset(events, request)
        serializer = EventSerializer(paginated_events, many=True)
        response = paginator.get_paginated_response(serializer.data)
        
        if response.data.get("next"):
            response.data["next"] = response.data["next"].replace("http://", "https://")
        if response.data.get("previous"):
            response.data["previous"] = response.data["previous"].replace("http://", "https://")
            
        return response
        
    except Event.DoesNotExist:
        return Response({"error": "Events not found"}, status=404)
    except Exception as e:
        print(f"Exception 500: {str(e)}")
        return Response({"error": str(e)}, status=500)

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

@require_GET
def get_users(request):
    users = User.objects.all()
    user_list = [{"username":user.username, "first_name":user.first_name, "last_name":user.last_name} for user in users]
    return JsonResponse({"users":user_list}, status = 200)

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

def edit_user_view(request):
    if request.method != 'PUT':
        return JsonResponse({"error": "Invalid method"}, status=405)

    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"error": "User unauthorized"}, status=401)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)

    if not data.get('old_password'):
        return JsonResponse({'error': "Old password not specified"}, status=403)

    if not user.check_password(data["old_password"]):
        return JsonResponse({'error': "Old password is incorrect"}, status=403)

    new_data = {
        "first_name": data.get("new_first_name") or user.first_name,
        "last_name": data.get("new_last_name") or user.last_name,
        "username": data.get("new_username") or user.username,
    }


    serializer = UserSerizalizer(instance=user, data=new_data, partial=True)

    if serializer.is_valid():
        print("Serializer is valid")
        user = serializer.save()
        if "new_password" in data and data["new_password"]:

            if len(data["new_password"]) > 100:
                return JsonResponse({"error": "Password is too long"}, status=400)
            try:
                validate_password(data['new_password'], user)
            except Exception:
                return JsonResponse({"error":"Invalid password"}, status = 403)
            user.set_password(data["new_password"])
            user.save()

        return JsonResponse({"details": "User was successfully updated", 
                             "userData": 
                                {
                                    "username":user.username,
                                    "first_name":user.first_name,
                                    "last_name":user.last_name,
                                    "email":user.email,
                                    "status":user.status
                                }}, status=200)

    print("Serializer is not valid")
    print(serializer.errors)
    return JsonResponse({"error": serializer.errors}, status=400)

@api_view(['GET'])
def user_events_by_pattern(request, pattern):
    user = request.user
    if not user.is_authenticated:
        return Response({"error": "User not authenticated"}, status=401)
        
    event_ids = UserEvent.objects.filter(user=user).values_list('event', flat=True)
    
    events = Event.objects.filter(
        Q(id__in=event_ids) | Q(name__contains=pattern) 
    ).annotate(count=Count('userevent__user'))
    
    paginator = PageNumberPagination()
    paginator.page_size = 21
    paginated_events = paginator.paginate_queryset(events, request)
    serializer = EventSerializer(paginated_events, many=True)
    response = paginator.get_paginated_response(serializer.data)
    
    if response.data.get("next"):
        response.data["next"] = response.data["next"].replace("http://", "https://")
    if response.data.get("previous"):
        response.data["previous"] = response.data["previous"].replace("http://", "https://")
        
    return response
