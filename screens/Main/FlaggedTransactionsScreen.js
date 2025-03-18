// screens/Main/FlaggedTransactionsScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const FlaggedTransactionsScreen = () => {
  const { uid } = useContext(AuthContext);
  const navigation = useNavigation();
  const [flaggedTransactions, setFlaggedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlaggedTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8005/api/transaction/flagged/${uid}`);
        setFlaggedTransactions(response.data.transactions);
      } catch (error) {
        console.error("Error fetching flagged transactions:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (uid) fetchFlaggedTransactions();
  }, [uid]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} />
        </TouchableOpacity>
        <Text style={styles.header}>Flagged Transactions</Text>
      </View>

      <View style={styles.maincontainer}> 


      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : flaggedTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="exclamation-circle" size={50} color="#fff" />
          <Text style={styles.emptyText}>No flagged transactions found.</Text>
        </View>
      ) : (
        <FlatList
          data={flaggedTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text style={styles.transactionTitle}>{item.transactionType}</Text>
              <Text style={styles.transactionDetail}>
                Amount: <Text style={styles.highlight}>${item.amount} {item.currency}</Text>
              </Text>
              <Text style={styles.transactionDetail}>
                Status: <Text style={styles.status}>{item.status}</Text>
              </Text>
              <Text style={styles.transactionDetail}>
                Timestamp: {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  maincontainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
  },
  loader: {
    marginTop: 30,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
  },
  transactionItem: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#060740",
    marginBottom: 5,
  },
  transactionDetail: {
    fontSize: 14,
    color: "#333",
  },
  highlight: {
    fontWeight: "bold",
    color: "#d9534f",
  },
  status: {
    fontWeight: "bold",
    color: "#ff8c00",
  },
});

export default FlaggedTransactionsScreen;
