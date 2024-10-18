import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const WorldClockScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>World Clock Screen</Text>
    </View>
  );
};

export default WorldClockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    fontSize: 20,
  },
});
