import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import Modal from "react-native-modal"; 
import Swiper from "react-native-swiper";

const { width, height } = Dimensions.get("window");

const ProfilePopup = ({ isVisible, onClose, match, onMessage, onBlock }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [isVisible]);

  if (!match) return null;

  const profileDetails = [
    { label: "Education", value: match.education },
    { label: "Profession", value: match.profession },
    { label: "Eating Preference", value: match.eatingPreference },
    { label: "Drinking Preference", value: match.drinkingPreference },
    { label: "Dating Type", value: match.datingType },
    { label: "Hobbies", value: match.hobbies?.join(", ") },
  ];

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      style={styles.modal}
      useNativeDriver
    >
      <View style={styles.overlayBackground}>
        <Animated.View
          style={[styles.popupContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Image swiper */}
            <View style={styles.swiperContainer}>
              <Swiper
                style={styles.swiper}
                showsPagination
                loop
                autoplayTimeout={4}
                dotColor="rgba(255, 255, 255, 0.4)"
                activeDotColor="#fff"
              >
                {(match.images || [match.image]).map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: img }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ))}
              </Swiper>
            </View>

            {/* Basic Info */}
            <Text style={styles.name}>
              {match.name}, {match.age}
            </Text>
            <Text style={styles.city}>📍 {match.city}</Text>
            <Text style={styles.bio}>"{match.bio}"</Text>

            {/* List view details */}
            <View style={styles.detailsContainer}>
              {profileDetails.map(({ label, value }, i) => (
                <View key={i} style={styles.detailRow}>
                  <Text style={styles.label}>{label}</Text>
                  <Text style={styles.value}>{value || "N/A"}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={{ display: "flex" }}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.messageButton]}
                onPress={() => {
                  if (onMessage) onMessage(match);
                  else Alert.alert("Message button pressed");
                }}
              >
                <Text style={styles.buttonText}>Message</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.blockButton]}
                onPress={() => {
                  if (onBlock) onBlock(match);
                  else Alert.alert("Block button pressed");
                }}
              >
                <Text style={styles.buttonText}>Block</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  blurBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: height * 0.85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    overflow: "hidden",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 20,
  },
  swiperContainer: {
    height: 400,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 400,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginTop: 8,
  },
  city: {
    fontSize: 16,
    color: "#555",
    marginVertical: 4,
  },
  bio: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    fontStyle: "italic",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  detailsContainer: {
    marginTop: 10,
    marginBottom: 60,
    width: "100%",
    paddingHorizontal: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  label: {
    fontWeight: "600",
    color: "#222",
    fontSize: 15,
  },
  value: {
    color: "#555",
    fontSize: 15,
    maxWidth: "65%",
    textAlign: "right",
  },
  buttonsContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    width: "100%",
    paddingHorizontal: 10,
    bottom: 0,
    margin: "auto",
  },
  overlayBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(56, 56, 56, 0.14)", // You can adjust opacity or color as needed
  },

  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    elevation: 3,
  },
  messageButton: {
    backgroundColor: "#4CAF50", // green
  },
  blockButton: {
    backgroundColor: "#FF3B30", // red
  },
  closeButton: {
    backgroundColor: "#666", // gray
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default ProfilePopup;
