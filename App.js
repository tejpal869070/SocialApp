import React, { useState, useEffect } from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Platform, View } from "react-native";

// Screens
import StartScreen from "./screens/StartScreen";
import HomeScreen from "./screens/HomeScreen";
import MyMatches from "./screens/MyMatches";
import TravellingUser from "./screens/TravellingUser";
import ProfileScreen from "./screens/ProfileScreen";
import MessagesScreen from "./screens/MessagesScreen";
import AllChatsScreen from "./screens/AllChatsScreen";
import LoginScreen from "./screens/Auth/LoginScreen";
import SignUpScreen from "./screens/Auth/SignUpScreen";
import ForgotPasswordScreen from "./screens/Auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/Auth/ResetPasswordScreen";
import PlansScreen from "./screens/PlansScreen";

// Context
import { AuthProvider } from "./controller/context";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainApp() {
  const insets = useSafeAreaInsets(); // ✅ Get safe area insets

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Chats") iconName = "chatbox-ellipses";
          else if (route.name === "Match") iconName = "heart";
          else if (route.name === "Profile") iconName = "person";
          else if (route.name === "Travel") iconName = "car";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#e91e63",
        tabBarInactiveTintColor: "black",
        tabBarActiveBackgroundColor: "#f0f0f0",
        tabBarStyle: {
          height: Platform.OS === "android" ? 70 + insets.bottom : 60,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 5,
          backgroundColor: "#fff",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chats" component={AllChatsScreen} />
      <Tab.Screen name="Travel" component={TravellingUser} />
      <Tab.Screen name="Match" component={MyMatches} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) {
    return null; // Optionally show loading spinner
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Start"
            screenOptions={{
              ...TransitionPresets.DefaultTransition,
            }}
          >
            <Stack.Screen
              name="Start"
              component={StartScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Main"
              component={MainApp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Messages"
              component={MessagesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Plans"
              component={PlansScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
