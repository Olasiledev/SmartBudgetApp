import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");
        const storedUid = await AsyncStorage.getItem("uid");

        if (storedUser && storedToken && storedUid) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setUid(storedUid);
          console.log("Loaded user data from storage:", {
            user: JSON.parse(storedUser),
            token: storedToken,
            uid: storedUid,
          });
        } else {
          console.log("No stored user data found.");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
      setLoading(false);
    };

    loadUserData();
  }, []);

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      const response = await fetch("http://localhost:8005/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials. Please check your email and password.");
      }

      const data = await response.json();

      if (!data || !data.token || !data.user || !data.uid) {
        throw new Error("Invalid response from server.");
      }

      //Saving details
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("uid", data.uid);

      setUser(data.user);
      setToken(data.token);
      setUid(data.uid);

      console.log("Login successful. Saved user:", data.user);
      console.log("UID:", data.uid);
      console.log("Token:", data.token);
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error(error.message || "Login failed. Please try again.");
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["user", "token", "uid"]);
    setUser(null);
    setToken(null);
    setUid(null);
    console.log("User logged out and storage cleared.");
  };

  return (
    <AuthContext.Provider value={{ user, token, uid, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
