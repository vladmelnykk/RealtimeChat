import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Title from '../common/Title';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import Input from '../common/Input';
import LoginButton from '../common/LoginButton';
import {ISignUpData, passwordRegex, usernameRegex} from './SignUpScreen';
import API from '../core/Authorization.service';
import Authorization from '../core/Authorization.service';
import useStore from '../core/store';

type SignInScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignInScreen'
>;

export interface ISignInData {
  username: string;
  password: string;
}

interface ISignInError {
  usernameError: string;
  passwordError: string;
}

const dataInitialState: ISignInData = {
  username: '',
  password: '',
};

const errorInitialState: ISignInError = {
  usernameError: '',
  passwordError: '',
};

const SignInScreen: React.FC<SignInScreenProps> = ({navigation}) => {
  const [data, setData] = React.useState<ISignInData>(dataInitialState);
  const [errors, setErrors] = React.useState<ISignInError>(errorInitialState);

  const login = useStore(state => state.login);

  const handleChangeText = (name: keyof ISignUpData, value: string) => {
    setData(prev => ({...prev, [name]: value}));

    if (value) {
      setErrors(prev => ({...prev, [`${name}Error`]: ''}));
    }
  };

  const checkIsPattern = (name: keyof ISignInData, pattern: RegExp) => {
    if (data[name] && !pattern.test(data[name])) {
      setErrors(prev => ({
        ...prev,
        [`${name}Error`]: `Invalid. ${
          name === 'username'
            ? 'At least 3 characters.'
            : 'At least 8 characters. '
        }`,
      }));
      return false;
    }
    return true;
  };

  const onSignIn = async () => {
    const {username, password} = data;
    let isValid = true;
    isValid = checkIsPattern('username', usernameRegex) ? isValid : false;
    isValid = checkIsPattern('password', passwordRegex) ? isValid : false;

    // Check username
    if (!username) {
      setErrors(prev => ({...prev, usernameError: 'Required'}));
      isValid = false;
    }
    // Check password
    if (!password) {
      setErrors(prev => ({...prev, passwordError: 'Required'}));
      isValid = false;
    }
    // Break out if errors
    if (!isValid) {
      return;
    }

    // Make request to server

    const response = await Authorization.signIn(data);

    if (response) {
      const credentials = {
        username: data.username,
        password: data.password,
      };

      login(credentials, response.user);
    }

    // Reset form
    setData(dataInitialState);
  };

  return (
    <View style={styles.screenContainer}>
      <KeyboardAvoidingView
        style={styles.screenContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback
          accessible={false}
          touchSoundDisabled={true}
          onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <Title text="RealtimeChat" color="#202020" />

            <Input
              title="Username"
              value={data.username}
              handleChangeText={handleChangeText}
              name="username"
              error={errors.usernameError}
            />
            <Input
              title="Password"
              value={data.password}
              handleChangeText={handleChangeText}
              name="password"
              error={errors.passwordError}
            />

            <LoginButton text="Sign In" onPress={onSignIn} />

            <Text
              style={{
                textAlign: 'center',
                marginTop: 20,
                fontSize: 16,
              }}>
              Don't have an account?{' '}
              <Text
                style={{color: '#4e59eb'}}
                onPress={() => {
                  setData(dataInitialState);
                  setErrors(errorInitialState);
                  navigation.navigate('SignUpScreen');
                }}>
                Sign Up
              </Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default SignInScreen;
