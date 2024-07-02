import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {RootStackParamList} from '../../App';
import MessageTitle from '../components/MessageComponents/MessageTitle';
import {SafeAreaView} from 'react-native-safe-area-context';
import MessageInput from '../components/MessageComponents/MessageInput';
import useStore from '../core/store/store';
import MessageBubble from '../components/MessageComponents/MessageBubble';

type MessageScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MessageScreen'
>;

const MessageScreen: React.FC<MessageScreenProps> = ({navigation, route}) => {
  const {friend, id} = route.params;
  const [message, setMessage] = React.useState<string>('');
  const flatListRef = React.useRef<FlatList>(null);

  const messageNext = useStore(state => state.messageNext);
  const messageList = useStore(state => state.messageList);
  const messageSend = useStore(state => state.messageSend);
  const fetchMessageList = useStore(state => state.fetchMessageList);
  const messageType = useStore(state => state.messageType);

  const handleSendMessage = () => {
    const cleanedMessage = message.trim();
    if (cleanedMessage.length === 0) return;
    messageSend(cleanedMessage, id);
    flatListRef.current?.scrollToIndex({animated: true, index: 0});
    setMessage('');
  };

  const onType = React.useCallback(
    (text: string) => {
      console.log('test');
      setMessage(text);
      if (text.length > 0) messageType(friend.username);
    },
    [friend.username],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <MessageTitle friend={friend} />,
    });
  }, []);

  React.useEffect(() => {
    fetchMessageList(id);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={styles.list}
          data={[{id: -1}, ...messageList]}
          renderItem={({item, index}) => (
            <MessageBubble index={index} message={item} friend={friend} />
          )}
          inverted={true}
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            console.log('EndReached: ' + messageNext);

            if (messageNext) {
              fetchMessageList(id, messageNext);
            }
          }}
          keyExtractor={item => item.id}
        />
      </View>

      {Platform.OS === 'ios' ? (
        <InputAccessoryView>
          <MessageInput
            message={message}
            setMessage={onType}
            onSend={handleSendMessage}
          />
        </InputAccessoryView>
      ) : (
        <MessageInput
          message={message}
          setMessage={onType}
          onSend={handleSendMessage}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 5,
    // borderColor: 'red',
  },
  list: {
    // paddingTop: ,
  },
});

export default MessageScreen;
