import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For the call icon
import { chats } from "../assets/Data/Chats"; // Assuming 'chats' has age and location data
import { StatusBar } from "expo-status-bar";

const AllChatsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Inbox");

  // Split chats into Inbox and Requests (assuming chats have a 'type' property)
  const inboxChats = chats.filter(
    (chat) => chat.type === "inbox" || !chat.type
  );
  const requestsChats = chats.filter((chat) => chat.type === "request");

  const renderChatItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate("Messages")}
      >
        {/* Profile Picture */}
        <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
        {/* Chat Info */}
        <View style={styles.chatInfo}>
          <Text style={styles.name}>{item.name}</Text>
          {activeTab === "Inbox" ? (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          ) : (
            <View style={styles.requestInfo}>
              <Text style={styles.ageLocation}>
                Age: 24  📍Jaipur
              </Text>
            </View>
          )}
        </View>

        {/* Right Section (Timestamp, Call Icon, and buttons for Requests) */}
        <View style={styles.rightSection}>
          {activeTab === "Inbox" ? (
            <>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call-outline" size={24} color="#34C759" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.requestButtons}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddRequest(item.id)}
              >
                <Text style={styles.addButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleRejectRequest(item.id)}
              >
                <Text style={styles.rejectButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Handler for accepting a request
  const handleAddRequest = (id) => {
    console.log(`Accepted request from ${id}`);
  };

  // Handler for rejecting a request
  const handleRejectRequest = (id) => {
    console.log(`Rejected request from ${id}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Chats</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Inbox" && styles.activeTab]}
          onPress={() => setActiveTab("Inbox")}
        >
          <Text
            style={[styles.tabText, activeTab === "Inbox" && styles.activeTabText]}
          >
            Inbox
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Requests" && styles.activeTab]}
          onPress={() => setActiveTab("Requests")}
        >
          <Text
            style={[styles.tabText, activeTab === "Requests" && styles.activeTabText]}
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
      />

      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
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
    borderBottomColor: "#FF5555",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FF5555",
  },
  listContainer: {
    paddingBottom: 40, 
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,   
    borderBottomWidth : 1,
    borderColor : "gray"
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
  },
  requestButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    marginRight: 10,
    backgroundColor: "#34C759", 
    borderRadius: 8,
    paddingHorizontal : 12,
    paddingVertical : 7,
    fontWeight : 700
  },
  addButtonText: {
    color: "#fff", 
    fontSize: 13,
  },
  rejectButton: {
    backgroundColor: "#FF5555", 
    borderRadius: 8,
    paddingHorizontal : 12,
    paddingVertical : 7,
    fontWeight : 700
  },
  rejectButtonText: {
    color: "#fff",
    fontSize: 13,
  },
});

export default AllChatsScreen;
