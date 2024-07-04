import React from 'react';
import {Animated, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Title from '../components/common/Title';

const SplashScreen = () => {
  const translateY = new Animated.Value(0);
  const duration = 2000;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 20,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <Animated.View style={[{transform: [{translateY: translateY}]}]}>
        <Title text="RealtimeChat" color="white" />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default SplashScreen;
