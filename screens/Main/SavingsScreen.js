//screens/Main/SavingsScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SavingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Savings Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default SavingsScreen;
