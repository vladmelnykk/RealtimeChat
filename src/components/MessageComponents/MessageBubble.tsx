import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {User, messageType} from '../../core/store/store';
import MessageBubbleFriend from './MessageBubbleFriend';
import MessageBubbleMe from './MessageBubbleMe';

interface MessageBubbleProps {
  index: number;
  message: messageType;
  friend: User;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  friend,
  index,
  message,
}) => {
  return message.is_me ? (
    <MessageBubbleMe text={message.text} />
  ) : (
    <MessageBubbleFriend friend={friend} text={message.text} />
  );
};

const styles = StyleSheet.create({});

export default MessageBubble;
