import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicatorBase,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

function SuccessPopup({ onClose }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmarkCircle}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require("../assets/photos/success-icon-2.png")}
            />
          </View>
        </View>
        <Text style={styles.title}>Success</Text>
        <Text style={styles.message}>Account Created</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Go To Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SuccessPopup2({ onClose }) {
  return (
    <View
      style={[
        styles.overlay,
        {
          position: "absolute",
          top: 0,
          left: 0,
          width: width,
          height: height,
          zIndex: 100,
          backgroundColor: "rgba(136, 136, 136, 1)",
        },
      ]}
    >
      <View style={styles.popup}>
        <View style={[styles.checkmarkContainer, { marginBottom: 5 }]}>
          <View style={styles.checkmarkCircle}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require("../assets/photos/success-icon-2.png")}
            />
          </View>
        </View>
        <Text style={styles.title}>Success</Text>
        <TouchableOpacity
          style={[styles.button, { marginTop: 10 }]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>CLOSE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SuccessPopup3({ onClose }) {
  return (
    <View style={[styles.overlay]}>
      <View style={styles.popup}>
        <View style={[styles.checkmarkContainer, { marginBottom: 5 }]}>
          <View style={styles.checkmarkCircle}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require("../assets/photos/success-icon-2.png")}
            />
          </View>
        </View>
        <Text style={styles.title}>Success</Text>
        <TouchableOpacity
          style={[styles.button, { marginTop: 10 }]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>CLOSE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PasswordForgetSuccessPopup({ onClose }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmarkCircle}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require("../assets/photos/success-icon-2.png")}
            />
          </View>
        </View>
        <Text style={styles.title}>Success</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ErrorPopup({ onClose, error }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmarkCircle}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require("../assets/photos/Error-512.webp")}
            />
          </View>
        </View>
        <Text style={styles.title}>{error && error}</Text>
        <TouchableOpacity
          style={[styles.button, { marginTop: 10 }]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// loading
function Loading({ onClose }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <View style={styles.checkmarkCircle}>
          <ActivityIndicator color={"#000"} size={"large"} />
        </View>
      </View>
    </View>
  );
}

// request to show phone number
function RequestPhoneNumberPopup({ onClose }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <Image
          source={require("../assets/photos/call.png")}
          style={{ width: 50, height: 50, marginBottom: 10 }}
        />
        <Text style={styles.sendPhoneRequestText}>
          A request will be sent to the user to allow access to their contact
          number. You’ll be able to see it once the user approves.
        </Text>
        <View style={styles.container}>
          <Pressable
            onPress={onClose}
            style={[styles.button, styles.cancelButton]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.sendButton]}>
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// request trip
function RequestTripPopup({ onClose }) {
  return (
    <View
      style={[
        styles.overlay,
        { position: "absolute", width: width, height: height, top: 0 },
      ]}
    >
      <View style={styles.popup}>
        <Image
          source={require("../assets/photos/call.png")}
          style={{ width: 50, height: 50, marginBottom: 10 }}
        />
        <Text style={styles.sendPhoneRequestText}>
          A request will be sent to the user to allow access to their contact
          number. You’ll be able to see it once the user approves.
        </Text>
        <View style={styles.container}>
          <Pressable
            onPress={onClose}
            style={[styles.button, styles.cancelButton]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.sendButton]}>
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    width: "80%",
  },
  sendPhoneRequestText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    fontStyle: "italic",
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  sendButton: {
    backgroundColor: "#007BFF",
  },
  cancelText: {
    color: "#333",
    fontWeight: "500",
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
  },
  checkmarkCircle: {
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  checkmarkLine: {
    position: "absolute",
    width: 30,
    height: 10,
    backgroundColor: "#ff2d55",
    borderRadius: 5,
    transform: [{ rotate: "45deg" }],
    top: 20,
    left: 15,
  },
  checkmarkLine2: {
    position: "absolute",
    width: 20,
    height: 10,
    backgroundColor: "#ff2d55",
    borderRadius: 5,
    transform: [{ rotate: "-45deg" }],
    top: 25,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#ff2d55",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 600,
  },
});

export {
  SuccessPopup,
  ErrorPopup,
  Loading,
  RequestPhoneNumberPopup,
  RequestTripPopup,
  PasswordForgetSuccessPopup,
  SuccessPopup2,
  SuccessPopup3,
};
