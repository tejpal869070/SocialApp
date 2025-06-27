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
  SafeAreaView,
  ImageBackground,
} from "react-native";
import bg1 from "../../assets/photos/app-bg-7.jpg";
import logo from "../../assets/photos/logo.png";
import { OtpInput } from "react-native-otp-entry";
import { ErrorPopup, Loading, SuccessPopup } from "../../componentes/Popups";

// Hypothetical API functions (replace with your actual API calls)
const checkUserExists = async (identifier) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (identifier === "tsoni9742@gmail.com" || identifier === "1234567890") {
        resolve({ exists: true });
      } else {
        reject(new Error("User not found"));
      }
    }, 1000);
  });
};

const sendOTP = async (identifier) => {
  // Simulate sending OTP to email or mobile
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};

const verifyOTP = async (identifier, otp) => {
  // Simulate OTP verification
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === "12345") {
        resolve({ success: true });
      } else {
        reject(new Error("Invalid OTP"));
      }
    }, 1000);
  });
};

const resetPassword = async (identifier, newPassword) => {
  // Simulate password reset
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};

const ForgetPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // Track current step (1: input, 2: OTP, 3: new password)
  const [identifier, setIdentifier] = useState(""); // Email or mobile
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCheckUser = async () => {
    if (!identifier) {
      alert("Please enter your email or mobile number");
      return;
    }
    setIsLoading(true);
    try {
      await checkUserExists(identifier);
      await sendOTP(identifier);
      setStep(2); // Move to OTP step
    } catch (error) {
      setError(error.message || "User not found");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 5) {
      alert("Please enter a valid 5-digit OTP");
      return;
    }
    setIsLoading(true);
    try {
      await verifyOTP(identifier, otp);
      setStep(3); // Move to password reset step
    } catch (error) {
      setError(error.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword || password.length < 6) {
      alert("Minimum password length is 6");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(identifier, password);
      setSuccess(true);
      setIdentifier("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await sendOTP(identifier);
      alert("OTP resent successfully");
    } catch (error) {
      setError(error.message || "Failed to resend OTP");
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
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerText}>Find Your Love</Text>
                <Image source={logo} style={styles.logo} />
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                <Text style={styles.titleText}>
                  {step === 1
                    ? "Enter Email or Mobile"
                    : step === 2
                    ? "Verify OTP"
                    : "Set New Password"}
                </Text>

                {step === 1 && (
                  <>
                    <TextInput
                      style={styles.input}
                      value={identifier}
                      onChangeText={setIdentifier}
                      placeholder="user@gmail.com"
                      keyboardType="email-address"
                      placeholderTextColor="#999"
                      autoComplete="email"
                      textContentType="emailAddress"
                    />
                    <TouchableOpacity
                      style={[styles.actionButton, { marginTop: 20 }]}
                      onPress={handleCheckUser}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.actionText}>Continue 👉</Text>
                      )}
                    </TouchableOpacity>
                    <View style={styles.linksContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                      >
                        <Text style={styles.linkText}>Back to Login</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {step === 2 && (
                  <>
                    <OtpInput
                      numberOfDigits={5}
                      focusColor="green"
                      autoFocus={false}
                      hideStick={true}
                      blurOnFilled={true}
                      disabled={false}
                      type="numeric"
                      secureTextEntry={false}
                      focusStickBlinkingDuration={500}
                      onTextChange={(text) => setOtp(text)}
                      onFilled={(text) => setOtp(text)}
                      textInputProps={{
                        accessibilityLabel: "One-Time Password",
                      }}
                      textProps={{
                        accessibilityRole: "text",
                        accessibilityLabel: "OTP digit",
                        allowFontScaling: false,
                      }}
                      theme={{
                        containerStyle: styles.Otpcontainer,
                        pinCodeContainerStyle: styles.pinCodeContainer,
                        pinCodeTextStyle: styles.pinCodeText,
                        focusStickStyle: styles.focusStick,
                      }}
                    />
                    <TouchableOpacity onPress={handleResendOTP}>
                      <Text
                        style={[
                          styles.linkText,
                          { color: "black", fontWeight: "600" },
                        ]}
                      >
                        RESEND OTP ?
                      </Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: 20,
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBack}
                      >
                        <Text style={styles.backText}>⬅️ Back</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleVerifyOTP}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.actionText}>Verify OTP</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {step === 3 && (
                  <>
                    <Text style={styles.label}>New Password</Text>
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
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 6,
                        marginTop: 20,
                      }}
                    >
                      <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBack}
                      >
                        <Text style={styles.backText}>⬅️ Back</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleResetPassword}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.actionText}>Reset Password</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.linksContainer}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                      >
                        <Text style={styles.linkText}>Back to Login</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>

            <Image
              style={styles.bottomImg}
              source={require("../../assets/photos/couple.png")}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {success && <SuccessPopup onClose={() => navigationnavigate("Login")} />}
      {error && <ErrorPopup error={error} onClose={() => setError("")} />}
      {isLoading && <Loading onClose={() => setIsLoading(false)} />}
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
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: "#ff4081",
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
    width: "40%",
    alignSelf: "center",
    marginBottom: 20,
  },

  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#666",
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
    width: "40%",
    alignSelf: "center",
    marginBottom: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  linksContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  linkText: {
    color: "#007AFF",
    fontSize: 14,
  },
  Otpcontainer: {
    marginBottom: 20,
  },
  pinCodeContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  pinCodeText: {
    fontSize: 20,
    color: "#333",
  },
  focusStick: {
    backgroundColor: "green",
  },
  activePinCodeContainer: {
    borderColor: "green",
  },
  placeholderText: {
    color: "#999",
  },
  filledPinCodeContainer: {
    borderColor: "#007AFF",
  },
  disabledPinCodeContainer: {
    backgroundColor: "#f0f0f0",
  },
  bottomImg: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 300,
    margin: "auto",
    resizeMode: "contain",
  },
});

export default ForgetPasswordScreen;
