import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import useStore, {requestConnectionType} from '../../core/store/store';

interface IRequestAcceptProps {
  item: requestConnectionType;
}

const RequestAccept: React.FC<IRequestAcceptProps> = ({item}) => {
  const requestAccept = useStore(state => state.requestAccept);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        requestAccept(item.sender.username);
      }}>
      <Text style={styles.text}>Accept</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#202020',
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {color: '#fff', fontWeight: 'bold'},
});

export default RequestAccept;
