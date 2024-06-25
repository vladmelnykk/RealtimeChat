import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../../App';
import MessageTitle from '../components/MessageComponents/MessageTitle';

type MessageScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MessageScreen'
>;

const MessageScreen: React.FC<MessageScreenProps> = ({navigation, route}) => {
  React.useLayoutEffect(() => {
    const {friend} = route.params;
    navigation.setOptions({
      headerTitle: () => <MessageTitle friend={friend} />,
    });
  }, []);

  return (
    <View>
      <Text>MessageScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default MessageScreen;
