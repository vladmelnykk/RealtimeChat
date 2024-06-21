import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {friendType} from '../../core/store/store';
import Cell from '../Cell';
import Thumbnail from '../Thumbnail';

interface IFriendRowProps {
  item: friendType;
}

const formatTime = (date: string) => {
  const now = new Date().getTime();
  const s = Math.abs(now - new Date(date).getTime()) / 1000;
  // Seconds
  if (s < 60) {
    return 'now';
  }
  // Minutes
  if (s < 60 * 60) {
    let m = Math.floor(s / 60);
    return `${m}m ago`;
  }
  // Hours
  if (s < 60 * 60 * 24) {
    let h = Math.floor(s / (60 * 60));
    return `${h}h ago`;
  }
  // Days
  if (s < 60 * 60 * 24 * 30) {
    let d = Math.floor(s / (60 * 60 * 24));
    return `${d}d ago`;
  }
  // Months
  if (s < 60 * 60 * 24 * 30 * 12) {
    let m = Math.floor(s / (60 * 60 * 24 * 30));
    return `${m}m ago`;
  }
  // Years
  let y = Math.floor(s / (60 * 60 * 24 * 30 * 12));
  return `${y}y ago`;
};

const FriendRow: React.FC<IFriendRowProps> = ({item}) => {
  return (
    <TouchableOpacity>
      <Cell>
        <Thumbnail url={item.friend.thumbnail} size={76} />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.friend.name}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.message} numberOfLines={2}>
              {item.preview}
            </Text>
            <Text style={styles.time}> {formatTime(item.updated)}</Text>
          </View>
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
  },
  message: {
    color: '#606060',
    flex: 0.8,
  },
  time: {
    color: '#909090',
    fontSize: 13,
    flex: 0.2,
    // alignSelf: 'flex-start',
  },
});

export default FriendRow;
