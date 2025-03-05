//screens/Auth/LoginScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";

const LoginScreen = () => {
  const [email, setEmail] = useState("testaccount@smartbudget.ai");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      Alert.alert("Success", "Login successful.");
      navigation.replace("Landing");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View style={styles.loginPageMainBackground}>
        <Text style={styles.loginText}>Sign In</Text>
        <Image
          source={require("../../assets/cardgirl3-white.png")}
          style={styles.loginPageImage}
          onError={(error) =>
            console.error("Image loading error:", error.nativeEvent.error)
          }
        />

        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.textInput, styles.passwordInput]}
              placeholder="Enter your password"
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome
                name={showPassword ? "eye-slash" : "eye"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", paddingTop: 20 }}>
          <Text style={styles.alreadyHaveAccountText}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            style={styles.alreadyHaveAccount}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.signUpText}>Sign Up!</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Enter your email"
              value={forgotPasswordEmail}
              onChangeText={(text) => setForgotPasswordEmail(text)}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginPageMainBackground: {
    backgroundColor: "white",
    alignItems: "center",
    height: "100%",
  },
  loginText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    paddingTop: 10,
  },
  loginPageImage: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#f0f0f0",
    width: "90%",
    marginTop: 20,
    borderRadius: 15,
    elevation: 5,
  },
  textInput: {
    height: 50,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: "white",
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#060740",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    width: "80%",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    paddingBottom: 20,
  },
  forgotText: {
    color: "#060740",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    backgroundColor: "white",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#060740",
  },
  modalTextInput: {
    height: 50,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginTop: 20,
    backgroundColor: "white",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#060740",
    paddingVertical: 10,
    borderRadius: 25,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  modalButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  alreadyHaveAccountText: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 4,
  },
  signUpText: {
    color: "#060740",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default LoginScreen;
