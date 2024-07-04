import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Cell from '../common/Cell';
import Thumbnail from '../common/Thumbnail';
import utils from '../../core/utils';

interface IFriendRowProps {
  item: friendType;
  onPress?: () => void;
}

const FriendRow: React.FC<IFriendRowProps> = ({item, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Cell>
        <Thumbnail url={item.friend.thumbnail} size={76} />
        <View style={styles.userInfo}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.name} numberOfLines={1}>
              {item.friend.name}
            </Text>
            <Text style={styles.time}> {utils.formatTime(item.updated)}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>
            {item.preview}
          </Text>
        </View>
      </Cell>
    </TouchableOpacity>
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
    flex: 0.6,
  },
  message: {
    color: '#606060',
  },
  time: {
    color: '#909090',
    fontSize: 13,
    flex: 0.4,
    textAlign: 'right',
  },
});

export default FriendRow;
