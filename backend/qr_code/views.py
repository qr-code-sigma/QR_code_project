from django.shortcuts import render
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse
import qrcode
import qrcode.constants
from api.models import UserEvent 



@require_POST 
def get_qr(request, event_id): 
    try: 
        event_user = UserEvent.objects.get(event_id = event_id, user_id = request.user.id) 
        print(f"Creating a QR code for invitaion {event_user} for user {request.user.id} on event {event_id}")
        qr = qrcode.QRCode( 
            version=1,  
            error_correction=qrcode.constants.ERROR_CORRECT_L, 
            box_size=10, 
            border = 4) 
        qr.add_data(f'https://qr-code-project.up.railway.app/QR_code_page.html/{event_user.id}') 
        code = qr.get_matrix() 
        print(f"Code: {code}") #temporary
        return JsonResponse({"code":code}, status = 200) 
    except Exception: 
        return JsonResponse({"details":"Cound not create QR code"}, status = 404) 
    
    
