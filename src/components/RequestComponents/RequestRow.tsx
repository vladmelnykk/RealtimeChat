import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Cell from '../common/Cell';
import Thumbnail from '../common/Thumbnail';
import RequestAccept from './RequestAccept';
import utils from '../../core/utils';

interface IRequestRowProps {
  item: requestConnectionType;
}

const RequestRow: React.FC<IRequestRowProps> = ({item}) => {
  const message = 'Requested to connect with you';

  return (
    <Cell>
      <Thumbnail url={item.sender.thumbnail} size={76} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.sender.name}</Text>
        <Text style={styles.message}>
          {message}
          <Text style={styles.time}>
            {' ' + utils.formatTime(item.created)}
          </Text>
        </Text>
      </View>

      <RequestAccept item={item} />
    </Cell>
  );
};

const styles = StyleSheet.create({
  userInfo: {
    flex: 1,
    paddingHorizontal: 16,
  },
  name: {
    color: '#202020',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  message: {color: '#606060'},
  time: {
    color: '#909090',
    fontSize: 13,
  },
});

export default RequestRow;
