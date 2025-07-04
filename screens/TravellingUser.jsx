import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { initialUsers } from "../assets/Data/TravelUser";
import AddTravelDetail from "../componentes/AddTravelDetail";

const cities = ["All Cities", "Jaipur", "Delhi", "Mumbai", "Bangalore"];

const UserCard = ({ user, isBetweenCities }) => {
  const [showDetail, setShowDetail] = useState(false);

  const toggleDetail = () => {
    setShowDetail((prev) => !prev);
  };

  return (
    <View style={styles.card}>
      <View style={styles.userCard}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: user.image }} style={styles.profileImage} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            {isBetweenCities ? (
              <View style={styles.routeContainer}>
                <Text style={styles.userDetail}>{user.from}</Text>
                <Ionicons
                  name="airplane"
                  size={16}
                  color="#bbb"
                  style={styles.icon}
                />
                <Text style={styles.userDetail}>{user.to}</Text>
              </View>
            ) : (
              <View style={styles.routeContainer}>
                <MaterialIcons name="location-city" size={16} color="gray" />
                <Text style={styles.userDetail}>{user.city}</Text>
              </View>
            )}
            <Text style={styles.userDetail}>Date: {user.date}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.requestButton}>
          <Text style={styles.requestButtonText}>Request</Text>
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity style={styles.detailButton} onPress={toggleDetail}>
        <Text style={styles.detailButtonText}>
          {showDetail ? "Hide Details" : "Show Details"}
        </Text>
      </TouchableOpacity> */}

      {showDetail && (
        <View style={styles.detailContainer}>
          <Text style={styles.userDetail}>{user.detail}</Text>
        </View>
      )}
    </View>
  );
};

export default function TravellingUser() {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [activeTab, setActiveTab] = useState("Cities");

  const filteredUsers = initialUsers.filter((user) =>
    selectedCity === "All Cities"
      ? true
      : user.type === "Between Cities"
      ? user.from === selectedCity || user.to === selectedCity
      : user.city === selectedCity
  );

  const users = filteredUsers.filter((user) =>
    activeTab === "Cities"
      ? user.type === "Between Cities"
      : user.type === "Guider/Turister"
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Find Your Travel Buddy</Text>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search City..."
            placeholderTextColor="#aaa"
            style={styles.searchInput}
          />
        </View>
      </View>
      <View style={styles.tabContainer}>
        {["Cities", "Guider"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab === "Cities" ? "Between Cities" : "Guider/Turister"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard user={item} isBetweenCities={activeTab === "Cities"} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No users found</Text>
        }
      />

      <AddTravelDetail />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },

  header: {
    backgroundColor: "#FF5555",
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  searchContainer: {
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "gray",
    elevation: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "black",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: { borderBottomColor: "white" },
  tabText: { fontSize: 16, color: "#666", fontWeight: "600" },
  activeTabText: { color: "white" },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",

    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    display: "flex",
    flexDirection: "col",
    backgroundColor: "#FFF",
    elevation: 4,
    borderRadius: 10,
    margin: 6,
    padding: 15,
  },
  detailButton: {
    backgroundColor: "#f3f3f3",
    borderRadius: 5,
    marginTop: 6,
    padding: 4,
  },
  profileContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  profileImage: { width: 60, height: 60, borderRadius: 6, marginRight: 10 },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userDetail: { fontSize: 13, color: "#666", marginBottom: 2 },
  routeContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  icon: { marginHorizontal: 8 },
  requestButton: {
    backgroundColor: "#FF3E55",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  requestButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});
