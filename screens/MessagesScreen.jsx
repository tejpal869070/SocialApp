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
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import bg4 from "../assets/photos/app-bg-7.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSocket } from "../controller/Socket";

const MessageScreen = ({ navigation, route }) => {
  const { user } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);
  const [myUserId, setMyUserId] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Load my user ID from storage
  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem("user_id");
      setMyUserId(Number(id));
    };
    loadUserId();
  }, []);

  // Fetch chat history
  useEffect(() => {
    const socket = getSocket();
    if (
      !socket ||
      !socket.connected ||
      !user?.other_user_id ||
      myUserId === null
    )
      return;

    socket.emit(
      "getChats",
      { other_user_id: user.other_user_id, page: 1 },
      (response) => {
        if (response.status === "success") {
          const formatted = response.data.map((msg) => ({
            id: msg.id.toString(),
            text: msg.message,
            sender: msg.sender_id === myUserId ? "me" : "other",
            timestamp: new Date(msg.created_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          }));
          setMessages(formatted);
        } else {
          console.warn("Failed to load chat history", response);
        }
      }
    );
  }, [myUserId, user?.other_user_id]);

  // Handle incoming real-time messages
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !socket.connected) return;

    const handleIncoming = (data) => {
      if (
        data.sender_id !== user.other_user_id &&
        data.receiver_id !== user.other_user_id
      )
        return;

      const msg = {
        id: Date.now().toString(),
        text: data.message,
        sender: "other",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };

      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveChatMessage", handleIncoming);
    return () => socket.off("receiveChatMessage", handleIncoming);
  }, [user.other_user_id]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const socket = getSocket();
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const msg = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "me",
      timestamp,
    };

    setMessages((prev) => [...prev, msg]);

    socket.emit(
      "sendChatMessage",
      {
        receiver_id: user.other_user_id,
        message: newMessage,
      },
      (res) => {
        if (res.status !== "ok") console.warn("Send failed:", res);
      }
    );

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
      // keyboardVerticalOffset={80}
    >
      <ImageBackground source={bg4} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: user.images }} style={styles.profilePic} />
          <Text style={styles.headerText}>{user.username}</Text>

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

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.chatContainer,
            { paddingBottom: keyboardVisible ? 10 : 80 },
          ]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5555",
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
  },
  messageContainer: {
    maxWidth: "75%",
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
  },
  messageSent: {
    alignSelf: "flex-end",
    backgroundColor: "#64b3ff",
  },
  messageReceived: {
    alignSelf: "flex-start",
    backgroundColor: "#999999",
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
