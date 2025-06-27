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
import maleIcon from "../../assets/photos/male.png";
import femaleIcon from "../../assets/photos/female.png";
import transgenderIcon from "../../assets/photos/transition.png";
import { Dropdown } from "react-native-element-dropdown";
import bg1 from "../../assets/photos/app-bg-7.jpg";
import { OtpInput } from "react-native-otp-entry";
import { UserRegister } from "../../controller/UserController";
import { ErrorPopup, Loading, SuccessPopup } from "../../componentes/Popups";

// Hypothetical OTP verification function (replace with your actual API call)
const verifyOTP = async (email, otp) => {
  // Simulate an API call to verify OTP
  // Replace this with your actual backend API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === "12345") {
        // Example: Assume "12345" is the correct OTP
        resolve({ success: true });
      } else {
        reject(new Error("Invalid OTP"));
      }
    }, 1000);
  });
};

const SignUpScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // Start at step 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dobDate, setDobDate] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Generate dropdown options for DOB
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 83 }, (_, i) => ({
    label: `${currentYear - 18 - i}`,
    value: `${currentYear - 18 - i}`,
  })); // 18 to 100 years
  const months = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];
  const days = Array.from({ length: 31 }, (_, i) => ({
    label: `${i + 1}`.padStart(2, "0"),
    value: `${i + 1}`.padStart(2, "0"),
  }));

  const genderOptions = [
    { label: "Male", value: "M", icon: maleIcon },
    { label: "Female", value: "F", icon: femaleIcon },
    { label: "Both", value: "B", icon: transgenderIcon },
  ];

  const handleContinue = () => {
    if (step === 1) {
      if (!fullName) {
        alert("Please enter your full name");
        return;
      }
    }

    if (step === 2) {
      if (!email || !mobile) {
        alert("Please enter both email and mobile number");
        return;
      }
      if (isNaN(mobile) || mobile.length !== 10) {
        alert("Please enter a valid 10-digit mobile number");
        return;
      }
    }

    if (step === 3) {
      if (!dobDate || !dobMonth || !dobYear) {
        alert("Please select your full date of birth");
        return;
      }
    }

    if (step === 4) {
      if (!gender) {
        alert("Please select your gender");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    if (!password || !confirmPassword || password.length < 6) {
      alert("Minimum password length is 6");
      setIsLoading(false);
      return;
    } else if (password !== confirmPassword) {
      alert("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const formData = {
      name: fullName,
      email: email,
      dob: `${dobYear}-${dobMonth}-${dobDate}`,
      gender: gender,
      password: password,
      mobile: mobile,
    };

    try {
      await UserRegister(formData);
      setStep(6); // Move to OTP verification step
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
      setIsLoading(false);
      setStep(6);
    }
  };

  const handleOTPSubmit = async () => {
    setIsLoading(true);
    try {
      await verifyOTP(email, otp);
      setSuccess(true);
      // Clean form data
      setFullName("");
      setEmail("");
      setDobYear("");
      setDobMonth("");
      setDobDate("");
      setGender("");
      setPassword("");
      setConfirmPassword("");
      setMobile("");
      setOtp("");
    } catch (error) {
      setError(error.message || "Invalid OTP");
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
                <Text style={styles.signupText}>
                  {step === 6 ? "Verify Email" : "Create Account"}
                </Text>

                {step === 1 && (
                  <>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Full Name"
                      placeholderTextColor="#999"
                    />
                    <TouchableOpacity
                      style={[styles.signUpButton, { marginTop: 20 }]}
                      onPress={handleContinue}
                      disabled={isLoading}
                    >
                      <Text style={styles.signUpText}>Continue 👉</Text>
                    </TouchableOpacity>
                  </>
                )}

                {step === 2 && (
                  <>
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
                    <Text style={styles.label}>Mobile</Text>
                    <TextInput
                      style={styles.input}
                      value={mobile}
                      onChangeText={setMobile}
                      placeholder="Mobile No."
                      keyboardType="phone-pad"
                      placeholderTextColor="#999"
                      autoComplete="tel"
                      importantForAutofill="yes"
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
                        style={styles.signUpButton}
                        onPress={handleContinue}
                        disabled={isLoading}
                      >
                        <Text style={styles.signUpText}>Continue 👉</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {step === 3 && (
                  <>
                    <Text style={styles.label}>Date of Birth</Text>
                    <View style={styles.dobContainer}>
                      <Dropdown
                        style={[styles.input, styles.dobInput]}
                        data={days}
                        labelField="label"
                        valueField="value"
                        placeholder="Day"
                        value={dobDate}
                        onChange={(item) => setDobDate(item.value)}
                      />
                      <Dropdown
                        style={[styles.input, styles.dobInput]}
                        data={months}
                        labelField="label"
                        valueField="value"
                        placeholder="Month"
                        value={dobMonth}
                        onChange={(item) => setDobMonth(item.value)}
                      />
                      <Dropdown
                        style={[styles.input, styles.dobInput]}
                        data={years}
                        labelField="label"
                        valueField="value"
                        placeholder="Year"
                        value={dobYear}
                        onChange={(item) => setDobYear(item.value)}
                      />
                    </View>
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
                        style={styles.signUpButton}
                        onPress={handleContinue}
                        disabled={isLoading}
                      >
                        <Text style={styles.signUpText}>Continue 👉</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {step === 4 && (
                  <>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.genderContainer}>
                      {genderOptions.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.genderOption,
                            gender === option.value &&
                              styles.genderOptionSelected,
                          ]}
                          onPress={() => setGender(option.value)}
                        >
                          <Image
                            source={option.icon}
                            style={styles.genderIcon}
                          />
                          <Text style={styles.genderText}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
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
                        style={styles.signUpButton}
                        onPress={handleContinue}
                        disabled={isLoading}
                      >
                        <Text style={styles.signUpText}>Continue 👉</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {step === 5 && (
                  <>
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
                  </>
                )}

                {step === 6 && (
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
                      onFocus={() => console.log("Focused")}
                      onBlur={() => console.log("Blurred")}
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
                        focusedPinCodeContainerStyle:
                          styles.activePinCodeContainer,
                        placeholderTextStyle: styles.placeholderText,
                        filledPinCodeContainerStyle:
                          styles.filledPinCodeContainer,
                        disabledPinCodeContainerStyle:
                          styles.disabledPinCodeContainer,
                      }}
                    />


                    {/*resend otp */}
                    <TouchableOpacity
                      onPress={() => { 
                        console.log("Resend OTP");
                      }}
                    >
                      <Text
                        style={[
                          styles.linkText,
                          { color: "black", fontWeight: "600" },
                        ]}
                      >
                        RESEND OTP ?
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.linksContainer}>
                      <TouchableOpacity
                        style={[styles.signUpButton, { marginTop: 20 }]}
                        onPress={handleOTPSubmit}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.signUpText}>Verify OTP</Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.backButton, { marginTop: 20 }]}
                        onPress={handleBack}
                      >
                        <Text style={styles.backText}>⬅️ Back</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {step !== 6 && (
                  <View style={styles.linksContainer}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Login")}
                    >
                      <Text style={styles.linkText}>
                        Already have an account?
                      </Text>
                    </TouchableOpacity>
                  </View>
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

      {success && <SuccessPopup onClose={() => navigation.navigate("Login")} />}
      {error && <ErrorPopup error={error} onClose={() => setError("")} />}
      {isLoading && <Loading onClose={() => setIsLoading(false)} />}
    </ImageBackground>
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
    padding: 4,
  },
  signUpImage: {
    width: 200,
    height: 200,
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
  dobContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dobInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  genderOption: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  genderOptionSelected: {
    borderColor: "#333",
    backgroundColor: "#f0f0f0",
  },
  genderIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  genderText: {
    fontSize: 14,
    color: "#333",
  },
  linksContainer: {
    alignItems: "flex-end",
    marginBottom: 30,
    marginTop: 20,
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  linkText: {
    color: "#888",
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: "#ff4081",
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
    width: "40%",
    alignSelf: "center",
    marginBottom: 20,
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
  signUpText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  bottomImg: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 300,
    margin: "auto",
    resizeMode: "contain",
  },
  pinCodeContainer: {
    backgroundColor: "white",
    width: "15%",
    borderColor: "#ddd",
  },
  Otpcontainer: {
    marginBottom: 10,
    borderRadius: 15,
  },
});

export default SignUpScreen;
