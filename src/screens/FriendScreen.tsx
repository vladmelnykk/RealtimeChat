import React from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import useStore from '../core/store/store';
import Empty from '../components/common/Empty';
import FriendRow from '../components/FriendComponents/FriendRow';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootStackParamList} from '../../App';
import {RootTabParamList} from '../navigation/TabNavigator';

type FriendScreenProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'FriendScreen'>,
  NativeStackScreenProps<RootStackParamList>
>;

const FriendScreen: React.FC<FriendScreenProps> = ({navigation}) => {
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
        renderItem={({item}) => (
          <FriendRow
            onPress={() => {
              navigation.navigate('MessageScreen', {
                friend: item.friend,
                id: item.id,
              });
            }}
            item={item}
          />
        )}
      />
    </View>
  );
};

export default FriendScreen;
