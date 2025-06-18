import { StatusBar } from "expo-status-bar";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  Pressable,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { profiles } from "../assets/Data/DummyProfiles";
import loveImage from "../assets/photos/love-png-img.png";
import bg1 from "../assets/photos/app-bg-7.jpg";
import SideNavBar from "../componentes/SideNavBar";
import ProfileFilter from "../componentes/ProfileFilter";
import MatchPopup from "../componentes/HaveMatch";
import crown from "../assets/photos/crown.png";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [matched, setMatched] = useState(false);

  const likeTranslateY = useRef(new Animated.Value(height)).current;
  const messagePopupAnim = useRef(new Animated.Value(height)).current;
  const imageOpacity = useRef(new Animated.Value(1)).current;
  const likeScale = useRef(new Animated.Value(0.5)).current; // start smaller
  const likeOverlayOpacity = useRef(new Animated.Value(0)).current;

  const currentProfile = profiles[currentProfileIndex];

  const sidebarAnim = useRef(new Animated.Value(-width)).current;

  const animateImageChange = (newIndex) => {
    Animated.timing(imageOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentImageIndex(newIndex);
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleImageTap = (event) => {
    const { locationX } = event.nativeEvent;
    const halfWidth = width / 2;

    if (locationX < halfWidth && currentImageIndex > 0) {
      animateImageChange(currentImageIndex - 1);
    } else if (
      locationX >= halfWidth &&
      currentImageIndex < currentProfile.images.length - 1
    ) {
      animateImageChange(currentImageIndex + 1);
    }
  };

  const handleImageSwipe = (direction) => {
    if (
      direction === "left" &&
      currentImageIndex < currentProfile.images.length - 1
    ) {
      animateImageChange(currentImageIndex + 1);
    } else if (direction === "right" && currentImageIndex > 0) {
      animateImageChange(currentImageIndex - 1);
    }
  };

  const onPanGestureEvent = (event) => {
    const { translationX } = event.nativeEvent;
    if (translationX > 50) {
      handleImageSwipe("right");
    } else if (translationX < -50) {
      handleImageSwipe("left");
    }
  };

  const handleLike = () => {
    setLiked(true);

    if (currentProfile.location === "Jaipur") {
      setMatched(true);
    } else {
      // Animate red overlay opacity and love image in parallel
      Animated.parallel([
        Animated.timing(likeOverlayOpacity, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(likeTranslateY, {
            toValue: height / 1.5,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(likeScale, {
            toValue: 2.5,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Hide love image and fade out red overlay
        Animated.timing(likeOverlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setLiked(false);
          likeTranslateY.setValue(height);
          likeScale.setValue(0.5);

          setCurrentProfileIndex((currentProfileIndex + 1) % profiles.length);
          setCurrentImageIndex(0);
        });
      });
    }
  };

  const handleDislike = () => {
    setCurrentProfileIndex((currentProfileIndex + 1) % profiles.length);
    setCurrentImageIndex(0);
  };

  const handleMessage = () => {
    setShowMessagePopup(true);
    Animated.timing(messagePopupAnim, {
      toValue: height - 300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMessagePopup = () => {
    Animated.timing(messagePopupAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowMessagePopup(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={bg1} style={styles.container}>
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(255, 0, 0, 1)",
              opacity: likeOverlayOpacity,
            },
          ]}
        />
        <GestureHandlerRootView>
          <View style={styles.navbar}>
            <SideNavBar navigation={navigation} />
            <Image
              source={{
                uri: "https://via.placeholder.com/100x40/FF5555/FFFFFF?text=Tinder",
              }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Pressable
              onPress={() => navigation.navigate("Plans")}
              style={{ position: "absolute", right: 60, top: 35 }}
            >
              <Image source={crown} style={{ width: 30, height: 30 }} />
            </Pressable>
            <ProfileFilter />
          </View>

          <PanGestureHandler onGestureEvent={onPanGestureEvent}>
            <View style={styles.imageContainer}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={handleImageTap}
                style={[styles.touchableImage, { position: "relative" }]}
              >
                <Animated.Image
                  source={{ uri: currentProfile.images[currentImageIndex] }}
                  style={[styles.profileImage, { opacity: imageOpacity }]}
                />
                {/* Bottom Info Section */}
                <View style={styles.bottomInfoContainer}>
                  <Text style={styles.name}>{currentProfile.name}</Text>
                  <Text style={styles.distance}>
                    Age : {currentProfile.age}
                  </Text>
                  <Text style={styles.location}>
                    🏠 Lives in {currentProfile.location}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.indicators}>
                {currentProfile.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      index === currentImageIndex
                        ? styles.activeIndicator
                        : null,
                    ]}
                  />
                ))}
              </View>
            </View>
          </PanGestureHandler>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleMessage}>
              <Text style={styles.buttonText}>
                <Image
                  style={{ width: 37, height: 37 }}
                  source={require("../assets/photos/chat-bubble.png")}
                />
              </Text>
            </TouchableOpacity>
            <View
              style={{
                display: "flex",
                flexDirection: "col",
                gap: 6,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity style={styles.button} onPress={handleMessage}>
                <Text style={styles.buttonText}>
                  <Image
                    style={{ width: 40, height: 40 }}
                    source={require("../assets/photos/user.png")}
                  />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { width: 90, height: 90 }]}
                onPress={handleLike}
              >
                <Text style={[styles.buttonText, { fontSize: 50 }]}>❤️</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleDislike}>
              <Text style={styles.buttonText}>❌</Text>
            </TouchableOpacity>
          </View>

          {liked && (
            <Animated.View
              style={[
                styles.likeOverlay,
                {
                  transform: [
                    { translateY: likeTranslateY },
                    { scale: likeScale },
                  ],
                },
              ]}
            >
              <Image source={loveImage} style={{ width: 100, height: 100 }} />
            </Animated.View>
          )}

          {/* if match then show */}
          {liked && matched && (
            <MatchPopup
              onClose={() => {
                setMatched(false);
                setCurrentProfileIndex(
                  (currentProfileIndex + 1) % profiles.length
                );
                setCurrentImageIndex(0);
              }}
            />
          )}

          {showMessagePopup && (
            <Animated.View
              style={[
                styles.messagePopup,
                { transform: [{ translateY: messagePopupAnim }] },
              ]}
            >
              <Text style={styles.popupTitle}>Send a Message</Text>
              <Text style={styles.prefilledMessage}>
                Hey, you look amazing! Want to grab a coffee?
              </Text>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={closeMessagePopup}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeMessagePopup}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </GestureHandlerRootView>
      </ImageBackground>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  touchableImage: {
    width: width - 40,
    height: height * 0.6,
  },
  profileImage: {
    width: width - 40,
    height: height * 0.6,
    borderRadius: 10,
  },
  indicators: {
    flexDirection: "row",
    position: "absolute",
    top: 10,
  },
  indicator: {
    width: 20,
    height: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 3,
    borderRadius: 2,
  },
  activeIndicator: {
    backgroundColor: "#666",
  },
  bottomInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  statusContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  status: {
    backgroundColor: "#34C759",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  location: {
    fontSize: 16,
    color: "#fff",
    marginVertical: 5,
  },
  distance: {
    fontSize: 16,
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 30,
  },
  likeOverlay: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    zIndex: 10,
  },
  messagePopup: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  prefilledMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: "#FF5555",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    alignItems: "center",
  },
  closeButtonText: {
    color: "#666",
    fontSize: 16,
  },
  navbar: {
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FF5555",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10,
  },
  sidebarBackdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 99,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.7,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sidebarItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sidebarText: {
    fontSize: 18,
  },
});

export default HomeScreen;
