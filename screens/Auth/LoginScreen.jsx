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
import { StatusBar } from "expo-status-bar";
import bg1 from "../../assets/photos/app-bg-7.jpg";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    console.log("Email:", email);
    console.log("Password:", password);

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("API call completed");
      navigation.navigate("Main");
    }, 2000);
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
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                  autoComplete="off"
                  importantForAutofill="no"
                  textContentType="emailAddress"
                />

                {/* Password Input */}
                <Text style={styles.label}>Password</Text>

                <TextInput
                  style={[styles.input]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="********"
                  secureTextEntry
                  placeholderTextColor="#999"
                  autoComplete="off"
                  importantForAutofill="no"
                  textContentType="password"
                />

                {/* Links */}
                <View style={styles.linksContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SignUp")}
                  >
                    <Text style={styles.linkText}>Forget password ?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SignUp")}
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
    // borderRadius: 45,
    // backgroundColor: "#fff",
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
    borderRadius: 8,
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
