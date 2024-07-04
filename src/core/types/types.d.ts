type User = {
  username: string;
  thumbnail: string | null;
  name: string;
};
type searchUserType = User & {
  status: 'pending-them' | 'pending-me' | 'connected' | 'no-connection';
};
type requestConnectionType = {
  sender: User;
  receiver: User;
  id: number;
  created: string;
};
type friendType = {
  id: number;
  friend: User;
  preview: string;
  updated: string;
};

type messageType = {
  id: number;
  is_me: boolean;
  text: string;
  created: string;
};

interface ISignUpError {
  usernameError: string;
  firstNameError: string;
  lastNameError: string;
  passwordError: string;
  retypePasswordError: string;
}

interface ISignUpData {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  retypePassword: string;
}

interface ISignInData {
  username: string;
  password: string;
}

interface ISignInError {
  usernameError: string;
  passwordError: string;
}

type AuthResponse = {
  tokens: {
    access: string;
    refresh: string;
  };
  user: User;
};
