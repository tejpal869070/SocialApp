import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { sendMessageRequest } from "../controller/UserController";

const MessagePopup = ({ receiver_id }) => { 
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSend = async () => { 
    try {
      await sendMessageRequest(receiver_id, message);
      setMessage("");
      setModalVisible(false);
      setSuccess(true);
      setError("")
    } catch (error) {
      setError(error?.response?.data?.message || "Please Try Again!"); 
    }
  };

  useEffect(() => {
    if (success) {
      setSuccess(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.requestButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {success ? "Request Sent" : "Send Request"}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {error && <Text style={styles.error}>{error}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Send" onPress={handleSend} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  requestButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    elevation: 3,
    backgroundColor: "#4CAF50",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    height: 200,
    justifyContent: "center",
    gap: 10,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  error: {
    color: "#FF0000",
    fontSize: 12,
  },
});

export default MessagePopup;
