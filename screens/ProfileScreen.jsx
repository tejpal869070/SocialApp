import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { changeUserDetails, UserDetails } from "../controller/UserController";
import { ErrorPopup } from "../componentes/Popups";
import ProfileImageUpdater from "../componentes/Profile/ProfileImageUpdater";
import ProfileDetailsList from "../componentes/Profile/ProfileDetailsList";
import maleImage from "../assets/photos/male.png";
import femaleImage from "../assets/photos/female.png";
import ProfilePopup from "../componentes/Profile/ProfilePopup";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [profileImagePopup, setProfileImagePopup] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfileUpdater, setShowProfileUpdater] = useState(false);
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [isTravellerMode, setIsTravellerMode] = useState(false);

  // Update user settings
  const updateUserSetting = async (field, value) => {
    setLoading(true);
    try {
      const formData = {
        [field]: value,
      };
      await changeUserDetails(formData);
      await fetchUser();
    } catch (error) {
      Alert.alert("Error", `Failed to update ${field}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await UserDetails();
      setUser(response);
      setIsTravellerMode(response?.travelers_mode === true ? true : false);
      setIsPrivateProfile(response?.profile_type === "real" ? false : true);

      // Check if profile images exist
      if (!response?.images || response.images.length === 0) {
        setShowProfileUpdater(true);
      } else {
        setShowProfileUpdater(false);
      }
    } catch (error) {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Safely construct userProfile with null checks
  const userProfile = {
    phone: user?.mobile || "",
    email: user?.email || "",
    dob: user?.dob ? user.dob.split("T")[0] : "",
    gender: user?.gender || "",
    city: user?.city || "",
    education: user?.education || "",
    profession: user?.profession || "",
    eating_preference: user?.eating_preference || "",
    drinking: user?.drinking || "",
    hobbies: user?.hobbies || "",
    dating_type: user?.dating_type || "",
    bio: user?.bio || "",
    name: user?.username || "User",
    // interested_profile: user?.interested_profile || "",
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
      >
        <ImageBackground source={require("../assets/photos/app-bg-6-1.jpg")}>
          {/* Profile Header */}
          <View style={styles.swiperContainer}>
            <Image
              source={
                user?.images?.[0]
                  ? { uri: user.images[0] }
                  : user?.gender === "M"
                  ? maleImage
                  : femaleImage
              }
              style={styles.profileImage}
            />
          </View>

          {/* User Info */}
          <View style={styles.infoContainer}>
            <LinearGradient
              colors={["#fff", "#f5f5f5"]}
              style={styles.nameContainer}
            >
              <Text style={styles.topName}>{user?.username || "User"}</Text>
              <Text style={styles.location}>
                <Ionicons name="location-sharp" size={20} color="#ff6f61" />
                {userProfile.city || "Unknown Location"}
              </Text>
            </LinearGradient>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                onPress={() => setProfileImagePopup(true)}
                style={styles.infoButton}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Edit Photos
                </Text>
                <Ionicons
                  name="image"
                  size={28}
                  color="#ffffffff"
                  style={{ width: 28, height: 28, marginLeft: 10 }}
                />
              </Pressable>
              <Pressable
                style={styles.infoButton}
                onPress={() => setProfileOpen(true)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Preview
                </Text>
                <Ionicons
                  name="eye-sharp"
                  size={28}
                  color="#ffffffff"
                  style={{ width: 28, height: 28, marginLeft: 10 }}
                />
              </Pressable>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable style={styles.infoButton}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Private
                </Text>
                <Switch
                  value={isPrivateProfile}
                  onValueChange={(value) => {
                    setIsPrivateProfile(value); // Fixed: Correct state update
                    updateUserSetting(
                      "profile_type",
                      value === true ? "fake" : "real"
                    );
                  }}
                  disabled={loading}
                  trackColor={{ false: "#000000", true: "#53ffe8ff" }}
                  thumbColor={isPrivateProfile ? "#ffffff" : "#eeeeeeff"}
                />
              </Pressable>
              <Pressable style={styles.infoButton}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Traveller
                </Text>
                <Switch
                  value={isTravellerMode}
                  onValueChange={(value) => {
                    setIsTravellerMode(value);
                    updateUserSetting(
                      "travelers_mode",
                      value === true ? "Y" : "N"
                    );
                  }}
                  disabled={loading}
                  trackColor={{ false: "#000000", true: "#53ffe8ff" }}
                  thumbColor={isTravellerMode ? "#ffffff" : "#eeeeeeff"}
                />
              </Pressable>
            </View>
          </View>
        </ImageBackground>
        {/* Personal Info */}
        <ProfileDetailsList
          profile={userProfile}
          refreshData={() => fetchUser()}
        />
      </ScrollView>

      <ProfileImageUpdater
        isModalVisible={profileImagePopup || showProfileUpdater}
        closeModal={async () => {
          setProfileImagePopup(false);
          await fetchUser();
        }}
        existingPhotos={user?.images || []}
      />

      <ProfilePopup
        user_id={user?.user_id || ""}
        onClose={() => setProfileOpen(false)}
        isVisible={profileOpen}
      />
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
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
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
    padding: 8,
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
  infoButton: {
    borderRadius: 50,
    padding: 8,
    backgroundColor: "#b189fe",
    width: "48%",
    marginTop: 20,
    paddingVertical: 10,
    paddingLeft: 20,
    flexDirection: "row",
    maxHeight: 42,
    minHeight: 40,
    justifyContent: "space-around",
  },
  location: {
    fontSize: 16,
    color: "#555",
    flexDirection: "row",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bio: {
    fontSize: 16,
    color: "black",
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
