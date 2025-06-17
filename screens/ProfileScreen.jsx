import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
import verifiedImage from "../assets/photos/verified.webp";
import ProfileImagesGrid from "../componentes/ProfileImagesGrid";
import { myPostImages } from "../assets/Data/myPostImages";
import bg2 from "../assets/photos/app-bg-6.jpg";
import { StatusBar } from "expo-status-bar";

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("My account");

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Section */}
      <ImageBackground source={bg2} style={styles.profileSection}>
        <View style={styles.qrContainer}>
          <View
            style={{
              width: "30%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{
                uri: "https://image.winudf.com/v2/image1/bmV0LndsbHBwci5ib3lzX3dhbGxwYXBlcl9zY3JlZW5fMF8xNjU2MzQ2NzU4XzAyMQ/screen-0.jpg?fakeurl=1&type=.jpg",
              }} // Placeholder for QR code
              style={styles.qrCode}
            />
          </View>
          <View style={{ width: "65%" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text style={styles.name}>Tarun Soni </Text>
              <Image
                source={verifiedImage}
                alt="iconss"
                style={{ width: 18, height: 18 }}
              />
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailText}>52</Text>
                <Text style={styles.detailTextTitle}>Posts</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailText}>4M</Text>
                <Text style={styles.detailTextTitle}>Followers</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailText}>1.2K</Text>
                <Text style={styles.detailTextTitle}>Following</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab]}
            onPress={() => setActiveTab("My account")}
          >
            <Text style={[styles.tabText]}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab]}
            onPress={() => setActiveTab("Public profile")}
          >
            <Text style={[styles.tabText]}>Share Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab]}
            onPress={() => setActiveTab("Public profile")}
          >
            <Text style={[styles.tabText]}>Post +</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      {/* User Details */}

      {/* images grid / posts */}
      <ScrollView  >
        <ProfileImagesGrid images={myPostImages} />
      </ScrollView>

      {/* Snapchat+ Section */}
      {/* <TouchableOpacity style={styles.section}>
        <View style={styles.sectionIcon}>
          <Ionicons name="star" size={24} color="#FFD700" />
        </View>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Snapchat+</Text>
          <Text style={styles.sectionSubtitle}>
            Snap modes, Instant Streaks and more!
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity> */}

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor : "black"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 40,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF5555",
  },
  profileSection: {
    // alignItems: "center",
    // marginBottom: 20,
  },
  backgroundImage: {
    width: "100%",
    height: 220,
    position: "absolute",
    top: 0,
  },
  qrContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 60,
    marginHorizontal: 10,
  },
  qrCode: {
    width: 90,
    height: 90,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FFD700",
    marginHorizontal: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 500,
    color: "white",
  },
  username: {
    fontSize: 14,
    color: "#2F3A3B",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 5,
    marginBottom: 16,
    marginTop: 16,
    justifyContent: "space-between",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#666",
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#FF5555",
  },
  tabText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#000",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderRadius: 8,
  },
  detailItem: {
    display: "flex",
    flexDirection: "col",
    width: "28%",
  },
  detailText: {
    fontSize: 28,
    color: "#1F2A44",
    fontWeight: 600,
  },
  detailTextTitle: {
    fontSize: 12,
  },

  joinSchoolText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2F3A3B",
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
  },
  sectionIcon: {
    marginRight: 15,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  newStoryText: {
    fontSize: 14,
    color: "#1E90FF",
  },
  storyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  storyIcon: {
    marginRight: 15,
  },
  storyProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  storyDots: {
    fontSize: 24,
    color: "#fff",
  },
});

export default ProfileScreen;
