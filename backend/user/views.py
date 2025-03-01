from api.models import User
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.core.exceptions import ObjectDoesNotExist


@require_GET
def get_user(request, id):
    print("Hello")
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