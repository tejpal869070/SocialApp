import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview"; // Import WebView from react-native-webview
import { getAllPlans } from "../controller/UserController";

const PlansScreen = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showWebView, setShowWebView] = useState(false);

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getAllPlans();
        setPlans(response);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setPlans([
          { plan_name: "12 Months", price: "305/mo", duration: "3660" },
          { plan_name: "6 Months", price: "375/mo", duration: "2250" },
          { plan_name: "1 Month", price: "499", duration: "499" },
        ]);
      }
    };

    fetchPlans();
  }, []);

  const benefits = [
    {
      icon: "❤️",
      text: "Checkout who likes you",
      detail: "Discover who likes you!",
    },
    {
      icon: "📩",
      text: "Contact with personalized messages",
      detail: "Reach out to 50 new users daily with messages",
    },
    {
      icon: "👀",
      text: "Find who viewed your profile",
      detail: "Unravel your profile visitors",
    },
    {
      icon: "👍",
      text: "Infinite Likes",
      detail: "Send as many likes in a day. No limits.",
    },
    {
      icon: "💬",
      text: "Chat with new and online users",
      detail: "Chat and message 50 new users everyday",
    },
  ];

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  // Handle payment
  const handleContinue = () => {
    if (!selectedPlan) {
      Alert.alert("Error", "Please select a plan before continuing.");
      return;
    }
    setShowWebView(true); // Show WebView modal for payment
  };

  // Handle WebView navigation state changes
  const handleWebViewNavigationStateChange = (navState) => {
    const { url } = navState;
    // Check for payment success/failure based on URL (customize based on your payment gateway)
    if (url.includes("success")) {
      Alert.alert("Success", "Payment completed successfully!");
      setShowWebView(false);
      // Optionally navigate to another screen
      // navigation.navigate("Start");
    } else if (url.includes("failure") || url.includes("cancel")) {
      Alert.alert("Cancelled", "Payment was cancelled or failed.");
      setShowWebView(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Unlock All Features</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.planCard,
                selectedPlan === plan ? styles.selectedPlanCard : null,
              ]}
              onPress={() => handlePlanSelect(plan)}
            >
              <Text style={styles.planDuration}>{plan.plan_name}</Text>
              <Text style={styles.planPricePerMonth}>₹{plan.price}</Text>
              <Text style={styles.planTotal}>{plan.duration} Days</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>

        <Text style={styles.benefitsTitle}>9 BENEFITS IN ONE PACK!</Text>

        <View style={styles.benefitsContainer}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitCard}>
              <Text style={styles.benefitIcon}>{benefit.icon}</Text>
              <View style={styles.benefitTextContainer}>
                <Text style={styles.benefitText}>{benefit.text}</Text>
                <Text style={styles.benefitDetail}>{benefit.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showWebView}
        animationType="slide"
        onRequestClose={() => setShowWebView(false)}
      >
        <SafeAreaView style={styles.webViewContainer}>
          <View style={styles.webViewHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowWebView(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          {/* <WebView
            source={{ uri: "https://u.payu.in/Irm1keSgfyoW" }}
            style={styles.webView}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error("WebView error: ", nativeEvent);
              Alert.alert("Error", "Failed to load payment page.");
              setShowWebView(false);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error("WebView HTTP error: ", nativeEvent);
              Alert.alert(
                "Error",
                "Failed to load payment page due to HTTP error."
              );
              setShowWebView(false);
            }}
          /> */}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    alignItems: "center",
    paddingBottom: 20,
    marginTop: 40,
  },
  header: {
    backgroundColor: "#FF5555",
    padding: 20,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  plansContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "90%",
    gap: 6,
  },
  planCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    width: Dimensions.get("window").width * 0.3 - 12,
  },
  selectedPlanCard: {
    backgroundColor: "#e0f7fa", // Light cyan background for selected plan
    borderColor: "#FF5555", // Distinct border color
    borderWidth: 2,
    shadowColor: "#000", // Add shadow for emphasis
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  planDuration: {
    fontSize: 16,
    color: "#333",
  },
  planPricePerMonth: {
    fontSize: 18,
    color: "#666",
    fontWeight: "600",
    marginVertical: 5,
  },
  planTotal: {
    fontSize: 15,
    color: "#333",
  },
  continueButton: {
    backgroundColor: "#ff9800",
    paddingVertical: 15,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    marginVertical: 20,
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 20,
  },
  benefitsContainer: {
    width: "90%",
  },
  benefitCard: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitText: {
    fontSize: 16,
    color: "#333",
  },
  benefitDetail: {
    fontSize: 12,
    color: "#666",
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webViewHeader: {
    padding: 10,
    backgroundColor: "#FF5555",
    alignItems: "flex-end",
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  webView: {
    flex: 1,
  },
});

export default PlansScreen;
