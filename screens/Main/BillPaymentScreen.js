//screens/BillPaymentScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { AuthContext } from "../../context/AuthContext";

const BillPaymentScreen = () => {
  const [billCategory, setBillCategory] = useState(null);
  const [billerName, setBillerName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleBillPayment = async () => {
    if (!billCategory || !billerName || !amount) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8005/api/pay-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          billCategory,
          billerName,
          amount: parseFloat(amount),
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Bill payment failed.");
      }
      
      Alert.alert("Success", "Bill payment successful!");
      setBillCategory(null);
      setBillerName("");
      setAmount("");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bill Payment</Text>
      <RNPickerSelect
        onValueChange={(value) => setBillCategory(value)}
        items={[{ label: "Electricity", value: "Electricity" }, { label: "Internet", value: "Internet" }, { label: "Subscription", value: "Subscription" }]}
        placeholder={{ label: "Select Bill Category", value: null }}
      />
      <TextInput
        style={styles.input}
        placeholder="Biller Name"
        value={billerName}
        onChangeText={setBillerName}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.payButton} onPress={handleBillPayment}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.payButtonText}>Pay Bill</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 10 },
  payButton: { backgroundColor: "#060740", padding: 15, borderRadius: 8, alignItems: "center" },
  payButtonText: { color: "white", fontWeight: "bold" },
});

export default BillPaymentScreen;