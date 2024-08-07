from rest_framework import serializers
from rest_framework import serializers
from .models import User, Connection, Message

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
    updated = serializers.SerializerMethodField()

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

    def get_updated(self, obj):
        if not hasattr(obj, 'latest_created'):
            print('not', obj.updated)
            data = obj.updated
        else:
            # TODO: updated instead of created and change it
            print('else', obj.latest_created)
            data = obj.latest_created or obj.updated
        return data.isoformat()

    def get_preview(self, obj):
        message = 'New connection'
        if not hasattr(obj, 'latest_text'):
            return message
        return obj.latest_text or message


class MessageSerializer(serializers.ModelSerializer):
    is_me = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'is_me', 'text', 'created']

    def get_is_me(self, obj):
        return self.context['user'] == obj.user


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        refresh = attrs['refresh']
        refresh_token = RefreshToken(refresh)

        data = super().validate(attrs)
        data['user_id'] = refresh_token['user_id']
        return data
