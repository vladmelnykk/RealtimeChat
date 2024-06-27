import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Thumbnail from '../Thumbnail';
import {User} from '../../core/store/store';

interface MessageBubbleFriendProps {
  text: string;
  friend: User;
}

const MessageBubbleFriend: React.FC<MessageBubbleFriendProps> = ({
  text,
  friend,
}) => {
  return (
    <View style={styles.container}>
      <Thumbnail url={friend.thumbnail} size={42} />
      <View style={styles.messageBox}>
        <Text style={styles.text}>{text}</Text>
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
});

export default MessageBubbleFriend;
