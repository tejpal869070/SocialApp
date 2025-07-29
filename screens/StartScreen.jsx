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
        await AsyncStorage.getItem("user_id");
        await AsyncStorage.getItem("email");
        const token = await AsyncStorage.getItem("token");

        await CheckToken(token);

        if (token) {
          initializeSocket(token);
        }

        // ✅ Get user's city using location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Location permission not granted");
        } else {
          let location = await Location.getCurrentPositionAsync({});
          let geocode = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          if (geocode.length > 0) {
            const city = geocode[0].city || geocode[0].region;
            console.log("Detected city:", city);

            // Optional: Store city in AsyncStorage or pass to backend
            await AsyncStorage.setItem("city", city);
          }
        }

        // ✅ Navigate to Main
        navigation.replace("Main");
      } catch (error) {
        console.log("Startup Error:", error);
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
