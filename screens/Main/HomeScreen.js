// screens/Main/HomeScreen.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { getUserTransactions } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import AccountPager from "./AccountPager";

const HomePage = () => {
  const navigation = useNavigation();
  const [isHidden, setIsHidden] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { uid, loading: authLoading } = useContext(AuthContext);
  const translateY = new Animated.Value(0);
  const buttonContainerHeight = new Animated.Value(100);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getUserTransactions(uid);
      const sortedTransactions = data.sort((a, b) => {
        const dateA = a.timestamp._seconds ? a.timestamp._seconds * 1000 : new Date(a.timestamp).getTime();
        const dateB = b.timestamp._seconds ? b.timestamp._seconds * 1000 : new Date(b.timestamp).getTime();
        return dateB - dateA;
      });
      setTransactions(sortedTransactions);
    } catch (error) {
      console.error("Failed to load transactions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (uid) {
        fetchTransactions();
      }
    }, [uid])
  );

  const handleScroll = (event) => {
    const scrolling = event.nativeEvent.contentOffset.y;
    if (scrolling > 120) {
      setIsHidden(true);
      Animated.timing(buttonContainerHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setIsHidden(false);
      Animated.timing(buttonContainerHeight, {
        toValue: 80,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleViewAllTransactions = () => {
    navigation.navigate("TransactionsPage", { showBackButton: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
        <AccountPager isHidden={isHidden} refreshing={refreshing} />
        <Animated.View style={[styles.recentActivityContainer, { height: buttonContainerHeight }]}>
          <Text style={styles.recentActText}>Smart AI Activities Watcher</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} 
              onPress={() => navigation.navigate("SavingsChatScreen", { uid: uid })}
              >
              <FontAwesome name="bolt" size={18} color="black" />
              <Text style={styles.buttonText}>Savings & Budget chat</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.button} 
            onPress={() => navigation.navigate("FlaggedTransactions")}
            >         
              <FontAwesome name="money" size={18} color="black" />
              <Text style={styles.buttonText}>Flagged Activities</Text>
            </TouchableOpacity>



          </View>
        </Animated.View>

        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Transactions</Text>
          <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllTransactions}>
            <Text style={styles.viewAllButtonText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionList}>
          {loading ? (
            <ActivityIndicator size="large" color="#060740" />
          ) : transactions.length === 0 ? (
            <Text>No transactions available.</Text>
          ) : (
            <FlatList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.transactionItem}>
                  <Text style={styles.transactionType}>{item.transactionType}</Text>
                  <Text style={styles.transactionAmount}>{item.amount} {item.currency}</Text>
                  <Text style={styles.transactionDate}>
                    {new Date(
                      item.timestamp._seconds
                        ? item.timestamp._seconds * 1000
                        : item.timestamp
                    ).toLocaleDateString()}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginTop: 0,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 180,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#c3c4c9",
    margin: 10,
    borderWidth: 0.2,
    padding: 5,
  },
  buttonText: { color: "black", marginTop: 5, fontSize: 12, fontWeight: "500" },
  recentActText: { fontSize: 14, fontWeight: "bold", paddingLeft: 5, paddingTop: 5 },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 2,
  },
  transactionsTitle: { fontSize: 14, fontWeight: "600" },
  viewAllButton: { padding: 5 },
  viewAllButtonText: { fontSize: 14, color: "black", fontWeight: "600" },
  transactionList: { marginTop: 20, paddingHorizontal: 10 },
  transactionItem: {
    paddingVertical: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  transactionType: { fontSize: 14, fontWeight: "600" },
  transactionAmount: { fontSize: 13, color: "#060740" },
  transactionDate: { fontSize: 12, color: "#777" },
});

export default HomePage;
