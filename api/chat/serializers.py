from rest_framework import serializers
from rest_framework import serializers
from .models import User, Connection

from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.backends import TokenBackend
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken


class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password',
                  'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        username = validated_data['username'].lower()
        first_name = validated_data['first_name'].lower()
        last_name = validated_data['last_name'].lower()

        user = User.objects.create(
            username=username,
            first_name=first_name,
            last_name=last_name
        )
        password = validated_data['password']
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'name', 'thumbnail']

    def get_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'


class SearchSerializer(UserSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'name', 'thumbnail', 'status']

    def get_status(self, obj):
        if obj.pending_them:
            return 'pending-them'
        elif obj.pending_me:
            return 'pending-me'
        elif obj.connected:
            return 'connected'
        return 'no-connection'


class RequestSerializer(serializers.ModelSerializer):

    sender = UserSerializer()
    receiver = UserSerializer()

    class Meta:
        model = Connection
        fields = ['id', 'sender', 'receiver', 'created']


class FriendSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()
    preview = serializers.SerializerMethodField()

    class Meta:
        model = Connection
        fields = ['id', 'friend', 'preview', 'updated']

    def get_friend(self, obj):
        if self.context['user'] == obj.sender:
            return UserSerializer(obj.receiver).data
        elif self.context['user'] == obj.receiver:
            return UserSerializer(obj.sender).data
        else:
            print('Error: No user in friend serializer')

    def get_preview(self, obj):
        return 'hi friend, it\'s me, how are you? :)  What is your name? And your age? or something like that'


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        refresh = attrs['refresh']
        refresh_token = RefreshToken(refresh)

        data = super().validate(attrs)
        data['user_id'] = refresh_token['user_id']  # Добавляем user_id в ответ
        return data
