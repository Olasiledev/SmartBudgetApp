// screens/Main/MakeBillPayment.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { payBill } from "../../services/api";
import Icon from "react-native-vector-icons/FontAwesome";


const billersData = {
  Groceries: ["Walmart", "Costco", "Superstore", "Safeway", "Whole Foods"],
  Rent: ["Monthly Rent Payment", "Lease Payment", "Apartment Rent", "Mortgage Payment"],
  Utilities: ["Electricity Bill", "Water Bill", "Internet Bill", "Gas Bill", "Hydro One Payment"],
  Entertainment: ["Netflix Subscription", "Cinema Tickets", "Concert Tickets", "Spotify Subscription"],
  Transport: ["Uber Ride", "Gas Station", "Public Transit Pass", "Taxi Service"],
  "Dining Out": ["Restaurant Bill", "Cafe Purchase", "Fast Food Payment", "Tim Hortons", "Starbucks"],
  Healthcare: ["Pharmacy Purchase", "Doctor Consultation", "Dental Clinic", "Prescription Refill"],
  Others: ["Miscellaneous Expense", "Charity Donation", "Online Shopping", "Amazon Purchase"],
};

const MakeBillPayment = () => {
  const { uid } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState("Utilities");
  const [selectedBiller, setSelectedBiller] = useState(billersData["Utilities"][0]);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [billerModalVisible, setBillerModalVisible] = useState(false);

  const handleBillPayment = async () => {
    if (!selectedBiller || !accountNumber || !amount) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const payload = {
      userId: uid,
      billerName: selectedBiller,
      billerType: selectedCategory,
      accountNumber,
      amount: parseFloat(amount),
      currency: "CAD",
      paymentMethod: "Wallet",
    };

    try {
      setLoading(true);
      await payBill(payload);
      setLoading(false);
      Alert.alert("Success", "Bill payment completed successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error processing bill payment:", error);
      Alert.alert("Error", "Failed to complete bill payment. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={{ padding: 16 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Bill Payment</Text>

        {/* Category Selection */}
        <Text style={styles.label}>Select Category</Text>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={styles.modalButtonText}>{selectedCategory}</Text>
        </TouchableOpacity>

        {/* Category Modal */}
        <Modal visible={categoryModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={Object.keys(billersData)}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedCategory(item);
                      setSelectedBiller(billersData[item][0]); 
                      setCategoryModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Biller Selection */}
        <Text style={styles.label}>Select Biller</Text>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setBillerModalVisible(true)}
        >
          <Text style={styles.modalButtonText}>{selectedBiller}</Text>
        </TouchableOpacity>

        {/* Biller Modal */}
        <Modal visible={billerModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={billersData[selectedCategory]}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedBiller(item);
                      setBillerModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Account Number */}
        <Text style={styles.label}>Account Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter account number"
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType="numeric"
        />

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value= {amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Text style={styles.label}> Payment Method</Text>
        <View style={styles.fixedInput}>
          <Text style={styles.fixedText}>Wallet</Text>
        </View>

        <Text style={styles.label}> Currency</Text>
        <View style={styles.fixedInput}>
          <Text style={styles.fixedText}>CAD</Text>
        </View>

        <TouchableOpacity
          style={styles.payButton}
          onPress={handleBillPayment}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Processing..." : "Pay Bill"}</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f4f7",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#060740",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#060740",
  },
  modalButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 5,
  },
  modalButtonText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "80%",
    maxHeight: "60%",
    padding: 10,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  fixedInput: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
  },
  fixedText: {
    fontSize: 16,
    color: "#555",
  },
  payButton: {
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
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 5,
  },
});

export default MakeBillPayment;
