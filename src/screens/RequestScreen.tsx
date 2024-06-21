import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import useStore from '../core/store/store';
import RequestRow from '../components/RequestComponents/RequestRow';
import Empty from '../components/Empty';

const RequestScreen = () => {
  const requestList = useStore(state => state.requestList);

  if (requestList === null) {
    return <ActivityIndicator size="large" style={{flex: 1}} />;
  }

  // if (requestList.length === 0) {
  //   return <Empty icon={'bell'} message="No requests" centered={true} />;
  // }

  return (
    <View style={{flex: 1}}>
      <FlatList
        ListEmptyComponent={
          <Empty icon={'bell'} message="No requests" centered={true} />
        }
        keyExtractor={item => item.sender.username}
        data={requestList}
        renderItem={({item}) => <RequestRow item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default RequestScreen;
