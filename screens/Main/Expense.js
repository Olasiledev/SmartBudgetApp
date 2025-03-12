import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import { categorizeExpenses, getUserTransactions } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ExpenseScreen = () => {
  const { uid, loading: authLoading } = useContext(AuthContext);
  const [categorizedExpenses, setCategorizedExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        if (!uid) return;
        const transactions = await getUserTransactions(uid);
        console.log('Fetched transactions:', transactions);

        const aiResponse = await categorizeExpenses(transactions);
        console.log('AI Categorized Expenses:', aiResponse.predictions);
        setCategorizedExpenses(aiResponse.predictions || []);
      } catch (error) {
        console.error('Error loading expenses:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadExpenses();
    }
  }, [uid, authLoading]);

  const totalSpend = categorizedExpenses.reduce(
    (sum, item) => sum + (item.withdrawal_amt || 0),
    0
  );

  const aggregatedData = categorizedExpenses.reduce((acc, item) => {
    const category = item.predicted_category || 'Unknown';
    acc[category] = (acc[category] || 0) + (item.withdrawal_amt || 0);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        data: Object.values(aggregatedData),
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
        <Text style={styles.header}>AI Expense Insights</Text>

        {/* Total Spend Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Spending</Text>
          <Text style={styles.totalAmount}>${totalSpend.toFixed(2)}</Text>
        </View>

        {/* AI Heading */}
        <Text style={styles.aiInsight}>
          "Here's a smart breakdown of where your money is going this month. Track, analyze, and optimize your spending patterns effortlessly!"
        </Text>

        {/* Bar Chart */}
        {Object.keys(aggregatedData).length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Spending Breakdown</Text>
            <BarChart
              data={chartData}
              width={screenWidth - 60}
              height={250}
              yAxisLabel="$"
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(6, 7, 64, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '', 
                },
              }}
              verticalLabelRotation={30}
              style={styles.chartStyle}
            />
          </View>
        )}

        {/* Top Categories */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔝 Top Categories</Text>
          {Object.entries(aggregatedData)
            .sort((a, b) => b[1] - a[1]) 
            .slice(0, 3)
            .map(([category, amount], index) => (
              <View key={index} style={styles.topCategory}>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
              </View>
            ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📝 Recent Transactions</Text>
          <FlatList
            data={categorizedExpenses}
            keyExtractor={(_, index) => index.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <Text style={styles.transactionDetail}>
                  {item.transaction_details || 'No Description'}
                </Text>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionCategory}>
                    {item.predicted_category || 'Uncategorized'}
                  </Text>
                  <Text style={styles.transactionAmount}>
                    -${item.withdrawal_amt?.toFixed(2) || '0.00'}
                  </Text>
                </View>
              </View>
            )}
          />
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
    margin: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f2f4f7',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#060740',
  },
  aiInsight: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 10,
    lineHeight: 20,
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
  totalAmount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#060740',
    textAlign: 'center',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 12,
  },
  topCategory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  categoryName: {
    fontSize: 16,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionItem: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  transactionDetail: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#777',
  },
  transactionAmount: {
    fontSize: 14,
    color: '#e63946',
  },
});

export default ExpenseScreen;
