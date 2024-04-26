from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'name', 'thumbnail']

    def get_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'
