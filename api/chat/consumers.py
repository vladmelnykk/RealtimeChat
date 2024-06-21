import json
import base64

from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import ContentFile
from asgiref.sync import async_to_sync
from django.db.models import Q, Exists, OuterRef

from .serializers import UserSerializer, SearchSerializer, RequestSerializer, FriendSerializer
from .models import User, Connection


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        user = self.scope["user"]
        if not user.is_authenticated:
            return

        # Save username to use as a group name for this user
        self.username = user.username

        # Join this user to a group with their username
        async_to_sync(self.channel_layer.group_add)(
            self.username, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        pass

    # ----------------------------
    #      Handle request
    # ----------------------------

    def receive(self, text_data):
        # Receive message from WebSocket

        data = json.loads(text_data)
        data_source = data.get('source')

        # Pretty print
        print('receive', json.dumps(data, indent=2))

        if data_source == 'thumbnail':
            self.receive_thumbnail(data)
        elif data_source == 'request.connect':
            self.receive_request_connect(data)
        elif data_source == 'request.list':
            self.receive_request_list()
        elif data_source == 'friend.list':
            self.receive_friend_list()
        elif data_source == 'request.accept':
            self.receive_request_accept(data)
        elif data_source == 'search':
            self.receive_search(data)

    def receive_friend_list(self):
        user = self.scope["user"]

        connections = Connection.objects.filter(
            Q(sender=user) | Q(receiver=user), accepted=True)

        serialized = FriendSerializer(
            connections, context={'user': user}, many=True)

        self.send_group(self.username, 'friend.list', serialized.data)

    def receive_request_list(self):

        connections = Connection.objects.filter(
            receiver=self.scope["user"],
            accepted=False
        )

        serialized = RequestSerializer(connections, many=True)
        self.send_group(self.username, 'request.list', serialized.data)

    def receive_request_connect(self, data):

        username = data.get('username')
        try:
            receiver = User.objects.get(username=username)
        except User.DoesNotExist:
            print('User does not exist')
            return

        # Create connection
        connection, created = Connection.objects.get_or_create(
            sender=self.scope["user"],
            receiver=receiver,
        )

        print(connection.__str__())

        # Serialize connection
        serialized = RequestSerializer(connection)

        # Send connection back to user
        self.send_group(connection.sender.username,
                        'request.connect', serialized.data)

        # Send connection to receiver
        self.send_group(connection.receiver.username,
                        'request.connect', serialized.data)

    def receive_request_accept(self, data):

        sender = data.get('username')
        try:
            connection = Connection.objects.get(
                sender__username=sender,
                receiver=self.scope["user"]
            )
            connection.accepted = True
            connection.save()

        except Connection.DoesNotExist:
            print('Connection does not exist')

        serialized = RequestSerializer(connection)

        self.send_group(connection.receiver.username,
                        'request.accept', serialized.data)

        self.send_group(connection.sender.username,
                        'request.accept', serialized.data)

    def receive_thumbnail(self, data):
        user = self.scope["user"]
        # Convert base64 data to django file
        image_str = data.get('base64')
        image = ContentFile(base64.b64decode(image_str))

        # Update thumbnail field
        filename = data.get('filename')
        user.thumbnail.save(filename, image, save=True)

        # Serialize user
        serialized = UserSerializer(user)

        # Send updated user data with new thumbnail
        self.send_group(self.username, 'thumbnail', serialized.data)

    def receive_search(self, data):
        query = data.get('query')
        users = User.objects.filter(
            Q(username__istartswith=query) | Q(
                first_name__istartswith=query) | Q(last_name__istartswith=query)
        ).exclude(username=self.username).annotate(
            pending_them=Exists(Connection.objects.filter(
                sender=self.scope["user"], receiver=OuterRef('id'), accepted=False)),
            pending_me=Exists(Connection.objects.filter(
                sender=OuterRef('id'), receiver=self.scope["user"], accepted=False)),
            connected=Exists(Connection.objects.filter(
                Q(sender=OuterRef('id'), receiver=self.scope["user"]) | Q(
                    receiver=OuterRef('id'), sender=self.scope["user"]),
                accepted=True
            ))

        )
        # serialized results

        serialized = SearchSerializer(users, many=True)

        # Send search results back to user
        self.send_group(self.username, 'search', serialized.data)

    # ----------------------------
    #      Catch/all broadcast to client helpers
    # ----------------------------

    def send_group(self, group, source, data):
        response = {
            'type': 'broadcast_group',
            'source': source,
            'data': data
        }
        async_to_sync(self.channel_layer.group_send)(group, response)

    def broadcast_group(self, data):
        '''
            data:
                 - type: 'broadcast_group'
                 - source: where it originated from
                 - data: what ever you want to send as a dict
        '''
        data.pop('type')
        '''
            return data:
                 - source: where it originated from
                 - data: what ever you want to send as a dict
        '''
        self.send(text_data=json.dumps(data))
