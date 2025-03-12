//screens/Main/SavingsScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { getUserTransactions, getSavingsAdvice } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { BarChart } from 'react-native-chart-kit';
import * as Progress from 'react-native-progress';

const screenWidth = Dimensions.get('window').width;

const SavingsScreen = () => {
  const { uid, loading: authLoading } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [savingsAdvice, setSavingsAdvice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavingsAdvice = async () => {
      try {
        if (!uid) return;

        const fetchedTransactions = await getUserTransactions(uid);
        console.log('Fetched transactions:', fetchedTransactions);
        setTransactions(fetchedTransactions);

        const advice = await getSavingsAdvice(fetchedTransactions);
        console.log('AI Savings Advice:', advice);
        setSavingsAdvice(advice);
      } catch (error) {
        console.error('Error fetching savings advice:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadSavingsAdvice();
    }
  }, [uid, authLoading]);

  // Chart data
  const chartTransactions = transactions.slice(0, 5).map((tx) => ({
    category: tx.transactionType || '',
    amount: tx.amount,
  }));

  const chartData = {
    labels: chartTransactions.map((tx) => tx.category),
    datasets: [
      {
        data: chartTransactions.map((tx) => tx.amount),
      },
    ],
  };

  const savingsTarget = savingsAdvice?.predicted_percentage_of_total || 0;
  const currentSavings = 0.05;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#060740" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Smart Savings Insights</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Spending Overview</Text>
          <BarChart
            data={chartData}
            width={screenWidth - 60}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(6, 7, 64, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            verticalLabelRotation={10}
            style={styles.chartStyle}
          />
        </View>

        {/* Savings Progress */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Savings Goal Progress</Text>
          <Text style={styles.progressText}>
            You’re at {(currentSavings * 100).toFixed(1)}% of the {(
              savingsTarget * 100
            ).toFixed(1)}
            % goal
          </Text>
          <Progress.Bar
            progress={currentSavings / savingsTarget}
            width={screenWidth - 100}
            height={15}
            color="#060740"
            unfilledColor="#dfe3e6"
            borderColor="#dfe3e6"
            style={{ marginTop: 10 }}
          />
        </View>

        {/* AI Savings Advice */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💰 AI Savings Recommendation</Text>
          <Text style={styles.adviceText}>
            {savingsAdvice?.ai_savings_advice || 'No advice available.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f2f4f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#060740',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#060740',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default SavingsScreen;
