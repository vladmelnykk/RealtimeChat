import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

interface ILoginButtonProps {
  text: string;
  onPress: () => void;
}

const LoginButton: React.FC<ILoginButtonProps> = ({text, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#202020',
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginButton;
