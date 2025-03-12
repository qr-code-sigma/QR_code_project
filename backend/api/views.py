from .models import Event, User
from .serializers import EventSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.db.models import Q, Count
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse, JsonResponse
from rest_framework.pagination import PageNumberPagination

def get_paginated_response(events, request):
    events = events.order_by('id')
    paginator = PageNumberPagination()
    paginator.page_size = 48
    paginated_events = paginator.paginate_queryset(events, request)
    serializer = EventSerializer(paginated_events, many=True)
    response = paginator.get_paginated_response(serializer.data)
    if response.data.get("next"):
        response.data["next"] = response.data["next"].replace("http://", "https://")
    if response.data.get("previous"):
        response.data["previous"] = response.data["previous"].replace("http://", "https://")
    return response
def base(request):
    return HttpResponse("<h1>Hello</h1>")

@api_view(['GET', 'POST'])
def event_list(request):
    user = request.user

    if not user.is_authenticated:
        return JsonResponse({"error": "Not authenticated"}, status=401)

    user = User.objects.get(id=user.id)

    if request.method == "GET":
        events = Event.objects.all()

        if user.status == "guest":
            events = events.filter(status="public")

        filters = Q()
        for key, value in request.GET.items():
            if key in [field.name for field in Event._meta.get_fields()]:
                filters &= Q(**{key: value})
        events = events.filter(filters)
        events = events.annotate(count=Count('userevent__user'))
        return get_paginated_response(events, request)

    elif request.method == "POST":
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET','PUT', 'DELETE', 'PATCH'])
def event_detail(request, id):
    try:
        event = Event.objects.get(pk=id)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'PATCH':
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def events_by_pattern(request, pattern):
    events = Event.objects.filter(name__contains=pattern)
    events = events.annotate(count=Count('userevent__user'))
    return get_paginated_response(events, request)
