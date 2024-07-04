import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Thumbnail from '../common/Thumbnail';
import SearchButton from './SearchButton';
import Cell from '../common/Cell';

interface ISearchRowProps {
  user: searchUserType;
}

const SearchRow: React.FC<ISearchRowProps> = ({user}) => {
  return (
    <Cell>
      <Thumbnail url={user.thumbnail} size={76} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>{user.username}</Text>
      </View>

      <SearchButton user={user} />
    </Cell>
  );
};

const styles = StyleSheet.create({
  userInfo: {
    flexGrow: 1,
    paddingHorizontal: 16,
    gap: 4,
  },
  name: {
    color: '#202020',
    fontWeight: 'bold',
  },
  username: {color: '#606060'},
});

export default SearchRow;
