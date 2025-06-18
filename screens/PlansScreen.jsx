import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
} from "react-native";

const PlansScreen = ({ navigation }) => {
  const plans = [
    { duration: "12 Months", pricePerMonth: "₹305/mo", total: "₹3660" },
    { duration: "6 Months", pricePerMonth: "₹375/mo", total: "₹2250" },
    { duration: "1 Month", pricePerMonth: "₹499", total: "₹499" },
  ];

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Unlock All function</Text>
         
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <View key={index} style={styles.planCard}>
              <Text style={styles.planDuration}>{plan.duration}</Text>
              <Text style={styles.planPricePerMonth}>{plan.pricePerMonth}</Text>
              <Text style={styles.planTotal}>{plan.total}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate("Start")}
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
    marginTop : 40
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  timerText: {
    color: "#fff",
    backgroundColor: "#ff9800",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff0000",
    marginBottom: 10,
  },
  crownIcon: {
    width: 40,
    height: 40,
  },
  plansContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  planCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    width: "30%",
  },
  planDuration: {
    fontSize: 16,
    color: "#333",
  },
  planPricePerMonth: {
    fontSize: 14,
    color: "#666",
  },
  planTotal: {
    fontSize: 18,
    fontWeight: "bold",
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
  searchContainer: { marginTop: 10 },
  searchInput: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
  },
});

export default PlansScreen;
