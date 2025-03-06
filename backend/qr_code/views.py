from django.shortcuts import render
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse
import qrcode
import qrcode.constants
from api.models import UserEvent 


#i did not use any function pointers in this function because i found it too coomplicated and unneccessary. Also python does not have them but this is secondary reason.
# 
@require_POST #requires POST
def get_qr(request, event_id): #declare function
    try: #try excpet clause
        event_user = UserEvent.objects.get(event_id = event_id, user_id = request.user.id) #get user_event
        qr = qrcode.QRCode( #qr declaration
            version=1,  #version 1
            error_correction=qrcode.constants.ERROR_CORRECT_L, #L error correction
            box_size=10, #box_size = 10
            border = 4) #border = 4
        qr.add_data(f'https://qr-code-project.up.railway.app/QR_code_page.html/{event_user.id}') #add data to qr
        code = qr.get_matrix() #declare code as qr code matrix
        return JsonResponse({"code":code}, status = 200) #return code and status 200
    except Exception: #except exception
        return JsonResponse({"details"}, status = 404) #return 404 if fail
    #
# Create your views here.
