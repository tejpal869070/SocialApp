import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = () => {
  const user = {
    name: "Ahmad Nawaz Ali",
    username: "@ahmad_nawaz_ali",
    followers: "210",
    following: "960K",
    birthdate: "21 Sep 2001",
    gender: "Male",
    company: "Product Designer",
    phone: "+92 302 314 5245",
    email: "info@qampt.com",
    website: "www.qampt.com",
    languages: ["English"],
    places: ["Lahore"],
    interests: ["Traveling", "Adventure", "Friendships"],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#edf1f7", "#dbeafe"]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <ImageBackground source={require("../assets/photos/app-bg-6.jpg")} style={styles.header}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>{user.username}</Text>
          </ImageBackground>

          {/* Personal Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color="#888" />
              <Text style={styles.infoText}>
                Date of Birth: {user.birthdate}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={20} color="#888" />
              <Text style={styles.infoText}>Gender: {user.gender}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color="#888" />
              <Text style={styles.infoText}>Phone: {user.phone}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#888" />
              <Text style={styles.infoText}>Email: {user.email}</Text>
            </View>
          </View>

          {/* Languages */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {user.languages.map((lang, index) => (
              <Text key={index} style={styles.infoText}>
                {lang}
              </Text>
            ))}
          </View>

          {/* Places */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Places</Text>
            {user.places.map((place, index) => (
              <Text key={index} style={styles.infoText}>
                {place}
              </Text>
            ))}
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            {user.interests.map((interest, index) => (
              <Text key={index} style={styles.infoText}>
                {interest}
              </Text>
            ))}
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <TouchableOpacity style={styles.settingsItem}>
              <Ionicons name="shield-outline" size={20} color="#666" />
              <Text style={styles.infoText}>Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsItem}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#666"
              />
              <Text style={styles.infoText}>Information</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsItem}>
              <Ionicons name="log-out-outline" size={20} color="#666" />
              <Text style={styles.infoText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#edf1f7",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "white",
    marginBottom: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#00bcd4",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  username: {
    fontSize: 14,
    color: "#777",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "60%",
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  statLabel: {
    fontSize: 12,
    color: "#777",
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#444",
    marginLeft: 10,
    marginBottom: 5,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});

export default ProfileScreen;
