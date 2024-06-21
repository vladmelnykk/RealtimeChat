import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Empty from '../components/Empty';
import SearchRow from '../components/SearchComponents/SearchRow';
import useStore from '../core/store/store';
import utils from '../core/utils';
import secure from '../core/secure';

const SearchScreen = () => {
  // const [query, setQuery] = React.useState<string>('');

  const searchList = useStore(state => state.searchList);
  const searchUsers = useStore(state => state.searchUsers);
  const setSearchList = useStore(state => state.setSearchList);

  const handleInputChange = React.useCallback(
    utils.debounce((query: string) => {
      searchUsers(query);
    }, 500),
    [],
  );

  React.useEffect(() => {
    console.log(searchList);
    return () => {
      console.log('SearchScreen unmounted');
      console.log(searchList);
      setSearchList(null);
    };
  }, []);

  // const searchList: searchUserType[] = [
  //   {
  //     name: 'test1',
  //     username: 'test-user1',
  //     thumbnail: null,
  //     status: 'panding-them',
  //   },
  //   {
  //     name: 'test2',
  //     username: 'test-user2',
  //     thumbnail: null,
  //     status: 'panding-me',
  //   },
  //   {
  //     name: 'test3',
  //     username: 'test-user3',
  //     thumbnail: null,
  //     status: 'connected',
  //   },
  //   {
  //     name: 'test4',
  //     username: 'test-user4',
  //     thumbnail: null,
  //     status: 'no-connection',
  //   },
  // ];

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.panel}>
        <View>
          <TextInput
            style={styles.input}
            onChangeText={handleInputChange}
            placeholder="Search..."
            placeholderTextColor="#505050"
          />
          <FontAwesomeIcon
            icon="magnifying-glass"
            color="#505050"
            size={20}
            style={styles.inputIcon}
          />
        </View>
      </View>
      {searchList === null ? (
        <Empty
          icon="magnifying-glass"
          message="Search for friends"
          centered={false}
        />
      ) : searchList.length === 0 ? (
        <Empty
          icon="triangle-exclamation"
          message={'No user found'}
          centered={false}
        />
      ) : (
        <FlatList
          data={searchList}
          keyExtractor={item => item.username}
          renderItem={({item}) => <SearchRow user={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  panel: {
    padding: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  input: {
    backgroundColor: '#e1e2e3',
    height: 52,
    borderRadius: 26,
    padding: 16,
    fontSize: 16,
    paddingLeft: 50,
  },
  inputIcon: {
    position: 'absolute',
    top: 17,
    left: 20,
  },
});

export default SearchScreen;
