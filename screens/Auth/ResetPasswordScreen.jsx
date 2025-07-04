import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import logo from "../../assets/photos/shield.jpg";
import { ResetPassword } from "../../controller/UserController";
import {
  ErrorPopup,
  Loading,
  PasswordForgetSuccessPopup,
} from "../../componentes/Popups";

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    if (
      !oldPassword ||
      !newPassword ||
      !confirmPassword ||
      oldPassword.length < 6 ||
      newPassword.length < 6
    ) {
      setError("Please fill in all fields. Minimum length 6");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    setIsLoading(true);
    try {
      await ResetPassword(oldPassword, newPassword);
      setSuccess(true);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Reset Password</Text>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={{ padding: 20 }}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>Old Password</Text>
          <TextInput
            style={styles.input}
            placeholder="******"
            placeholderTextColor="#999"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <Text style={styles.inputText}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="******"
            placeholderTextColor="#999"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Text style={styles.inputText}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="******"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Text>
        </TouchableOpacity>
      </View>

      {success && (
        <PasswordForgetSuccessPopup
          onClose={() => {
            setSuccess(false);
            navigation.navigate("Login");
          }}
        />
      )}
      {error && <ErrorPopup error={error} onClose={() => setError("")} />}
      {isLoading && <Loading onClose={() => setIsLoading(false)} />}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 40,
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
    borderRadius: 50,
    borderWidth: 2,
  },
  inputContainer: {
    marginBottom: 30,
    marginTop: 80,
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
  button: {
    backgroundColor: "#FF5555",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputText:{
    marginLeft : 8,
    fontStyle : 'italic',
    fontWeight : 'bold',
  },
  buttonDisabled: {
    backgroundColor: "#FF8888",
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ResetPasswordScreen;
