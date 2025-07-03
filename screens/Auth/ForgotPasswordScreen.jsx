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
import bg1 from "../../assets/photos/app-bg-7.jpg";
import logo from "../../assets/photos/logo.png";
import { OtpInput } from "react-native-otp-entry";
import {
  ErrorPopup,
  Loading,
  PasswordForgetSuccessPopup,
  SuccessPopup,
} from "../../componentes/Popups";
import {
  CheckUserExisting,
  ForgetPassword,
  SendOtp,
  VerifyOtp,
} from "../../controller/UserController";

const ForgetPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // Track current step (1: input, 2: OTP, 3: new password)
  const [email, setEmail] = useState(""); // Email only
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleCheckUser = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await CheckUserExisting(email);
      if (response) {
        setError("User not found.");
        return;
      }
    } catch (error) {
      console.log(error.response.status);
      if (error?.response?.status === 400) {
        await SendOtp(email);
        setError("");
        setStep(2);
      } else {
        setError("Failed to check user existence.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 5) {
      setError("Please enter a valid 5-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const { token } = await VerifyOtp(email, otp);
      setToken(token);
      setError("");
      setStep(3); // Move to password reset step
    } catch (error) {
      setError(error?.response?.data?.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError("Please enter both password and confirm password.");
      return;
    }

    if (password.length < 6) {
      setError("Minimum password length is 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await ForgetPassword(email, password, token);
      setSuccess(true);
    } catch (error) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
      setError(error?.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setToken("");
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(""); // Clear error when going back
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await SendOtp(email);
      setError("");
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={bg1} style={styles.safeArea}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
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
                    ? "Enter Email"
                    : step === 2
                    ? "Verify OTP"
                    : "Set New Password"}
                </Text>

                {step === 1 && (
                  <>
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
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
                        flexDirection: "row",
                        justifyContent: "space-between",
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
                      autoComplete="new-password"
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
                      autoComplete="new-password"
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
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
    position: "fixed",
    bottom: 0,
    width: "100%",
    height: 200,
    margin: "auto",
    resizeMode: "contain",
  },
});

export default ForgetPasswordScreen;
