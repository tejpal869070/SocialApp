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
  Modal,
  TouchableWithoutFeedback,
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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

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
        id: data.id,
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
    if (newMessage.trim() === "" || !user?.other_user_id) return;

    const socket = getSocket();
    if (!socket || !socket.connected) {
      console.warn("Socket not connected");
      return;
    }

    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const tempId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}`; // Temporary unique ID
    const msg = {
      id: tempId,
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
        if (res.data.id) {
          // Update message with server-assigned ID
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...m, id: res.data.id.toString() } : m
            )
          );
        } else {
          console.warn("Send failed:", res);
          // Remove message if server fails
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
        }
      }
    );

    setNewMessage("");
  };

  const handleLongPress = (item, event) => {
    if (item.sender === "me") {
      const { pageX, pageY } = event.nativeEvent;
      setSelectedMessage(item);
      console.log(item);
      setModalPosition({ x: pageX, y: pageY });
      setDeleteModalVisible(true);
    }
  };

  const deleteMessage = () => {
    if (!selectedMessage) return;

    const socket = getSocket();
    socket.emit(
      "deleteMessage",
      { message_id: selectedMessage.id },
      (response) => {
        if (response.status === "success") {
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== selectedMessage.id)
          );
          setDeleteModalVisible(false);
          setSelectedMessage(null);
        } else {
          console.warn("Failed to delete message", response);
        }
      }
    );
  };

  const renderMessage = ({ item }) => (
    <TouchableOpacity
      onLongPress={(event) => handleLongPress(item, event)}
      disabled={item.sender !== "me"}
    >
      <View
        style={[
          styles.messageContainer,
          item.sender === "me" ? styles.messageSent : styles.messageReceived,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground source={bg4} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: user.images }} style={styles.profilePic} />
          <Text style={styles.headerText}>{user.username}</Text>
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

        {/* Delete Message Modal */}
        <Modal
          animationType="none"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setDeleteModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.modalContent,
                  {
                    top: modalPosition.y,
                    left: modalPosition.x * 0.9,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={deleteMessage}
                >
                  <Text style={styles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
  },
  modalContent: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginRight: 20,
  },
  modalButton: {
    padding: 10,
  },
  modalButtonText: {
    color: "#FF3B30",
    fontSize: 16,
  },
});

export default MessageScreen;
