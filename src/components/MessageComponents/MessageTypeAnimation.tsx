import React from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';

interface MessageAnimitedItemProps {
  animatedValue: Animated.Value;
}

const MessageAnimatedItem: React.FC<MessageAnimitedItemProps> = ({
  animatedValue,
}) => {
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  return <Animated.View style={[styles.container, {transform: [{scale}]}]} />;
};

const MessageTypeAnimation: React.FC = () => {
  const value1 = React.useRef(new Animated.Value(0)).current;
  const value2 = React.useRef(new Animated.Value(0)).current;
  const value3 = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const time = 200;

    const createAnimation = (animatedValue: Animated.Value) => {
      return Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: time,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: time,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]);
    };

    const animations = [
      createAnimation(value1),
      createAnimation(value2),
      createAnimation(value3),
    ];

    const animation = Animated.loop(Animated.stagger(time, animations));
    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  return (
    <View style={{flexDirection: 'row'}}>
      <MessageAnimatedItem animatedValue={value1} />
      <MessageAnimatedItem animatedValue={value2} />
      <MessageAnimatedItem animatedValue={value3} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 1.5,
    backgroundColor: '#606060',
  },
});

export default MessageTypeAnimation;
