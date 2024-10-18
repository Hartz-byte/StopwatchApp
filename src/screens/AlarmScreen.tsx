import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const AlarmScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Alarm Screen</Text>
    </View>
  );
};

export default AlarmScreen;

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
