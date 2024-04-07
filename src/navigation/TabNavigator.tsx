import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FriendScreen from '../screens/FriendScreen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import RequestScreen from '../screens/RequestScreen';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {Image, TouchableOpacity} from 'react-native';

type RootTabParamList = {
  RequestScreen: undefined;
  ProfileScreen: undefined;
  FriendScreen: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({navigation, route}) => ({
        headerShown: false,
        tabBarStyle: {height: 80},
        tabBarShowLabel: false,
        tabBarIcon: ({focused, size, color}) => {
          const icons: {
            [key: string]: IconProp;
          } = {
            RequestScreen: 'bell',
            ProfileScreen: 'user',
            FriendScreen: 'inbox',
          };

          const icon = icons[route.name];
          return <FontAwesomeIcon icon={icon} color={color} size={28} />;
        },
        tabBarActiveTintColor: '#202020',
        headerRight: () => (
          <TouchableOpacity>
            <FontAwesomeIcon
              icon="magnifying-glass"
              color="#404040"
              size={22}
            />
          </TouchableOpacity>
        ),
        headerRightContainerStyle: {paddingRight: 16},
        headerLeftContainerStyle: {paddingLeft: 16},
        headerLeft: () => (
          <TouchableOpacity>
            <Image
              source={require('../assets/profile.png')}
              style={{
                width: 28,
                height: 28,
                backgroundColor: '#e0e0e0',
                borderRadius: 14,
              }}
            />
          </TouchableOpacity>
        ),
      })}>
      <Tab.Screen name="RequestScreen" component={RequestScreen} />
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      <Tab.Screen name="FriendScreen" component={FriendScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
