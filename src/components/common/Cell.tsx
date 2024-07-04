import React from 'react';
import {StyleSheet, View} from 'react-native';

interface ICellProps {
  children: React.ReactNode;
}

const Cell: React.FC<ICellProps> = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

export default Cell;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#f0f0f0',
    height: 106,
  },
});
