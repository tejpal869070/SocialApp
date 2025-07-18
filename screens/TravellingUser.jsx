import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AddTravelDetail from "../componentes/AddTravelDetail";
import {
  getAllBetweenCitiesTrips,
  getAllWithinCitiesTrips,
} from "../controller/UserController";
import { ImageBackground } from "react-native";
import ProfilePopup from "../componentes/Profile/ProfilePopup";

const UserCard = ({ user, isBetweenCities }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleDetail = () => {
    setShowDetail((prev) => !prev);
  };

  const safeUser = {
    image: user?.images || "https://via.placeholder.com/50",
    name: user?.username || "Unknown User",
    from: user?.from_city || "N/A",
    to: user?.to_city || "N/A",
    date: user?.journey_date?.split("T")[0] || "N/A",
    detail: user?.description || "No details available",
  };

  return (
    <View style={styles.card}>
      <View style={styles.userCard}>
        <View style={styles.profileContainer}>
          <Pressable
            onPress={() => {
              setProfileOpen(true);
              console.log("sdiuch");
            }}
          >
            <Image
              source={{ uri: safeUser.image }}
              style={styles.profileImage}
            />
          </Pressable>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{safeUser.name}</Text>
            {isBetweenCities ? (
              <View style={styles.routeContainer}>
                <Text style={styles.userDetail}>{safeUser.from}</Text>
                <Ionicons
                  name="airplane"
                  size={16}
                  color="#bbb"
                  style={styles.icon}
                />
                <Text style={styles.userDetail}>{safeUser.to}</Text>
              </View>
            ) : (
              <View style={styles.routeContainer}>
                <MaterialIcons name="location-city" size={16} color="gray" />
                <Text style={styles.userDetail}>{safeUser.from}</Text>
              </View>
            )}
            <Text style={styles.userDetail}>Date: {safeUser.date}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.requestButton}>
          <Text style={styles.requestButtonText}>Request</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.detailButton} onPress={toggleDetail}>
        <Text style={styles.detailButtonText}>
          {showDetail ? "Hide Details" : "Show Details"}
        </Text>
      </TouchableOpacity>

      {showDetail && (
        <View style={styles.detailContainer}>
          <Text style={styles.userDetail}>{safeUser.detail}</Text>
        </View>
      )}

      <ProfilePopup
        user_id={user?.user_id}
        onClose={() => setProfileOpen(false)}
        isVisible={profileOpen}
      />
    </View>
  );
};

export default function TravellingUser() {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [activeTab, setActiveTab] = useState("Cities");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState({ Cities: 1, Guider: 1 });
  const [hasMore, setHasMore] = useState({ Cities: true, Guider: true });
  const [loadedData, setLoadedData] = useState({ Cities: [], Guider: [] });
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

  const fetchData = async (tab, page) => {
    setLoading(true);
    setError(null);
    let newUsers = [];
    try {
      if (tab === "Cities") {
        newUsers = await getAllBetweenCitiesTrips(page);
      } else if (tab === "Guider") {
        newUsers = await getAllWithinCitiesTrips(page);
      }

      newUsers = Array.isArray(newUsers) ? newUsers : [];
      setLoading(false);
      return newUsers;
    } catch (error) {
      setError("Failed to load data. Please try again.");
      setLoading(false);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (hasMore[activeTab]) {
        const newUsers = await fetchData(activeTab, page[activeTab]);
        const existingUsers = loadedData[activeTab].map((user) => user.id);
        const filteredNewUsers = newUsers.filter(
          (user) => !existingUsers.includes(user.id)
        );

        if (filteredNewUsers.length > 0) {
          setLoadedData((prevData) => ({
            ...prevData,
            [activeTab]: [...prevData[activeTab], ...filteredNewUsers],
          }));
          // setUsers((prevUsers) => [...prevUsers, ...filteredNewUsers]);
        }

        setHasMore((prev) => ({
          ...prev,
          [activeTab]: filteredNewUsers.length > 0,
        }));
      }
    };

    loadData();
  }, [activeTab, page]);

  useEffect(() => {
    setUsers(loadedData[activeTab] || []);
    setSelectedCity("All Cities");
  }, [activeTab, loadedData]);

  const handleEndReached = () => {
    if (loading || !hasMore[activeTab]) return;
    setPage((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab] + 1,
    }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    const freshUsers = await fetchData(activeTab, 1);

    setLoadedData((prevData) => ({
      ...prevData,
      [activeTab]: freshUsers,
    }));

    setUsers(freshUsers);
    setPage((prev) => ({
      ...prev,
      [activeTab]: 1,
    }));

    setHasMore((prev) => ({
      ...prev,
      [activeTab]: freshUsers.length > 0,
    }));

    setRefreshing(false);
  };

  useEffect(() => {
    const filterUsers = (usersList) => {
      return usersList.filter((user) =>
        selectedCity === "All Cities"
          ? true
          : activeTab === "Cities"
          ? user.from === selectedCity || user.to === selectedCity
          : user.city === selectedCity
      );
    };
    setUsers(filterUsers(loadedData[activeTab] || []));
  }, [selectedCity, activeTab, loadedData]);

  return (
    <ImageBackground
      source={require("../assets/photos/app-bg-7.jpg")}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Find Your Travel Buddy</Text>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search City..."
            placeholderTextColor="#aaa"
            style={styles.searchInput}
            onChangeText={(text) => setSelectedCity(text || "All Cities")}
            value={selectedCity === "All Cities" ? "" : selectedCity}
          />
        </View>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.tabContainer}>
        {["Cities", "Guider"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => {
              setActiveTab(tab);
            }}
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
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <UserCard user={item} isBetweenCities={activeTab === "Cities"} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No users found</Text>
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#000" /> : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      <AddTravelDetail onDetailAdded={handleRefresh} />
      {/* Refresh on adding detail */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff" },

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
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    display: "flex",
    flexDirection: "col",
    backgroundColor: "#FFF",
    borderRadius: 10,
    margin: 6,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    // backgroundColor: "#f5f6ffff",
  },
  detailButton: {
    backgroundColor: "#f3f3f3",
    borderRadius: 5,
    marginTop: 6,
    padding: 4,
  },
  detailButtonText: {
    textAlign: "right",
    marginRight: 10,
    fontStyle: "italic",
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
  detailContainer: {
    padding: 4,
    color: "#333",
  },
});
