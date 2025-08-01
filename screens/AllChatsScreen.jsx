import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  getAllMessageRequest,
  updateMessageRequests,
} from "../controller/UserController";
import { CalculateAge } from "../controller/ReusableFunction";
import ProfilePopup from "../componentes/Profile/ProfilePopup";
import { Loading, SuccessPopup3 } from "../componentes/Popups";
import { getSocket } from "../controller/Socket";

// Default user data for missing details
const defaultUser = {
  name: "Unknown User",
  profilePic: "https://example.com/default.jpg",
  lastMessage: "No message available",
  timestamp: "N/A",
  age: "Unknown",
  location: "Unknown",
};

const AllChatsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Inbox");
  const [inboxChats, setInboxChats] = useState([]);
  const [requestsChats, setRequestsChats] = useState([]);
  const [inboxPage, setInboxPage] = useState(1);
  const [requestsPage, setRequestsPage] = useState(1);
  const [inboxTotalPages, setInboxTotalPages] = useState(1);
  const [requestsTotalPages, setRequestsTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [profileOpen, setOpenProfile] = useState(false);

  const [user_id, setUser_id] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Callback to handle missing user details
  const fillMissingUserDetails = useCallback((user) => {
    return {
      ...defaultUser,
      ...user,
      id: user.id || `unknown-${Math.random().toString(36).substr(2, 9)}`,
    };
  }, []);

  const fetchInboxChats = useCallback(
    async (page = 1, isRefresh = false) => {
      const socket = getSocket();

      if (!socket?.connected) {
        console.warn("⚠️ Socket not connected");
        return;
      }

      try {
        setLoading(true);

        socket.emit("getChatList", { page }, (response) => {
          if (!Array.isArray(response.data)) {
            console.error("❌ Unexpected response:", response);
            return;
          }

          const filledData = response.data?.map(fillMissingUserDetails);

          setInboxChats((prev) =>
            isRefresh ? filledData : [...prev, ...filledData]
          );

          // Optional: if you implement manual pagination
          setInboxPage(page);
        });
      } catch (error) {
        console.error("Error fetching inbox chats via socket:", error);
      } finally {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    },
    [fillMissingUserDetails]
  );

  // Fetch message requests
  const fetchMessageRequests = useCallback(
    async (page, isRefresh = false) => {
      try {
        setLoading(true);
        const response = await getAllMessageRequest(page);
        console.log(response);
        const filledData = response?.map(fillMissingUserDetails);
        setRequestsChats((prev) =>
          isRefresh ? filledData : [...prev, ...filledData]
        );
        setRequestsTotalPages(response.totalPages);
        setRequestsPage(response.currentPage);
      } catch (error) {
        console.error("Error fetching message requests:", error);
      } finally {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    },
    [fillMissingUserDetails]
  );

  // Initial fetch and tab switch handling
  useEffect(() => {
    if (activeTab === "Inbox") {
      fetchInboxChats(1, true);
    } else {
      fetchMessageRequests(1, true);
    }
  }, [activeTab, fetchInboxChats, fetchMessageRequests]);

  // Load more data when reaching the end of the list
  const loadMore = () => {
    if (loading) return;
    if (activeTab === "Inbox" && inboxPage < inboxTotalPages) {
      fetchInboxChats(inboxPage + 1);
    } else if (activeTab === "Requests" && requestsPage < requestsTotalPages) {
      fetchMessageRequests(requestsPage + 1);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    if (activeTab === "Inbox") {
      setInboxPage(1);
      fetchInboxChats(1, true);
    } else {
      setRequestsPage(1);
      fetchMessageRequests(1, true);
    }
  };

  const renderChatItem = ({ item }) => {
    return (
      <View
        style={styles.chatItem}
        // onPress={() => navigation.navigate("Messages", { chatId: item.id })}
      >
        <Pressable
          onPress={() => {
            setOpenProfile(true);
            setUser_id(item.other_user_id);
          }}
        >
          <Image
            source={{ uri: item.images }}
            style={styles.profilePic}
            defaultSource={{ uri: defaultUser?.profilePic }}
          />
        </Pressable>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("Messages", { user: item })}
        >
          <View style={[styles.chatInfo]}>
            <Text style={styles.name}>{item.username}</Text>
            {activeTab === "Inbox" ? (
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.last_message} {"    "}
              </Text>
            ) : (
              <View style={styles.requestInfo}>
                <Text style={styles.ageLocation}>
                  Age {item.dob ? CalculateAge(item.dob) : "N/A"}, 📍{item.city}
                </Text>
              </View>
            )}
          </View>
        </Pressable>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {activeTab === "Inbox" ? (
            <>
              <Text style={styles.timestamp}>
                {item?.last_message_time?.split("T")[0]} {"   "}
                {item?.last_message_time?.split("T")[1]?.slice(0, 5)}
              </Text>
              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="flash-outline" size={24} color="#e9e9e9ff" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.requestButtons}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleRequest(item.id, "accepted")}
              >
                <Text style={styles.addButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleRequest(item.id, "rejected")}
              >
                <Text style={styles.rejectButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Handlers for request actions
  const handleRequest = async (id, status) => {
    setProcessing(true);
    try {
      await updateMessageRequests(id, status);
      setSuccess(true);
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat</Text>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#aaa"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Inbox" && styles.activeTab]}
          onPress={() => setActiveTab("Inbox")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Inbox" && styles.activeTabText,
            ]}
          >
            Inbox
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Requests" && styles.activeTab]}
          onPress={() => setActiveTab("Requests")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Requests" && styles.activeTabText,
            ]}
          >
            Requests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <FlatList
        data={activeTab === "Inbox" ? inboxChats : requestsChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator size="large" color="#6200EE" />
          ) : null
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <ProfilePopup
        isVisible={profileOpen}
        onClose={() => {
          setOpenProfile(false);
          setUser_id(null);
        }}
        user_id={user_id}
      />

      {success && (
        <SuccessPopup3
          onClose={() => {
            setSuccess(false);
            onRefresh();
          }}
        />
      )}

      {processing && <Loading />}

      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  activeTab: {
    borderBottomColor: "white",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  activeTabText: {
    color: "white",
  },
  listContainer: {
    paddingBottom: 40,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
  requestInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ageLocation: {
    fontSize: 14,
    color: "#666",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  callButton: {
    padding: 5,
    backgroundColor : "red",
    borderRadius: 100
  },
  requestButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    marginRight: 10,
    backgroundColor: "#34C759",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontWeight: 700,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 13,
  },
  rejectButton: {
    backgroundColor: "#FF5555",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontWeight: 700,
  },
  rejectButtonText: {
    color: "#fff",
    fontSize: 13,
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

export default AllChatsScreen;
