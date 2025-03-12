//screens/Main/TransferScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { transferFunds } from "../../services/api"; 

const TransferScreen = () => {
  const { uid } = useContext(AuthContext);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const defaultCurrency = "CAD";
  const defaultPaymentMethod = "Wallet";

  const navigation = useNavigation();

  const handleTransfer = async () => {
    try {
      if (!receiverEmail || !amount) {
        Alert.alert("Error", "Please enter all required fields.");
        return;
      }

      setLoading(true);
      const senderId = uid;
      const senderIp = "192.168.1.1"; 
      const receiverIp = "192.168.1.2";
  
      const result = await transferFunds(senderId, receiverEmail, parseFloat(amount), defaultCurrency, defaultPaymentMethod, note, senderIp, receiverIp);
      
      console.log("Transfer Successful:", result);
      Alert.alert("Success", "Funds transferred successfully!");
      navigation.goBack();
      
      setReceiverEmail("");
      setAmount("");
      setNote("");
    } catch (error) {
    //   console.error("Transfer Failed:", error);
      Alert.alert("Error", error.message || "Transfer failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Send Money</Text>
      <View style={{ padding: 16 }}>

        <Text style={styles.label}>Receiver's Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter receiver's email"
          value={receiverEmail}
          onChangeText={setReceiverEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Currency</Text>
        <View style={styles.nonClickableField}>
          <Text style={styles.defaultText}>{defaultCurrency}</Text>
        </View>

        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.nonClickableField}>
          <Text style={styles.defaultText}>{defaultPaymentMethod}</Text>
        </View>

        <Text style={styles.label}>Note (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a note (optional)"
          value={note}
          onChangeText={setNote}
        />

        <TouchableOpacity style={styles.transferButton} onPress={handleTransfer} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Transfer</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#f9fafb",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#060740",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#060740",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 5,
  },
  nonClickableField: {
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 5,
  },
  defaultText: {
    fontSize: 16,
    color: "#444",
  },
  transferButton: {
    backgroundColor: "#060740",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TransferScreen;
