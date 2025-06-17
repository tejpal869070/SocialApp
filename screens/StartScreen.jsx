import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function StartScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Start a 2-second delay and user check simultaneously
        const [storedUser] = await Promise.all([
          AsyncStorage.getItem('user'),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);

        if (storedUser) {
          navigation.replace('Main');
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error checking user:', error);
        navigation.replace('Login');
      }
    };

    checkUser();
  }, [navigation]);

  return (
    <ImageBackground source={require("../assets/photos/app-bg-3.jpg")} style={styles.container}>
      <Ionicons name="heart-circle" size={100} color="#e91e63" /> 
      <Text style={styles.title}>SocialApp</Text>
      <ActivityIndicator size="large" color="#e91e63" style={styles.loader} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 20, color: '#333' },
  loader: { marginTop: 20 },
});
