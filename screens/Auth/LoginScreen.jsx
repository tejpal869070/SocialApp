import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import logo from "../../assets/photos/logo.png";
import bg1 from "../../assets/photos/app-bg-7.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { UserLogin } from "../../controller/UserController";
import { ErrorPopup } from "../../componentes/Popups";
import { Ionicons } from "@expo/vector-icons";
import { initializeSocket } from "../../controller/Socket";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);

    if (!email || !password) {
      setError("Email & Password are required");
      setIsLoading(false);
      return;
    }

    const formData = {
      email: email,
      password: password,
    };

    try {
      const response = await UserLogin(formData); 
      const { token, email, user_id } = response; 

      // Save token and email in AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("email", email); 
      await AsyncStorage.setItem("user_id", user_id);

      // Initialize Socket.IO connection with token
      initializeSocket(token);

      navigation.navigate("Main");
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={bg1} style={styles.safeArea}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              {/* Header Section */}
              <View style={styles.header}>
                <Text style={styles.headerText}>Find Your Love</Text>
                <Image source={logo} style={styles.logo} />
              </View>

              {/* Login Form Section */}
              <View style={styles.formContainer}>
                <Text style={styles.loginText}>Login</Text>

                {/* Email Input */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  disabled={isLoading}
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                  autoComplete="off"
                  importantForAutofill="no"
                  textContentType="emailAddress"
                />

                {/* Password Input */}
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    disabled={isLoading}
                    placeholder="********"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    autoComplete="off"
                    importantForAutofill="no"
                    textContentType="password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.iconContainer}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>

                {/* Links */}
                <View style={styles.linksContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ForgotPassword")}
                    disabled={isLoading}
                  >
                    <Text style={styles.linkText}>Forget password ?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SignUp")}
                    disabled={isLoading}
                  >
                    <Text style={styles.linkText}>Create an account</Text>
                  </TouchableOpacity>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={handleSignIn}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.signInText}>Sign in</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <StatusBar style="light" />
      </SafeAreaView>

      {/* on error popup */}
      {error && (
        <ErrorPopup
          error={error}
          onClose={() => {
            setError("");
          }}
        />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#2f2f2f",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    position: "relative",
  },

  iconContainer: {
    padding: 5,
    position: "absolute",
    right: 10,
    top: 6,
  },
  headerText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
  },
  logo: {
    width: 90,
    height: 90,
    position: "absolute",
    bottom: -45,
    padding: 4,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    marginTop: 60,
    paddingBottom: 40, // Extra padding for keyboard
  },
  loginText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 80,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  linkText: {
    color: "#888",
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: "#ff4081",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    width: "60%",
    alignSelf: "center",
  },
  signInText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});

export default LoginScreen;
