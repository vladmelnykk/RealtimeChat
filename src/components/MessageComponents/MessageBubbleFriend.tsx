import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Thumbnail from '../common/Thumbnail';
import MessageTypeAnimation from './MessageTypeAnimation';

interface MessageBubbleFriendProps {
  text: string;
  friend: User;
  typing?: boolean;
}

const MessageBubbleFriend: React.FC<MessageBubbleFriendProps> = ({
  text,
  friend,
  typing = false,
}) => {
  return (
    <View style={styles.container}>
      <Thumbnail url={friend.thumbnail} size={42} />
      <View style={styles.messageBox}>
        {typing ? (
          <MessageTypeAnimation />
        ) : (
          <Text style={styles.text}>{text}</Text>
        )}
      </View>
      <View style={{flex: 1}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
  },
  messageBox: {
    backgroundColor: '#d0d2db',
    borderRadius: 20,
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    marginLeft: 10,
    minHeight: 42,
  },
  text: {
    color: '#202020',
    fontSize: 16,
    lineHeight: 18,
  },
  flexRow: {
    flexDirection: 'row',
  },
});

export default MessageBubbleFriend;
