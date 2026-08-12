from rest_framework import generics, permissions, viewsets, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Address
from .serializers import UserSerializer, RegisterSerializer, AddressSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user).data,
            "message": "User registered successfully."
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # If this is the first address, set it as default
        addresses_count = Address.objects.filter(user=self.request.user).count()
        is_default = addresses_count == 0
        serializer.save(
            user=self.request.user,
            is_default_shipping=is_default or serializer.validated_data.get('is_default_shipping', False),
            is_default_billing=is_default or serializer.validated_data.get('is_default_billing', False)
        )

from .serializers import UserSerializer, RegisterSerializer, AddressSerializer, AdminUserListSerializer

class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Admin-only endpoint to view all users (customers).
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = AdminUserListSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
