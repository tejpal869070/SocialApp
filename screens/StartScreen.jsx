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
    const init = async () => {
      try {
        // 1. Store values in AsyncStorage
        // await AsyncStorage.getItem("token");
        await AsyncStorage.getItem("user_id");
        await AsyncStorage.getItem("email");

        // Optional: confirm storage
        const storedToken = await AsyncStorage.getItem("token");
        console.log("Stored token:", storedToken);

        // 2. Check token validity
        await CheckToken(storedToken);
 
        // 3. Initialize socket with stored token
        if (storedToken) {
          initializeSocket(storedToken);
        }

        // 4. Navigate to Main screen
        navigation.replace("Main");
      } catch (error) {
        console.log("Error during user check:", error?.response?.data || error);
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
