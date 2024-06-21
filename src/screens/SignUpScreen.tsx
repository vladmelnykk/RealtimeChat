import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Input from '../components/Input';
import LoginButton from '../components/LoginButton';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import Authorization from '../core/services/Authorization.service';
import useStore from '../core/store/store';

type SignUpScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUpScreen'
>;

export interface ISignUpError {
  usernameError: string;
  firstNameError: string;
  lastNameError: string;
  passwordError: string;
  retypePasswordError: string;
}

export interface ISignUpData {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  retypePassword: string;
}

const dataInitialState: ISignUpData = {
  username: '',
  firstName: '',
  lastName: '',
  password: '',
  retypePassword: '',
};

const errorInitialState: ISignUpError = {
  usernameError: '',
  firstNameError: '',
  lastNameError: '',
  passwordError: '',
  retypePasswordError: '',
};

export const usernameRegex = /^[a-zA-Z0-9_-]{3,}$/;
export const passwordRegex = /^.{8,}$/;

const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  const [data, setData] = React.useState<ISignUpData>(dataInitialState);
  const [errors, setErrors] = React.useState<ISignUpError>(errorInitialState);

  const login = useStore(state => state.login);

  const handleChangeText = (name: keyof ISignUpData, value: string) => {
    setData(prev => ({...prev, [name]: value}));
    if (value) {
      setErrors(prev => ({...prev, [`${name}Error`]: ''}));
    }
  };

  const checkIsPattern = (name: keyof ISignUpData, pattern: RegExp) => {
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
  const checkIsValid = (name: keyof ISignUpData) => {
    if (name === 'password') {
      if (!checkIsPattern(name, passwordRegex)) return false;
    }
    if (name === 'username') {
      if (!checkIsPattern(name, usernameRegex)) return false;
    }
    if (name === 'retypePassword') {
      if (data.retypePassword !== data.password) {
        setErrors(prev => ({
          ...prev,
          retypePasswordError: "Passwords don't match",
        }));
        return false;
      }
    }

    if (!data[name]) {
      setErrors(prev => ({...prev, [`${name}Error`]: 'Required'}));
      return false;
    }
    return true;
  };

  const onSignUp = async () => {
    let isValid = true;
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        isValid = checkIsValid(key as keyof ISignUpData) ? isValid : false;
      }
    }

    if (!isValid) {
      return;
    }

    const response = await Authorization.signUp(data);
    if (response) {
      const credentials = {
        username: data.username,
        password: data.password,
      };

      login(credentials, response.user, response.tokens);
    }

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
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View style={styles.content}>
            <Text style={styles.title}>SignUp</Text>

            <Input
              title="Username"
              name="username"
              value={data.username}
              handleChangeText={handleChangeText}
              error={errors.usernameError}
            />
            <Input
              title="First name"
              name="firstName"
              value={data.firstName}
              handleChangeText={handleChangeText}
              error={errors.firstNameError}
            />
            <Input
              title="Last name"
              name="lastName"
              value={data.lastName}
              handleChangeText={handleChangeText}
              error={errors.lastNameError}
            />
            <Input
              title="Password"
              name="password"
              value={data.password}
              handleChangeText={handleChangeText}
              error={errors.passwordError}
            />
            <Input
              title="Retype password"
              name="retypePassword"
              value={data.retypePassword}
              handleChangeText={handleChangeText}
              error={errors.retypePasswordError}
            />

            <LoginButton text="Sign Up" onPress={onSignUp} />

            <Text style={styles.text}>
              Already have an account?{' '}
              <Text
                style={{color: '#4e59eb'}}
                onPress={() => {
                  setData(dataInitialState);
                  setErrors(errorInitialState);
                  navigation.goBack();
                }}>
                Sing In
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
  title: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#202020',
    marginBottom: 20,
  },
  text: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default SignUpScreen;
