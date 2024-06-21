import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface IEmptyProps {
  icon: IconProp;
  message: string;
  centered?: boolean;
}

const Empty: React.FC<IEmptyProps> = ({icon, message, centered = true}) => {
  return (
    <View
      style={[
        styles.container,
        {justifyContent: centered ? 'center' : 'flex-start'},
      ]}>
      <FontAwesomeIcon icon={icon} color="#d0d0d0" size={90} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  text: {
    color: '#c3c3c3',
    fontSize: 18,
    marginTop: 16,
  },
});

export default Empty;
