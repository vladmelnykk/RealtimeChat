import {create} from 'zustand';
import secure from '../secure';
import Authorization from '../services/Authorization.service';
import {ISignInData} from '../../screens/SignInScreen';
import {ADDRESS} from '../api';
import {Asset} from 'react-native-image-picker';
import utils from '../utils';
import {Alert} from 'react-native';

export type User = {
  username: string;
  thumbnail: string | null;
  name: string;
};
export type searchUserType = User & {
  status: 'pending-them' | 'pending-me' | 'connected' | 'no-connection';
};
export type requestConnectionType = {
  sender: User;
  receiver: User;
  id: number;
  created: string;
};
export type friendType = {
  id: number;
  friend: User;
  preview: string;
  updated: string;
};

export type messageType = {
  id: number;
  is_me: boolean;
  text: string;
  created: string;
};

export interface storeState {
  initialized: boolean;
  init: () => void;
  user: User | null;
  authenticated: boolean;
  login: (
    credentials: ISignInData,
    user: User,
    tokens: {
      access: string;
      refresh: string;
    },
  ) => void;
  logout: () => void;
  updateUser: (data: User) => void;

  // WebSocket
  socket: WebSocket | null;
  socketConnect: () => void;
  socketClose: () => void;

  responseRequestAccept: (data: requestConnectionType) => void;
  responseMessageList: (data: {
    messages: messageType[];
    friend: User;
    next: number;
  }) => void;
  responseMessageSend: (data: {message: messageType; friend: User}) => void;
  responseFriendNew: (data: friendType) => void;
  responseMessageType: (data: {username: string}) => void;

  // Search
  searchList: searchUserType[] | null;
  changeUserStatus: (data: requestConnectionType) => void;
  setSearchList: (data: searchUserType[] | null) => void;
  searchUsers: (query: string) => void;

  // Requests
  requestList: requestConnectionType[] | null;
  setRequestList: (data: requestConnectionType[]) => void;
  requestConnect: (username: string) => void;
  requestAccept: (username: string) => void;

  // Friends
  friendList: friendType[] | null;
  setFriendList: (data: friendType[]) => void;

  // Message
  messageUsername: string | null;
  messageList: messageType[];
  messageTyping: Date | null;
  messageNext: number | null;
  setMessageTyping: (data: Date | null) => void;
  setMessageList: (data: messageType[]) => void;
  fetchMessageList: (connectionId: number, page?: number) => void;
  messageSend: (message: string, connectionId: number) => void;
  messageType: (username: string) => void;

  // Thumbnail
  uploadThumbnail: (file: Asset) => void;
}

const useStore = create<storeState>((set, get) => ({
  // --------------------
  //    Initialization
  // --------------------

  initialized: false,
  init: async () => {
    try {
      const tokens = await secure.get('tokens');
      console.log('tokens', tokens);

      if (!tokens) return;

      if (utils.isTokenExpired(tokens.refresh)) {
        Alert.alert('Expired token', 'Please login again');
        return;
      }

      const response = await Authorization.getUserDataWithToken();
      if (response) {
        const {user, tokens} = response;
        console.log(response);

        await secure.set('tokens', tokens);
        set(state => ({user, authenticated: true, initialized: true}));
      }
    } catch (error) {
      console.log('store.init error:' + error);
    } finally {
      set(state => ({initialized: true}));
    }
  },

  // --------------------------
  //    Authentication & User
  // --------------------------

  user: null,
  authenticated: false,
  login: (credentials, user, tokens) => {
    // await secure.set('credentials', credentials);
    secure.set('credentials', credentials);

    secure.set('tokens', tokens);
    set(state => ({user, authenticated: true}));
  },
  logout: () => {
    secure.wipe();
    set(state => ({user: null, authenticated: false, initialized: true}));
  },
  updateUser: data => {
    set({user: data});
  },

  // --------------------
  //    WebSocket
  // --------------------

  socket: null,
  socketConnect: async () => {
    const tokens = await secure.get('tokens');

    const socket = new WebSocket(
      `ws://${ADDRESS}/chat/?token=${tokens.access}`,
    );

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(
        JSON.stringify({
          source: 'request.list',
        }),
      );
      socket.send(
        JSON.stringify({
          source: 'friend.list',
        }),
      );
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      //
      // TODO: Add reconnect logic
      //
      if (get().user) {
        get().socketConnect();
      }
    };

    socket.onerror = error => {
      console.log('WebSocket error: ' + error.message);
    };

    socket.onmessage = event => {
      console.log('WebSocket message: ' + event.data);
      if (!event.data) {
        return;
      }

      const sources = {
        thumbnail: get().updateUser,
        search: get().setSearchList,
        'request.connect': get().changeUserStatus,
        'request.list': get().setRequestList,
        'request.accept': get().responseRequestAccept,
        'friend.list': get().setFriendList,
        'friend.new': get().responseFriendNew,
        'message.list': get().responseMessageList,
        'message.send': get().responseMessageSend,
        'message.type': get().responseMessageType,
      };

      const response = JSON.parse(event.data);

      const handler = sources[response.source as keyof typeof sources];

      if (!handler) {
        console.log('Unknown source: ' + response.source);
        return;
      }

      handler(response.data);
    };

    set({socket});
  },

  socketClose: () => {
    const socket = get().socket;
    set({user: null});
    socket?.close();
    console.log('Socket closed');
  },
  responseMessageType: data => {
    const messageUsername = get().messageUsername;
    if (messageUsername !== data.username) return;
    set({messageTyping: new Date()});
  },

  responseRequestAccept: data => {
    const user = get().user;

    if (user?.username === data.receiver.username) {
      const requestList = [...(get().requestList as requestConnectionType[])];

      const requestIndex = requestList?.findIndex(item => item.id === data.id);

      if (requestIndex !== -1) {
        requestList.splice(requestIndex, 1);
        set({requestList: requestList});
      }
    }

    const searchList = get().searchList;

    if (searchList) {
      const tempSearchList = [...searchList];
      let searchIndex = -1;

      if (user?.username === data.receiver.username) {
        searchIndex = tempSearchList?.findIndex(
          item => item.username === data.sender.username,
        );
      } else {
        searchIndex = tempSearchList?.findIndex(
          item => item.username === data.receiver.username,
        );
      }

      if (searchIndex !== -1) {
        tempSearchList[searchIndex].status = 'connected';
        set({searchList: tempSearchList});
      }
    }
  },
  responseMessageList: data => {
    set({
      messageList: [...get().messageList, ...data.messages],
      messageUsername: data.friend.username,
      messageNext: data.next,
    });
  },
  responseMessageSend: data => {
    const username = data.friend.username;
    const tempFriendList = get().friendList;

    if (tempFriendList) {
      const friendList = [...tempFriendList];
      const friendIndex = friendList.findIndex(
        item => item.friend.username === username,
      );

      if (friendIndex >= 0) {
        const item = friendList[friendIndex];
        item.preview = data.message.text;
        item.updated = data.message.created;

        friendList.splice(friendIndex, 1);
        friendList.unshift(item);
        set({friendList: friendList});
      }
    }
    if (username !== get().messageUsername) return;

    const messageList = [data.message, ...get().messageList];
    set({messageTyping: null, messageList});
  },
  responseFriendNew: data => {
    const tempFriendList = get().friendList;
    if (tempFriendList) {
      const friendList = [data, ...tempFriendList];
      set({friendList});
    }
  },

  // --------------------
  //    Search
  // --------------------

  searchList: null,
  changeUserStatus: data => {
    const user = get().user;
    const searchList = get().searchList;

    if (user?.username === data.sender.username) {
      if (searchList) {
        const tempSearchList = [...searchList];
        const searchIndex = tempSearchList?.findIndex(
          item => item.username === data.receiver.username,
        );

        if (searchIndex !== -1) {
          tempSearchList[searchIndex].status = 'pending-them';
          console.log(tempSearchList);

          set({searchList: tempSearchList});
        }
      }
    } else {
      if (searchList) {
        const tempSearchList = [...searchList];
        const searchIndex = tempSearchList?.findIndex(
          item => item.username === data.sender.username,
        );

        if (searchIndex !== -1) {
          tempSearchList[searchIndex].status = 'pending-me';

          set({searchList: tempSearchList});
        }
      }

      const requestList = [...(get().requestList as requestConnectionType[])];

      const requestIndex = requestList?.findIndex(
        item => item.sender.username === data.sender.username,
      );

      if (requestIndex === -1) {
        requestList.unshift(data);
        set({requestList: requestList});
      }
    }
  },
  setSearchList: data => {
    set({searchList: data});
  },
  searchUsers: query => {
    if (query) {
      const socket = get().socket;
      socket?.send(
        JSON.stringify({
          source: 'search',
          query,
        }),
      );
    } else {
      set({searchList: null});
    }
  },

  // --------------------
  //    Requests
  // --------------------

  requestList: null,
  setRequestList: data => {
    set({requestList: data});
  },
  requestAccept: username => {
    if (username) {
      const socket = get().socket;
      socket?.send(
        JSON.stringify({
          source: 'request.accept',
          username,
        }),
      );
    }
  },
  requestConnect: username => {
    if (username) {
      const socket = get().socket;
      socket?.send(
        JSON.stringify({
          source: 'request.connect',
          username,
        }),
      );
    }
  },

  // --------------------
  //    Friend
  // --------------------

  friendList: null,
  setFriendList: data => {
    set({friendList: data});
  },

  // --------------------
  //    Message
  // --------------------

  messageNext: null,
  messageUsername: null,
  messageList: [],
  messageTyping: null,
  setMessageTyping: data => {
    set({messageTyping: data});
  },
  setMessageList: data => {
    set({messageList: data});
  },
  fetchMessageList: (connectionId, page = 0) => {
    if (page === 0) {
      set({
        messageList: [],
        messageTyping: null,
        messageUsername: null,
        messageNext: null,
      });
    } else {
      set({messageNext: null});
    }
    const socket = get().socket;
    socket?.send(
      JSON.stringify({
        source: 'message.list',
        connectionId,
        page,
      }),
    );
  },
  messageSend: (message, connectionId) => {
    if (message ?? connectionId) {
      const socket = get().socket;
      socket?.send(
        JSON.stringify({
          source: 'message.send',
          message,
          connectionId,
        }),
      );
    }
  },
  messageType: username => {
    const socket = get().socket;

    socket?.send(
      JSON.stringify({
        source: 'message.type',
        username,
      }),
    );
  },
  // --------------------
  //    Thumbnail
  // --------------------

  uploadThumbnail: file => {
    const socket = get().socket;

    socket?.send(
      JSON.stringify({
        source: 'thumbnail',
        filename: file.fileName,
        base64: file.base64,
      }),
    );
  },
}));

export default useStore;
