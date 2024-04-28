import {create} from 'zustand';

interface State {
  user: object;
  authenticated: boolean;
  login: (user: object) => void;
  logout: () => void;
}

const useStore = create<State>(set => ({
  user: {},
  authenticated: false,
  login: (user: object) => set(state => ({user, authenticated: true})),
  logout: () => set(state => ({user: {}, authenticated: false})),
}));

export default useStore;
