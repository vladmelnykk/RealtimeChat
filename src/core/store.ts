import {create} from 'zustand';
import secure from './secure';
import Authorization from './Authorization.service';
import {ISignInData} from '../screens/SignInScreen';

type User = {
  username: string;
  thumbnail: string | null;
  name: string;
};

interface State {
  initialized: boolean;
  init: () => void;
  user: User | null;
  authenticated: boolean;
  login: (credentials: ISignInData, user: User) => void;
  logout: () => void;
}

const useStore = create<State>(set => ({
  // --------------------
  //    Initialization
  // --------------------

  initialized: false,
  init: async () => {
    try {
      const credentials = await secure.get('credentials');
      if (credentials) {
        const response = await Authorization.signIn(credentials);

        if (response) {
          const user = response.user;
          set(state => ({user, authenticated: true, initialized: true}));
        }
      }
    } catch (error) {
      console.log('store.init error:' + error);
    } finally {
      set(state => ({initialized: true}));
    }
  },

  // --------------------
  //    Authentication
  // --------------------

  user: null,
  authenticated: false,
  login: (credentials, user) => {
    secure.set('credentials', credentials);
    set(state => ({user, authenticated: true}));
  },
  logout: () => {
    secure.wipe();
    set(state => ({user: null, authenticated: false}));
  },
}));

export default useStore;
