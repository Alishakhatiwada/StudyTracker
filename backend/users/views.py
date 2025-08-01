from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer,UserProfileSerializer

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "User registered successfully. Please log in."},
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

