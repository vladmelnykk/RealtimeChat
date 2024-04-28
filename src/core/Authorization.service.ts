import {ISignUpData} from '../screens/SignUpScreen';
import {client} from './api';
import {ISignInData} from '../screens/SignInScreen';

const Authorization = {
  signIn: async ({username, password}: ISignInData) => {
    try {
      const response = await client.post('/chat/signin/', {username, password});
      return response.data;
    } catch (error) {
      console.log('error ' + error);
    }
  },

  signUp: async ({firstName, lastName, username, password}: ISignUpData) => {
    try {
      const response = await client.post('/chat/signup/', {
        username,
        first_name: firstName,
        last_name: lastName,
        password,
      });
      return response.data;
    } catch (error) {
      console.log('error ' + error);
      return null;
    }
  },
};

export default Authorization;
