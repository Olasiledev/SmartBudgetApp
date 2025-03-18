// screens/Main/SavingsChatScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Easing,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { getSavingsChatResponse } from "../../../services/api";

const DotAnimation = () => {
  const dotsAnim = useRef(new Animated.Value(0)).current;
  const [dotText, setDotText] = useState("");

  const dotStages = ["", ".", "..", "..."];

  useEffect(() => {
    const listenerId = dotsAnim.addListener(({ value }) => {
      const index = Math.floor(value);
      setDotText(dotStages[index] || "");
    });

    startDotAnimation();

    return () => {
      dotsAnim.removeListener(listenerId);
      dotsAnim.stopAnimation();
    };
  }, []);

  const startDotAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotsAnim, {
          toValue: 3,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(dotsAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  return <Text style={styles.thinkingText}>{`Thinking${dotText}`}</Text>;
};

const SavingsChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { uid } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uid) {
      console.error("Error: No UID found in route params");
    } else {
      console.log("UID Retrieved from route:", uid);
    }
  }, [uid]);

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    // Add the user's message to the list
    setMessages((prev) => [...prev, { text: query, sender: "user" }]);
    setQuery(""); // Clears the input box

    try {
      setLoading(true);

      if (!uid) {
        console.error("Error: UID is missing");
        setMessages((prev) => [...prev, { text: "Error: UID missing.", sender: "ai" }]);
        return;
      }

      // Pass both 'query' and 'uid' here:
      const response = await getSavingsChatResponse(query, uid);

      setMessages((prev) => [...prev, { text: response, sender: "ai" }]);
    } catch (error) {
      console.error("Chat API Error:", error.message);
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong. Try again.", sender: "ai" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Savings AI Chat</Text>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={item.sender === "user" ? styles.userMessage : styles.aiMessage}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* AI "Thinking..." Animation */}
        {loading && (
          <View style={styles.thinkingContainer}>
            <DotAnimation />
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about savings..."
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: { padding: 5, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "black" },

  inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#060740",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  sendButtonText: { color: "#fff", fontWeight: "bold" },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageText: { fontSize: 16, color: "white" },

  thinkingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  thinkingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#060740",
  },
});

export default SavingsChatScreen;
