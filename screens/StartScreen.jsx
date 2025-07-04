import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { CheckToken } from "../controller/UserController";

export default function StartScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        await CheckToken(); 
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
      {/* <Ionicons name="heart-circle" size={100} color="#e91e63" /> */}
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
