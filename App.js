import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import StartScreen from "./screens/StartScreen";
import LoginScreen from "./screens/Auth/LoginScreen";
import SignUpScreen from "./screens/Auth/SignUpScreen";
import ForgotPasswordScreen from "./screens/Auth/ForgotPasswordScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MessagesScreen from "./screens/MessagesScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "./controller/context";
import AllChatsScreen from "./screens/AllChatsScreen";
import MyMatches from "./screens/MyMatches";
import TravellingUser from "./screens/TravellingUser";
import PlansScreen from "./screens/PlansScreen";
import ResetPasswordScreen from "./screens/Auth/ResetPasswordScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "heart";
          else if (route.name === "Chats") iconName = "chatbox-ellipses";
          else if (route.name === "Match") iconName = "star";
          else if (route.name === "Profile") iconName = "person";
          else if (route.name === "Travel") iconName = "car";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#e91e63",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Chats"
        component={AllChatsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Travel"
        component={TravellingUser}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Match"
        component={MyMatches}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
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
    return null; // Optionally add a loading spinner
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Main"
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
            options={{ title: "Messages", headerShown: false }}
          />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Login", headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: "Sign Up", headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ title: "Forgot Password", headerShown: false }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            options={{ title: "Reset Password", headerShown: false }}
          />
          <Stack.Screen
            name="Plans"
            component={PlansScreen}
            options={{ title: "Forgot Password", headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
