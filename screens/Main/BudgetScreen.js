//screens/Main/BudgetScreen.js
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
import { getBudgetAdvice, getUserTransactions } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const BudgetScreen = () => {
  const { uid, loading: authLoading } = useContext(AuthContext);
  const [budgetAdvice, setBudgetAdvice] = useState('');
  const [formattedAdvice, setFormattedAdvice] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBudget = async () => {
      try {
        if (!uid) return;
        const transactions = await getUserTransactions(uid);
        console.log('Fetched transactions:', transactions);

        const aiResponse = await getBudgetAdvice(transactions);
        console.log('AI Budget Advice:', aiResponse);

        setBudgetAdvice(aiResponse.ai_budget_advice);
        setForecast(aiResponse.forecast || []);
        formatAdvice(aiResponse.ai_budget_advice);
      } catch (error) {
        console.error('Error loading budget advice:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadBudget();
    }
  }, [uid, authLoading]);

  const formatAdvice = (advice) => {
    const lines = advice.split('\n').filter(Boolean);
    setFormattedAdvice(lines);
  };

  const chartData = {
    labels: forecast.map((item) =>
      new Date(item.ds).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    ),
    datasets: [
      {
        data: forecast.map((item) => item.yhat),
      },
    ],
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#060740" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Smart Budget Forecast</Text>

        {/* Forecast Chart */}
        {forecast.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📅 Budget Forecast</Text>
            <LineChart
              data={chartData}
              width={screenWidth - 20}
              height={260}
              yAxisLabel="$"
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(6, 7, 64, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#060740',
                },
              }}
              style={styles.chartStyle}
            />
          </View>
        )}

        {/* Budget Advice */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Budget Insights</Text>
          {formattedAdvice.map((line, index) => {
            const isSubhead = line.trim().startsWith('**') && line.trim().endsWith('**');
            return (
              <Text
                key={index}
                style={isSubhead ? styles.adviceSubhead : styles.adviceText}
              >
                {line.replace(/\*\*/g, '')}
              </Text>
            );
          })}
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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#060740',
  },
  adviceText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  adviceSubhead: {
    fontSize: 18,
    fontWeight: '700',
    color: '#060740',
    marginTop: 12,
    marginBottom: 6,
  },
  chartStyle: {
    marginVertical: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
});

export default BudgetScreen;
