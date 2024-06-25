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
      <Thumbnail size={36} url={friend.thumbnail} />
      <Text>{friend.username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'red',
  },
});

export default MessageTitle;
