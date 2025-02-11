//screens/Main/HomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from "react-native";
import AccountPager from "./AccountPager";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const HomePage = () => {
  const navigation = useNavigation();
  const [isHidden, setIsHidden] = useState(false);
  const translateY = new Animated.Value(0);
  const buttonContainerHeight = new Animated.Value(100);

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

  const handleViewAccounts = () => {
    navigation.navigate("AccountsPage");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
        <AccountPager isHidden={isHidden} />

        <Animated.View style={[styles.recentActivityContainer, { height: buttonContainerHeight }]}>
          <Text style={styles.recentActText}>Smart AI Activities watcher</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => {}}>
              <FontAwesome name="bolt" size={18} color="black" />
              <Text style={styles.buttonText}>Hight Risk Transactions</Text>
            </TouchableOpacity>
        
            <TouchableOpacity style={styles.button} onPress={() => {}}>
              <FontAwesome name="money" size={18} color="black" />
              <Text style={styles.buttonText}>Flagged Activities</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.transactionsHeader}>
          <Text style={styles.transactionsTitle}>Transactions</Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handleViewAllTransactions}
          >
            <Text style={styles.viewAllButtonText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionList}>
          {/* transactions */}
          <Text>Transaction 1</Text>
          <Text>Transaction 2</Text>
          <Text>Transaction 3</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
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
    // marginLeft: 15,
    // marginRight: 10,
    // marginTop: 10,
    margin: 10,
    borderWidth: 0.2,
    padding: 5,
  },
  buttonText: {
    color: "black",
    marginTop: 5,
    fontSize: 12,
    fontWeight: "500",
  },
  recentActText: {
    fontSize: 14,
    fontWeight: "bold",
    paddingLeft: 5,
    paddingTop: 5,
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 2,
  },
  transactionsTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  viewAllButton: {
    padding: 5,
  },
  viewAllButtonText: {
    fontSize: 14,
    color: "black",
    fontWeight: '600'
  },
  transactionList: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
});

export default HomePage;
