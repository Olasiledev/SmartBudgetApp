//navigation/AuthNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import MakeBillPayment from '../screens/Main/MakeBillPayment';
import TransferScreen from '../screens/Main/TransferScreen';
import MainTabs from './MainTabs';
import FlaggedTransactionsScreen from '../screens/Main/FlaggedTransactionsScreen';
import BudgetChatScreen from '../screens/Main/ChatScreens/BudgetChatScreen';
import SavingsChatScreen from '../screens/Main/ChatScreens/SavingsChatScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
           <Stack.Screen
        name="Landing"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MakeBillPayment"
        component={MakeBillPayment}
        options={{ headerShown: false }}
      />
     <Stack.Screen
        name="TransferScreen"
        component={TransferScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FlaggedTransactions"
        component={FlaggedTransactionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BudgetChatScreen"
        component={BudgetChatScreen}
        options={{ headerShown: false }}
        />
      <Stack.Screen
        name="SavingsChatScreen"
        component={SavingsChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
