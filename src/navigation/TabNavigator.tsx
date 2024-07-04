import React from 'react';
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/ProfileScreen';
import FriendScreen from '../screens/FriendScreen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import RequestScreen from '../screens/RequestScreen';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {TouchableOpacity} from 'react-native';
import useStore from '../core/store/store';
import Thumbnail from '../components/common/Thumbnail';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

export type RootTabParamList = {
  RequestScreen: undefined;
  ProfileScreen: undefined;
  FriendScreen: undefined;
};

type TabScreenProps = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'TabNavigator'>,
  BottomTabScreenProps<RootTabParamList>
>;

const Tab = createBottomTabNavigator<RootTabParamList>();
const TabNavigator: React.FC<TabScreenProps> = ({navigation}) => {
  const socketConnect = useStore(state => state.socketConnect);
  const socketClose = useStore(state => state.socketClose);
  const user = useStore(state => state.user);
  const requestList = useStore(state => state.requestList);

  React.useEffect(() => {
    socketConnect();

    return () => {
      socketClose();
    };
  }, []);

  const onSearch = () => {
    navigation.navigate('SearchScreen');
  };

  return (
    <Tab.Navigator
      screenOptions={({navigation, route}) => ({
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
          <TouchableOpacity onPress={onSearch}>
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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProfileScreen');
            }}>
            <Thumbnail
              url={user?.thumbnail ? user.thumbnail : null}
              size={28}
            />
          </TouchableOpacity>
        ),
        headerTitleAlign: 'center',
      })}>
      <Tab.Screen
        name="RequestScreen"
        component={RequestScreen}
        options={{
          title: 'Requests',
          tabBarBadge:
            requestList?.length === 0 ? undefined : requestList?.length,
        }}
      />
      <Tab.Screen
        name="FriendScreen"
        component={FriendScreen}
        options={{title: 'Friends'}}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
