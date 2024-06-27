from django.db import models
from django.contrib.auth.models import AbstractUser


def upload_thumbnail(instance, filename):
    path = f'thumbnails/{instance.username}'
    extension = filename.split('.')[-1]
    if extension:
        path = path + '.' + extension
    return path


class User(AbstractUser):
    thumbnail = models.ImageField(
        upload_to=upload_thumbnail, null=True, blank=True)


class Connection(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='sent_connections')
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='received_connections')

    accepted = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender.username} -> {self.receiver.username}'


class Message(models.Model):
    connection = models.ForeignKey(
        Connection, related_name='messages', on_delete=models.CASCADE)
    user = models.ForeignKey(
        User, related_name='my_messages', on_delete=models.CASCADE)
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username + ' : ' + self.text
