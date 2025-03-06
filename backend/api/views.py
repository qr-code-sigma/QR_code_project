from .models import Event
from .serializers import EventSerializer
from rest_framework.decorators import api_view
from django.db.models import Q, Count
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from rest_framework.pagination import PageNumberPagination
import logging
# when react part is ready this should be configured
# def default_page(request):
#     return render(request, 'index.html'
#     )

def base(request):
    return HttpResponse("<h1>Hello</h1>")

logger = logging.getLogger(__name__)

@api_view(['GET', 'POST'])
def event_list(request):
    if request.method == "GET":
        logger.info("Received GET request for event list")

        events = Event.objects.all()
        filters = Q()

        logger.info(f"Filtering parameters: {dict(request.GET)}")

        for key, value in request.GET.items():
            if key in [field.name for field in Event._meta.get_fields()]:
                filters &= Q(**{key: value})
        events = events.filter(filters)
        logger.info(f"Number of events after filtering: {events.count()}")
        events = events.order_by('id')
        events = events.annotate(count=Count('userevent__user'))
        paginator = PageNumberPagination()
        paginator.page_size = 50
        paginated_events = paginator.paginate_queryset(events, request)
        if paginated_events is None:
            logger.warning("Pagination returned an empty event list")
        serializer = EventSerializer(paginated_events, many=True)
        response = paginator.get_paginated_response(serializer.data)
        logger.info(f"Number of events in response: {len(serializer.data)}")
        logger.info(f"Next page: {response.data.get('next')}")
        logger.info(f"Previous page: {response.data.get('previous')}")
        if response.data.get("next"):
            response.data["next"] = response.data["next"].replace("http://", "https://")

        if response.data.get("previous"):
            response.data["previous"] = response.data["previous"].replace("http://", "https://")
        print(response.data)
        return response

    elif request.method == "POST":
        logger.info("Received POST request to create an event")

        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save()
            logger.info(f"Event '{event.name}' created successfully (ID: {event.id})")
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.error(f"Event creation failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



