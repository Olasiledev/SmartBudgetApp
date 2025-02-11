//screens/Main/TransactionsScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExpenseScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Expense Screen</Text>
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


export default ExpenseScreen;
