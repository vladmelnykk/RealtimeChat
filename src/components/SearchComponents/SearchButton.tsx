import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import useStore, {searchUserType} from '../../core/store/store';

interface ISearchButtonProps {
  user: searchUserType;
}

const SearchButton: React.FC<ISearchButtonProps> = ({user}) => {
  // add tick if user is already connected
  if (user.status === 'connected') {
    return (
      <FontAwesomeIcon
        icon={'circle-check'}
        color="#20d080"
        size={32}
        style={{marginRight: 10}}
      />
    );
  }

  const requestConnect = useStore(state => state.requestConnect);
  const requestAccept = useStore(state => state.requestAccept);

  const data: {text: string; onPress: () => void; disabled: boolean} = {
    text: '',
    onPress: () => {},
    disabled: false,
  };

  switch (user.status) {
    case 'no-connection':
      data.text = 'Connect';
      data.disabled = false;
      data.onPress = () => {
        requestConnect(user.username);
      };
      break;
    case 'pending-them':
      data.text = 'Pending';
      data.disabled = true;
      data.onPress = () => {};
      break;
    case 'pending-me':
      data.text = 'Accept';
      data.disabled = false;
      data.onPress = () => {
        requestAccept(user.username);
      };
      break;

    default:
      break;
  }

  return (
    <TouchableOpacity
      disabled={data.disabled}
      onPress={data.onPress}
      style={[
        styles.container,
        {backgroundColor: data.disabled ? '#606060' : '#202020'},
      ]}>
      <Text style={[styles.text, {color: data.disabled ? '#808080' : '#fff'}]}>
        {data.text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  connected: {
    backgroundColor: '#41bb29',
    padding: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  container: {
    paddingHorizontal: 14,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  text: {
    fontWeight: 'bold',
  },
});

export default SearchButton;
