from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from api.models import User

class UserSerizalizer(serializers.ModelSerializer):
    first_name = serializers.CharField(max_length = 30, required = True)
    last_name = serializers.CharField(max_length = 30, required = True)
    email = serializers.EmailField(max_length = 254, required = True)
    password = serializers.CharField(write_only = True, required = True, validators = [validate_password])
    password2 = serializers.CharField(write_only = True, required = True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        

    def validate(self, attr):
        if attr.get("password") != attr.get("password2"):
            raise serializers.ValidationError({"password":"Fields do not match"}) 
        print("Validated")
        return attr
    
    def create(self, data):
        try:
            user = User.objects.create_user(
                    username = data['username'],
                    first_name = data['first_name'],
                    last_name = data['last_name'],
                    email = data['email'],
                    status = "guest"
            )
            user.set_password(self.validate(data).get('password'))
            user.save()
        
            return user
        except Exception:
            print("User already exists")
            raise serializers.ValidationError({"error":"Could not create user"})