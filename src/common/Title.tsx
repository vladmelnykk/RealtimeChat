import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface ITitleProps {
  text: string;
  color: string;
}

const Title: React.FC<ITitleProps> = ({text, color}) => {
  return (
    <View>
      <Text style={[styles.text, {color}]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 48,
    fontFamily: 'LeckerliOne-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Title;
