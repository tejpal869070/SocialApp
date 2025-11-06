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
import * as Location from "expo-location";

export default function StartScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) throw new Error("No token");

        await CheckToken(token); // This should throw if invalid

        initializeSocket(token); // Initialize socket only if valid

        navigation.replace("Main");
      } catch (error) {
        navigation.replace("Login");
      }
    };

    init();
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
      <Text style={styles.title}>Crusha</Text>
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
 