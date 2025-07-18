import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckToken } from "../controller/UserController"; 
import { initializeSocket } from "../controller/Socket";

export default function StartScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // 1. Check if token is valid
        await CheckToken();

        // 2. Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem("token");

        if (token) {
          // 3. Initialize socket connection with token
          initializeSocket(token);
        }
 
        navigation.replace("Main");
      } catch (error) { 
        navigation.replace("Login");
      }
    };

    checkUser();
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../assets/photos/little-red.jpg")}
      style={styles.container}
    >
      <Image
        alt="logo"
        source={require("../assets/photos/logo.png")}
        style={{ width: 100, height: 100 }}
      />
      <Text style={styles.title}>FORTHOSE</Text>
      <ActivityIndicator size="large" color="#e91e63" style={styles.loader} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 28, fontWeight: "bold", marginTop: 20, color: "#333" },
  loader: { marginTop: 20 },
});
