import React from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import useStore from '../core/store/store';
import RequestRow from '../components/RequestComponents/RequestRow';
import Empty from '../components/common/Empty';

const RequestScreen = () => {
  const requestList = useStore(state => state.requestList);

  if (requestList === null) {
    return <ActivityIndicator size="large" style={{flex: 1}} />;
  }

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

export default RequestScreen;
