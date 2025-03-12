import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../../context/AuthContext";

const AccountPager = ({ isHidden }) => {
  const { user } = useContext(AuthContext);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const heightAnim = new Animated.Value(220);

    const navigation = useNavigation();
  

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isHidden ? 180 : 220,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isHidden]);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const formattedBalance = user?.walletAccount?.balance
    ? `$${user.walletAccount.balance.toLocaleString()}`
    : "$0.00";

  const currency = user?.walletAccount?.currency || "CAD";
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Guest User";

  const navigateTransfer = () => {
    navigation.navigate("TransferScreen");
  }

  return (
    <Animated.View style={[styles.viewPager, { height: heightAnim }]}>
      <View style={styles.page}>
        <Text style={styles.greetingText}>Hello,</Text>
        <Text style={styles.usernameText}>{fullName}</Text>

        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>{currency} Balance</Text>
            <TouchableOpacity onPress={toggleBalanceVisibility}>
              <Icon
                name={isBalanceVisible ? "eye" : "eye-slash"}
                size={20}
                color="#000"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {isBalanceVisible ? formattedBalance : "*******"}
          </Text>
          <View style={styles.balanceFooter}>
            <Text style={styles.detailsText}>Tag:</Text>
            <Text style={styles.detailsText}>smartBudget123</Text>
            <TouchableOpacity>
              <Icon name="copy" size={16} color="#0e1278" style={styles.copyIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}
          onPress={() => navigation.navigate("MakeBillPayment")}
          >
            <Icon name="exchange" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Bill Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}
           onPress={() => navigation.navigate("TransferScreen")}
          >
            <Icon name="money" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Transfer</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    backgroundColor: "#060740",
    borderRadius: 12,
    margin: 8,
    shadowColor: "black",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  page: {
    padding: 12,
    justifyContent: "space-between",
    height: "100%",
  },
  greetingText: {
    color: "#fff",
    fontSize: 14,
  },
  usernameText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  balanceCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    width: "100%",
    paddingVertical: 10,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceTitle: {
    fontSize: 14,
    color: "#050733",
    fontWeight: "600",
  },
  balanceAmount: {
    fontSize: 22,
    color: "#050733",
    fontWeight: "bold",
  },
  eyeIcon: {
    marginLeft: 10,
  },
  balanceFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
  detailsText: {
    color: "#050733",
    fontSize: 14,
    marginRight: 2,
    fontWeight: "500",
  },
  copyIcon: {
    marginLeft: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: "#060740",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  actionButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "600",
  },
});

export default AccountPager;
