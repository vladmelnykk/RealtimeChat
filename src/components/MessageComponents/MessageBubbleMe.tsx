import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface MessageBubbleMeProps {
  text: string;
}

const MessageBubbleMe: React.FC<MessageBubbleMeProps> = ({text}) => {
  return (
    <View style={styles.container}>
      <View style={{flex: 1}} />
      <View style={styles.messageBox}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
  },
  messageBox: {
    backgroundColor: '#303040',
    borderRadius: 20,
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    marginRight: 10,
    minHeight: 42,
  },
  text: {
    color: 'white',
    fontSize: 16,
    lineHeight: 18,
  },
});

export default MessageBubbleMe;
