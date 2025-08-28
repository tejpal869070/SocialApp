import React, { useEffect, useState } from "react";
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
import {
  CheckUserExisting,
  GetCities,
  SendOtp,
  UserRegister,
  VerifyOtp,
} from "../../controller/UserController";
import { ErrorPopup, Loading, SuccessPopup } from "../../componentes/Popups";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // Start at step 1
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
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

  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    { label: "Trans", value: "T", icon: transgenderIcon },
  ];

  const handleContinue = async () => {
    // Step 1: Validate Full Name
    if (step === 1) {
      if (!fullName.trim()) {
        setError("Please enter your full name.");
        return;
      } else if (!city.trim()) {
        setError("Please enter your city.");
        return;
      }

      // Ensure city is from allCities
      const cityMatch = allCities.find(
        (c) => c.name.toLowerCase() === city.trim().toLowerCase()
      );
      if (!cityMatch) {
        setError("Please select a valid city from the suggestions.");
        return;
      }
    }

    // Step 2: Validate Email and Mobile
    if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;

      if (!email || !mobile) {
        setError("Please enter both email and mobile number.");
        return;
      }

      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      if (!phoneRegex.test(mobile)) {
        setError("Please enter a valid 10-digit mobile number.");
        return;
      }

      setIsLoading(true);
      try {
        const isValid = await CheckUserExisting(email, mobile);
        if (!isValid) {
          setError("User with this email or mobile already exists.");
          setIsLoading(false);
          return;
        }
      } catch (error) {
        setError(error?.response?.data?.message || "Something went wrong!");
        setIsLoading(false);
        return;
      }
    }

    // Step 3: Validate Date of Birth
    if (step === 3) {
      if (!dobDate || !dobMonth || !dobYear) {
        setError("Please select your full date of birth.");
        return;
      }
    }

    // Step 4: Validate Gender
    if (step === 4) {
      if (!gender) {
        setError("Please select your gender.");
        return;
      }
    }

    // All validations passed, move to next step
    setError(""); // Clear any existing error
    setStep((prev) => prev + 1);
    setIsLoading(false);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(""); // Clear error when going back
  };

  const handleSignUp = async () => {
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
      await SendOtp(email);
      setStep(6); // Move to OTP verification step
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    if (otp.length !== 5) {
      setError("Please enter a 5-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const { token } = await VerifyOtp(email, otp);
      const formData = {
        name: fullName,
        city: city,
        email: email,
        dob: `${dobYear}-${dobMonth}-${dobDate}`,
        gender: gender,
        password: password,
        mobile: mobile,
        token: token,
      };
      const { email2, token2, user_id } = await UserRegister(formData);
      await AsyncStorage.setItem("token", token2);
      await AsyncStorage.setItem("user_id", user_id);
      await AsyncStorage.setItem("email", email2);

      // update city in asyncStorage
      const storedCities = (await AsyncStorage.getItem("selectedCities")) || [];
      const newCities = [...storedCities, city];
      await AsyncStorage.setItem("selectedCities", JSON.stringify(newCities));

      setSuccess(true);
      // Reset form after successful registration
      resetForm();
    } catch (error) {
      setError(
        error?.response?.data?.message || "Invalid OTP or registration failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCityChange = (text) => {
    setCity(text);

    if (text.length === 0) {
      setFilteredCities([]);
      setShowSuggestions(false);
      return;
    }

    const matches = allCities.filter((city) =>
      city.name.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredCities(matches.slice(0, 5));
    setShowSuggestions(true);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity.name);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await GetCities(); 
        setAllCities(response);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  const resetForm = () => {
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
                <Text style={styles.signupText}>
                  {step === 1
                    ? "Enter Your Name"
                    : step === 2
                    ? `Hi, ${fullName}`
                    : step === 3
                    ? "Select Your Date of Birth"
                    : step === 4
                    ? "Select Your Gender"
                    : step === 5
                    ? "Set Your Password"
                    : step === 6
                    ? "Verify Your Email"
                    : "Create Account"}
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
                    <View style={{ position: "relative", zIndex: 1 }}>
                      <Text style={styles.label}>Your City</Text>
                      <TextInput
                        style={styles.input}
                        value={city}
                        onChangeText={handleCityChange}
                        placeholder="City"
                        placeholderTextColor="#999"
                      />

                      {showSuggestions && filteredCities.length > 0 && (
                        <View style={styles.dropdown}>
                          {filteredCities.map((cityItem) => (
                            <TouchableOpacity
                              key={cityItem.id}
                              style={styles.dropdownItem}
                              onPress={() => handleCitySelect(cityItem)}
                            >
                              <Text>
                                {cityItem.name}, {cityItem.state}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>

                    <TouchableOpacity
                      style={styles.signUpButton}
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

                    {/* Resend OTP */}
                    <TouchableOpacity
                      onPress={async () => {
                        setOtp("");
                        setIsLoading(true);
                        try {
                          await SendOtp(email);
                          setError("");
                        } catch (error) {
                          setError(
                            error?.response?.data?.message ||
                              "Failed to resend OTP."
                          );
                        } finally {
                          setIsLoading(false);
                        }
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
                    {/* OTP verify and signup */}
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

      {success && (
        <SuccessPopup
          onClose={() => {
            setSuccess(false);
            navigation.navigate("Start");
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
    fontSize: 28,
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
    borderRadius: 88,
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
    padding: 8,
    height: 40,
    textAlign: "center",
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
    // width: "40%",
    alignSelf: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
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
    position: "fixed",
    bottom: 0,
    width: "100%",
    height: 200,
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
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 6,
    elevation: 3, // for Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: "absolute",
    top: 65,
    width: "100%",
    zIndex: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default SignUpScreen;
