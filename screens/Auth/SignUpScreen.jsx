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
} from "react-native";
import logo from "../../assets/photos/logo.png";

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    console.log("Full Name:", fullName);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Sign up completed");
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={60}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerText}>Create Account</Text>
              <Image source={logo} style={styles.logo} />
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <Text style={styles.signupText}>Sign Up</Text>

              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full Name"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#999"
                autoComplete="email"
                importantForAutofill="yes"
                textContentType="emailAddress"
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="********"
                secureTextEntry
                placeholderTextColor="#999"
                autoComplete="password-new"
                textContentType="newPassword"
              />

              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="********"
                secureTextEntry
                placeholderTextColor="#999"
                autoComplete="password-new"
              />

              {/* Link to login */}
              <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.linkText}>Already have an account?</Text>
                </TouchableOpacity>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.signUpText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e5e5e5",
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
    fontSize: 30,
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
    paddingBottom: 40,
  },
  signupText: {
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
    alignItems: "flex-end",
    marginBottom: 30,
  },
  linkText: {
    color: "#888",
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: "#333",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    width: "60%",
    alignSelf: "center",
  },
  signUpText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});

export default SignUpScreen;
