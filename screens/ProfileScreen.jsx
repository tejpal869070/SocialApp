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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { UserDetails } from "../controller/UserController";
import { ErrorPopup } from "../componentes/Popups";
import { FormatDOB } from "../controller/ReusableFunction";
import UpdateProfileDetails from "../componentes/UpdateProfileDetails";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

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

  if (loading) {
    return (
      <ImageBackground
        source={require("../assets/photos/app-bg-1.jpg")}
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={60} color="#0000ff" />
      </ImageBackground>
    );
  }

  const dob = "2004-05-02T18:30:00.000Z";
  console.log(FormatDOB(dob));

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
      <LinearGradient colors={["#edf1f7", "#dbeafe"]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <ImageBackground
            source={require("../assets/photos/app-bg-6.jpg")}
            style={styles.header}
          >
            <Image
              source={{ uri: "https://randomuser?.me/api/portraits/men/1.jpg" }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{user?.username}</Text>
            <Text style={styles.username}>{user?.username}</Text>
          </ImageBackground>

          {/* Personal Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color="#888" />
              <Text style={styles.infoText}>
                Date of Birth: {FormatDOB(user?.dob)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={20} color="#888" />
              <Text style={styles.infoText}>
                Gender: {user?.gender === "M" ? "Male" : "Female"}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color="#888" />
              <Text style={styles.infoText}>Phone: {user?.mobile}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#888" />
              <Text style={styles.infoText}>Email: {user?.email}</Text>
            </View>
          </View>

          {/* Languages */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {user?.language?.map((lang, index) => (
              <Text key={index} style={styles.infoText}>
                {lang}
              </Text>
            ))}
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            {user?.hobbies?.map((interest, index) => (
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

      {/* update profle details */}

      <TouchableOpacity
        style={styles.UpdateProfileButton1}
        onPress={() => setIsPopupVisible(true)}
      >
        <MaterialCommunityIcons name="account-edit" size={40} color="black" />
      </TouchableOpacity>
      <UpdateProfileDetails
        visible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
      />
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
  UpdateProfileButton1: {
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 60,
    elevation: 4,
    borderWidth: 1,
    borderColor: "blue",
  },
});

export default ProfileScreen;
