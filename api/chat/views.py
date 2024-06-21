from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .serializers import UserSerializer, SignUpSerializer

from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import CustomTokenRefreshSerializer

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import User

# Create your views here.


def get_auth_for_user(user):
    tokens = RefreshToken.for_user(user)
    return {
        'user': UserSerializer(user).data,
        'tokens': {
            'refresh': str(tokens),
            'access': str(tokens.access_token),
        }
    }


class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response(status=400)

        user = authenticate(username=username, password=password)
        if not user:
            return Response(status=401)
        user_data = get_auth_for_user(user)
        return Response(user_data)


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_serializer = SignUpSerializer(data=request.data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        user_data = get_auth_for_user(user)

        return Response(user_data)


class CustomTokenObtainPairView(TokenObtainPairView):
    def get(self, request, *args, **kwargs):

        authorization_header = request.META.get('HTTP_AUTHORIZATION')
        if not authorization_header:
            return Response({'detail': 'Authorization header required'}, status=status.HTTP_400_BAD_REQUEST)
        access_token = authorization_header.split(' ')[-1]
        if not access_token:
            return Response({'detail': 'Access token required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            access = AccessToken(access_token)
            user = User.objects.get(id=access['user_id'])
        except (Exception) as e:
            return Response({'detail': 'Invalid token', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        tokens = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }

        user_data = UserSerializer(user).data

        return Response({'user': user_data, 'tokens': tokens}, status=status.HTTP_200_OK)


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        if 'refresh' not in request.data:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = serializer.validated_data.get('user_id')
        if not user_id:
            return Response({'error': 'User ID not found in refresh token'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        user_data = get_auth_for_user(user)

        return Response(user_data, status=status.HTTP_200_OK)
