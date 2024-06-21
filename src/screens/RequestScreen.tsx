import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useStore from '../core/store/store';
import RequestRow from '../components/RequestComponents/RequestRow';
import Empty from '../components/Empty';

const RequestScreen = () => {
  const requestList = useStore(state => state.requestList);
  const setRequestList = useStore(state => state.setRequestList);
  const socket = useStore(state => state.socket);
  let [isFetching, setIsFetching] = React.useState(false);

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
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              socket?.send(
                JSON.stringify({
                  source: 'request.list',
                }),
              );
            }}
          />
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
