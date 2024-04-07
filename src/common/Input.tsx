import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {ISignUpData} from '../screens/SignUpScreen';
import {ISignInData} from '../screens/SignInScreen';

interface InputProps {
  title: string;
  value: string;
  handleChangeText: (
    name: keyof ISignInData | keyof ISignUpData,
    value: string,
  ) => void;
  name: keyof ISignUpData | keyof ISignInData;
  error: string;
}

const Input: React.FC<InputProps> = ({
  title,
  value,
  handleChangeText,
  name,
  error,
}) => {
  return (
    <View>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{title}</Text>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
      <TextInput
        style={[styles.input, {borderColor: error ? '#ff5555' : 'transparent'}]}
        value={value}
        onChangeText={text => {
          handleChangeText(name, text);
        }}
        secureTextEntry={name.toLowerCase().includes('password')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#70747a',
    paddingLeft: 16,
  },
  input: {
    backgroundColor: '#e1e2e3',
    borderWidth: 1,
    borderRadius: 26,
    paddingHorizontal: 16,
    fontSize: 16,
    height: 52,
  },
  error: {
    color: 'red',
    // marginBottom: 6,
    paddingLeft: 16,
  },
});

export default Input;
