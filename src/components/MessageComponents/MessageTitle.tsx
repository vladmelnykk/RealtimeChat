import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {User} from '../../core/store/store';
import Thumbnail from '../Thumbnail';

interface IMessageTitleProps {
  friend: User;
}

const MessageTitle: React.FC<IMessageTitleProps> = ({friend}) => {
  return (
    <View style={styles.container}>
      <Thumbnail size={32} url={friend.thumbnail} />
      <Text style={styles.username}>{friend.username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#202020',
  },
});

export default MessageTitle;
