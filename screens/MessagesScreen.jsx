import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { StatusBar } from "expo-status-bar";
import bg4 from "../assets/photos/app-bg-5.jpg";

const MessageScreen = ({ navigation, route }) => {
  const { user } = route.params || {
    user: {
      name: "Mansi",
      profilePic:
        "https://img.freepik.com/free-photo/young-beautiful-girl-posing-black-leather-jacket-park_1153-8104.jpg?semt=ais_hybrid&w=740",
    },
  };
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hey, how are you?",
      sender: "other",
      timestamp: "04:00 PM",
    },
    {
      id: "2",
      text: "I’m good, thanks! How about you?",
      sender: "me",
      timestamp: "04:01 PM",
    },
    {
      id: "3",
      text: "Doing great! Want to meet up later?",
      sender: "other",
      timestamp: "04:02 PM",
    },
    {
      id: "4",
      text: "Sure, let’s meet at 6 PM.",
      sender: "me",
      timestamp: "04:03 PM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);

  // Scroll to the latest message when messages update
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setMessages([
      ...messages,
      {
        id: (messages.length + 1).toString(),
        text: newMessage,
        sender: "me",
        timestamp: currentTime,
      },
    ]);
    setNewMessage("");
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "me" ? styles.messageSent : styles.messageReceived,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ImageBackground source={bg4} style={{flex : 1}}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
          <Text style={styles.headerText}>{user.name}</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Ionicons
                name="call-outline"
                size={24}
                color="#fff"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="videocam-outline"
                size={24}
                color="#fff"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Area */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <StatusBar style="light" />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#121B22',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2A44",
    padding: 15,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#2A3A56",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 15,
  },
  chatContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: "75%",
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
  },
  messageSent: {
    alignSelf: "flex-end",
    backgroundColor: "#005C4B",
  },
  messageReceived: {
    alignSelf: "flex-start",
    backgroundColor: "#2A3A56",
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  messageTimestamp: {
    fontSize: 12,
    color: "#ccc",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2A44",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#2A3A56",
  },
  input: {
    flex: 1,
    backgroundColor: "#2A3A56",
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    color: "#fff",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#005C4B",
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});

export default MessageScreen;
