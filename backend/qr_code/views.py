from django.shortcuts import render
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse
import qrcode
import qrcode.constants
from api.models import UserEvent, User, Event
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@require_GET
def get_qr(request, event_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error":"User not authenticated"}, status = 401)
    try:
        event_user = UserEvent.objects.get(event_id = event_id, user_id = request.user.id)
    except Exception:
        return JsonResponse({"details":"User is not registered for this event", "isRegistered":False}, status = 200) 
    print(f"Creating a QR code for invitaion {event_user} for user {request.user.id} on event {event_id}")
    try:
        qr = qrcode.QRCode( 
            version=1,  
            error_correction=qrcode.constants.ERROR_CORRECT_L, 
            box_size=10, 
            border = 4) 
        qr.add_data(f'https://qr-code-project.up.railway.app/qr_page/{event_user.id}')
    except Exception:
        return JsonResponse({"error": "Coul not create a QR code"}, status = 500) 
    code = qr.get_matrix() 
    print(f"Code: {code}") #temporary
    return JsonResponse({"code":code}, status = 200) 
    

@require_GET
def render_qr_page(request, event_user_id):
    try:
        print("Trying to get an object...")
        print(UserEvent.objects.all())
        event_user = UserEvent.objects.get(id=event_user_id)
        print(f"Event user: {event_user}")

        event_id = event_user.event_id
        user_id = event_user.user_id

        user = User.objects.get(id = user_id)
        event = Event.objects.get(id = event_id)

        first_name = user.first_name
        last_name = user.last_name
        event_name = event.name
        print(f"Getting {first_name} {last_name} from event {event_name}")
        context = {"first_name":first_name, "last_name":last_name, "event":event_name}
        return render(request, "QR_code_page.html", context=context)
    except Exception:
        print("Failed")
        return render(request, "temaplate_no_invitation.html")
