import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import Modal from "react-native-modal";
import Swiper from "react-native-swiper";
import fbicon from "../../assets/photos/facebook.png";
import phoneicon from "../../assets/photos/iphone.png";
import { RequestPhoneNumberPopup } from "../Popups";
import { CalculateAge } from "../../controller/ReusableFunction";
import { getSingleUserDetail } from "../../controller/UserController";
import MessagePopup from "../MessagePopup";

const { width, height } = Dimensions.get("window");

const ProfilePopup = ({ isVisible, onClose, user_id }) => {
 
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMobileRequestPopup, setShowMobileRequestPopup] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      fetchUserDetails();
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
      setMatch(null);
    }
  }, [isVisible]);

  const fetchUserDetails = async () => {
    if (!user_id) return;
    try {
      setLoading(true);
      const response = await getSingleUserDetail(user_id);
      setMatch(response);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setLoading(false);
    }
  };
console.log(match)
  if (!isVisible) return null;

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
          {loading || !match ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={{ marginTop: 10 }}>Loading profile...</Text>
            </View>
          ) : (
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
                {match.username}, {match.dob ? CalculateAge(match.dob) : "N/A"}
              </Text>
              <Text style={styles.city}>📍 {match.city}</Text>
              <Text style={styles.bio}>"{match.bio}"</Text>

              {/* Mobile Info */}
              <View style={[styles.detailsContainer, { marginBottom: 0 }]}>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Mobile</Text>
                  <View style={{ maxWidth: "100%" }}>
                    <View style={[styles.value, { maxWidth: "100%" }]}>
                      <Text>+918690*****</Text>
                      <Pressable
                        onPress={() => setShowMobileRequestPopup(true)}
                      >
                        <Text style={styles.requestButton}>
                          Request to show
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Verified By</Text>
                  <View style={[styles.value, styles.verifiedIcons]}>
                    <Image source={fbicon} style={styles.icon} />
                    <Image source={phoneicon} style={styles.icon} />
                  </View>
                </View>
              </View>

              {/* Detailed Info List */}
              <View style={styles.detailsContainer}>
                {[
                  { label: "Education", value: match.education },
                  { label: "Profession", value: match.profession },
                  { label: "Eating Preference", value: match?.eating_preference },
                  {
                    label: "Drinking Preference",
                    value: match?.drinking,
                  },
                  { label: "Dating Type", value: match.dating_type?.join(", ") },
                  { label: "Hobbies", value: match.hobbies?.join(", ") },
                ].map(({ label, value }, i) => (
                  <View key={i} style={styles.detailRow}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.value}>{value || "_"}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <MessagePopup receiver_id={match?.user_id}/>

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

      {/* Mobile number request popup */}
      {showMobileRequestPopup && (
        <RequestPhoneNumberPopup
          onClose={() => setShowMobileRequestPopup(false)}
        />
      )}
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
  requestButton: {
    fontSize: 12,
    color: "#0040ff",
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
  verifiedIcons: {
    flexDirection: "row",
    gap: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
  buttonsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    bottom: 10,
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
