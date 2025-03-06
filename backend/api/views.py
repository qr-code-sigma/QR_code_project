from .models import Event
from .serializers import EventSerializer
from rest_framework.decorators import api_view
from django.db.models import Q
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from rest_framework.pagination import PageNumberPagination

# when react part is ready this should be configured
# def default_page(request):
#     return render(request, 'index.html'
#     )

def base(request):
    return HttpResponse("<h1>Hello</h1>")

@api_view(['GET', 'POST'])
def event_list(request):
    if request.method == "GET":
        events = Event.objects.all()
        filters = Q()
        for key, value in request.GET.items():
            if key in [field.name for field in Event._meta.get_fields()]:
                filters &= Q(**{key: value})
        events = events.filter(filters)
        events = events.order_by('id')
        paginator = PageNumberPagination()
        paginator.page_size = 50
        paginated_events = paginator.paginate_queryset(events, request)
        serializer = EventSerializer(paginated_events, many=True)

        if serializer.data["next"]:
            serializer.data["next"] = serializer.data["next"].replace(
                "http://", "https://"
            )

        if serializer.data["previous"]:
            serializer.data["previous"] = serializer.data["previous"].replace(
                "http://", "https://"
            )

        return paginator.get_paginated_response(serializer.data)

    elif request.method == "POST":
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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






