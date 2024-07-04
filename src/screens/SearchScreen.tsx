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
import Empty from '../components/common/Empty';
import SearchRow from '../components/SearchComponents/SearchRow';
import useStore from '../core/store/store';
import utils from '../core/utils';
import secure from '../core/secure';

const SearchScreen = () => {
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
    return () => {
      setSearchList(null);
    };
  }, []);

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
