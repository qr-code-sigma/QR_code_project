from django.shortcuts import get_object_or_404
from api.models import User
from django.http import JsonResponse



def get_user(request, id):
    print("Hello")
    user = get_object_or_404(User, id = id)
    response = {
        "username":user.username,
        "fisrt_name":user.first_name,
        "last_name":user.last_name
    }
    return JsonResponse(response, status = 200)



def get_users(request):
    users = User.objects.all()
    user_list = [{"username":user.username, "fisrt_name":user.first_name, "last_name":user.last_name} for user in users]
    return JsonResponse({"users":user_list}, status = 200)