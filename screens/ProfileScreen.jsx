import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
  Dimensions, 
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { UserDetails } from "../controller/UserController"; 
import { ErrorPopup } from "../componentes/Popups";
import { FormatDOB } from "../controller/ReusableFunction";  
import ProfileImageUpdater from "../componentes/Profile/ProfileImageUpdater";
import ProfileDetailsList from "../componentes/Profile/ProfileDetailsList";
import UpdateProfileDetails from "../componentes/Profile/UpdateProfileDetails";

const { width, height } = Dimensions.get("window");

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [profileImagePopup, setProfileImagePopup] = useState(false);

  const profileDetails = [
    { label: "Education", value: "education" },
    { label: "Profession", value: "profession" },
    { label: "Eating Preference", value: "eating" },
    { label: "Drinking Preference", value: "drinking" },
    { label: "Dating Type", value: "datingType" },
    { label: "Hobbies", value: "hobbies" },
  ];

  const fetchUser = async () => {
    try {
      const response = await UserDetails();
      setUser(response);
    } catch (error) {
      console.error(error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const userProfile = {
    dob: "1992-07-16",
    gender: "Female",
    city: "Jaipur",
    phone: "+1 555-123-4567",
    email: "userkhicher@example.com",
    education: "Master's in Psychology",
    profession: "Therapist",
    eatingPreference: "Vegetarian",
    drinking: false,
    hobbies: ["Reading", "Painting", "Hiking"],
    relationshipGoal: "Long-term relationship",
    lifestyle: "Active",
  };

  if (loading) {
    return (
      <ImageBackground
        source={require("../assets/photos/app-bg-1.jpg")}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size={70} color="#ff6f61" />
      </ImageBackground>
    );
  }

  if (hasError) {
    return (
      <ErrorPopup
        error="Internal Server Error"
        onClose={() => navigation.navigate("Start")}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require("../assets/photos/app-bg-7.jpg")}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <View style={styles.swiperContainer}>
            <Image
              source={{
                uri: "https://img.freepik.com/free-photo/young-beautiful-girl-posing-black-leather-jacket-park_1153-8104.jpg?semt=ais_hybrid&w=740",
              }}
              style={styles.profileImage}
            />
            <Pressable
              onPress={() => setProfileImagePopup(true)}
              style={styles.profileImageEditIcon}
            >
              <MaterialIcons name="edit" size={22} color="#fff" />
            </Pressable>
          </View>

          {/* User Info */}
          <View style={styles.infoContainer}>
            <LinearGradient
              colors={["#fff", "#f5f5f5"]}
              style={styles.nameContainer}
            >
              <Text style={styles.topName}>{user?.username || "User"}</Text>
              <Text style={styles.location}>
                <Ionicons name="location-sharp" size={18} color="#ff6f61" />{" "}
                {userProfile.city}
              </Text>
            </LinearGradient>

            <Text style={styles.bio}>
              "I like exploring new places and having real conversations. I
              enjoy road trips, movies, and joking around. Looking for someone
              kind and fun to share life with."
            </Text>
          </View>

          {/* Personal Info */}
          <ProfileDetailsList profile={userProfile} />
        </ScrollView>

        {/* Update Profile Button */}
        <TouchableOpacity
          style={styles.updateProfileButton}
          onPress={() => setIsPopupVisible(true)}
        >
          <LinearGradient
            colors={["#ff6f61", "#ff8a65"]}
            style={styles.buttonGradient}
          >
            <MaterialCommunityIcons
              name="account-edit"
              size={32}
              color="#fff"
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Popups */}
        <UpdateProfileDetails
          visible={isPopupVisible}
          onClose={() => setIsPopupVisible(false)}
        />
        <ProfileImageUpdater
          isModalVisible={profileImagePopup}
          closeModal={() => setProfileImagePopup(false)}
          existingPhotos={user?.images}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  swiperContainer: {
    height: 200,
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 600,
  },
  swiperImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  profileImageEditIcon: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 50,
    padding: 8  ,
    elevation: 3,
  },
  infoContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  nameContainer: {
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  topName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    fontFamily: "System",
  },
  location: {
    fontSize: 16,
    color: "#555",
    flexDirection: "row",
    alignItems: "center",
  },
  bio: {
    fontSize: 16,
    color: "#ff732d",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 15,
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  updateProfileButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonGradient: {
    padding: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
