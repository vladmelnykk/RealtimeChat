import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from './src/screens/SplashScreen';
import MessageScreen from './src/screens/MessageScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SearchScreen from './src/screens/SearchScreen';
import TabNavigator from './src/navigation/TabNavigator';

import './src/core/fontawesome';
import useStore, {User} from './src/core/store/store';

export type RootStackParamList = {
  SplashScreen: undefined;
  TabNavigator: undefined;
  MessageScreen: {friend: User};
  SearchScreen: undefined;
  SignInScreen: undefined;
  SignUpScreen: undefined;
};

const LightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const initialized = useStore(state => state.initialized);
  const init = useStore(state => state.init);
  const authenticated = useStore(state => state.authenticated);

  useEffect(() => {
    init();
  }, []);

  return (
    <NavigationContainer theme={LightTheme}>
      <StatusBar barStyle={'dark-content'} />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!initialized ? (
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
        ) : !authenticated ? (
          <>
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen
              name="MessageScreen"
              component={MessageScreen}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="SearchScreen"
              component={SearchScreen}
              options={{
                headerShown: true,
                title: 'Search',
                headerTitleAlign: 'center',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
