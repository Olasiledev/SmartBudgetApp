import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Main/HomeScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import ExpenseScreen from '../screens/Main/Expense';
import BudgetScreen from '../screens/Main/BudgetScreen';
import SavingsScreen from '../screens/Main/SavingsScreen';
import { FontAwesome } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#060740", 
        tabBarInactiveTintColor: "gray", 
        headerShown: false
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="home" color={color} size={size} />
        }} 
      />
  
      <Tab.Screen 
        name="Expense" 
        component={ExpenseScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="exchange" color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="Budget" 
        component={BudgetScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="pie-chart" color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="Savings" 
        component={SavingsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="money" color={color} size={size} /> 
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" color={color} size={size} />
        }} 
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
