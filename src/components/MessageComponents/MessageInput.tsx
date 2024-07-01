import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface IMessageInputProps {
  message: string;
  setMessage: (text: string) => void;
  onSend: () => void;
}

const MessageInput: React.FC<IMessageInputProps> = ({
  message,
  setMessage,
  onSend,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Message..."
        placeholderTextColor="#909090"
        style={styles.input}
      />
      <TouchableOpacity onPress={onSend}>
        <FontAwesomeIcon
          icon={'paper-plane'}
          size={22}
          color="#303030"
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 25,
    height: 50,
  },
  icon: {marginLeft: 12},
});

export default MessageInput;
