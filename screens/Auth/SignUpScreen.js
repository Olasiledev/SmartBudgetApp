//screens/Auth/SignUpScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import CheckBox from "expo-checkbox";
import { FontAwesome } from '@expo/vector-icons';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateError, setDateError] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const countryCodes = [
    { label: '🇺🇸 +1', value: '+1' },
    { label: '🇬🇧 +44', value: '+44' },
    { label: '🇳🇬 +234', value: '+234' },
    { label: '🇨🇦 +1', value: '+1' }
  ];

  const handleDateChange = (text) => {
    setDateOfBirth(text);
    if (text.length === 10) {
    }
  };

  const handleSignUp = async () => {
    try {
      if (!firstName || !lastName || !username || !email || !password || !confirmPassword || !selectedCountry || !phoneNumber || !dateOfBirth) {
        throw new Error("All fields are required");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      if (!agreeTerms) {
        throw new Error("You must agree to the terms and conditions");
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert("Success", "Sign up successful");
        navigation.navigate("Login");
      }, 2000);
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Error", error.message);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.signUpPageMainBackground}>
          <View style={styles.textInputContainer}>
            <View style={styles.nameContainer}>
              <TextInput
                style={styles.nameTextInput}
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
              />

              <TextInput
                style={styles.nameTextInput}
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={[styles.dateContainer, styles.inputMarginTop]}>
              <TextInput
                style={[styles.textInput, dateError && styles.inputError]}
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={dateOfBirth}
                onChangeText={handleDateChange}
                maxLength={10}
                keyboardType="numeric"
              />
              {dateError ? (
                <Text style={styles.errorText}>{dateError}</Text>
              ) : dateOfBirth.length > 0 ? (
                <Text style={styles.helperText}>
                  {dateOfBirth.length < 10 ? "Keep typing..." : "Valid date format"}
                </Text>
              ) : null}
            </View>

            <TextInput
              style={[styles.textInput, styles.inputMarginTop]}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={[styles.textInput, styles.inputMarginTop]}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <View style={[styles.phoneContainer, styles.inputMarginTop]}>
              <View style={styles.phoneCodeContainer}>
                <RNPickerSelect
                  onValueChange={(value) => setCountryCode(value)}
                  items={countryCodes}
                  style={pickerSelectStyles}
                  value={countryCode}
                  placeholder={{}}
                />
              </View>
              <TextInput
                style={[styles.textInput, styles.phoneInput]}
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            <View style={[styles.passwordContainer, styles.inputMarginTop]}>
              <TextInput
                style={[styles.textInput, styles.passwordInput]}
                placeholder="Enter your password"
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="gray" />
              </TouchableOpacity>
            </View>

            <View style={[styles.passwordContainer, styles.inputMarginTop]}>
              <TextInput
                style={[styles.textInput, styles.passwordInput]}
                placeholder="Confirm your password"
                value={confirmPassword}
                secureTextEntry={!showConfirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="gray" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputMarginTop}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedCountry(value)}
                items={[{ label: "Select Country", value: null }]}
                style={pickerSelectStyles}
                value={selectedCountry}
                placeholder={{ label: "Country of residence", value: null }}
              />
            </View>

            <View style={styles.termsContainer}>
              <CheckBox
                value={agreeTerms}
                onValueChange={setAgreeTerms}
                color={agreeTerms ? "#8c1214" : undefined}
              />
              <Text style={styles.termsText}>
                I agree to the terms and conditions
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={{ flexDirection: "row", paddingTop: 20, alignSelf: 'center' }}>
              <Text style={styles.alreadyHaveAccountText}>
                Already have an account?
              </Text>
              <TouchableOpacity
                style={styles.alreadyHaveAccount}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.signInText}>Sign In!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    justifyContent: "center",
  },
  signUpPageMainBackground: {
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 20,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  nameTextInput: {
    height: 45,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    width: "48%",
    backgroundColor: "white",
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#f0f0f0",
    width: "92%",
    marginTop: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  textInput: {
    height: 50,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    width: "100%",
    backgroundColor: "white",
  },
  inputMarginTop: {
    marginTop: 10,
  },
  phoneInput: {
    height: 50,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginTop: 0,
    width: "100%",
    backgroundColor: "white",
    flex: 1,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  phoneCodeContainer: {
    width: 100,
    marginRight: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    padding: 10,
    position: 'absolute',
    right: 0,
  },
  signUpButton: {
    height: 40,
    backgroundColor: "#060740",
    paddingVertical: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    width: "80%",
    alignSelf: 'center'
  },
  buttonDisabled: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  alreadyHaveAccount: {
    marginLeft: 5,
  },
  alreadyHaveAccountText: {
    fontSize: 16,
    color: "#777",
  },
  signInText: {
    color: "#060740",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  termsText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  dateContainer: {
    width: '100%',
  },
  inputError: {
    borderBottomColor: 'red',
  },
  helperText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginTop: 0,
    width: "100%",
    backgroundColor: "white",
  },
  inputAndroid: {
    height: 50,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginTop: 0,
    width: "100%",
    backgroundColor: "white",
  },
  placeholder: {
    color: 'gray',
  },
});

export default SignUpScreen;

