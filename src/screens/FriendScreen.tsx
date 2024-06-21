import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import useStore from '../core/store/store';
import Empty from '../components/Empty';
import FriendRow from '../components/FriendComponents/FriendRow';

const FriendScreen = () => {
  const friendList = useStore(state => state.friendList);

  if (friendList === null) {
    return <ActivityIndicator size="large" style={{flex: 1}} />;
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        ListEmptyComponent={
          <Empty icon={'inbox'} message="No messages" centered={true} />
        }
        keyExtractor={item => item.friend.username}
        data={friendList}
        renderItem={({item}) => <FriendRow item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default FriendScreen;
