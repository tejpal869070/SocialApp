import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { Image } from "expo-image";
import bg1 from "../assets/photos/app-bg-7.jpg";
import SideNavBar from "../componentes/SideNavBar";
import ProfileFilter from "../componentes/ProfileFilter";
import MatchPopup from "../componentes/HaveMatch";
import crown from "../assets/photos/crown.png";
import ProfilePopup from "../componentes/Profile/ProfilePopup";
import { CalculateAge } from "../controller/ReusableFunction";
import { LinearGradient } from "expo-linear-gradient";
import { GetFeedData, likeProfile } from "../controller/UserController";

// Default image URL for when user images are unavailable
const DEFAULT_IMAGE = "https://via.placeholder.com/300?text=No+Image";

// Preload images
const preloadImages = async (profiles) => {
  const imageUrls = profiles.flatMap(
    (profile) => profile.images || [DEFAULT_IMAGE]
  );
  try {
    await Promise.all(
      imageUrls.map((url) =>
        Image.prefetch(url).catch((error) =>
          console.warn(`Failed to prefetch image: ${url}`, error)
        )
      )
    );
    console.log("Images preloaded successfully");
  } catch (error) {
    console.error("Error preloading images:", error);
  }
};

const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

const HomeScreen = ({ navigation }) => {
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [matched, setMatched] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const pan = useRef(new Animated.ValueXY()).current;
  const messagePopupAnim = useRef(new Animated.Value(height)).current;
  const imageOpacity = useRef(new Animated.Value(1)).current;
  const likeTextOpacity = useRef(new Animated.Value(0)).current;

  const currentProfile = profiles[currentProfileIndex] || {};
  const nextProfile = profiles[currentProfileIndex + 1] || {};

  // Interpolate opacity for LIKE text based on right swipe
  const likeTextOpacityInterpolate = pan.x.interpolate({
    inputRange: [0, width / 2],
    outputRange: [0, 0.8],
    extrapolate: "clamp",
  });

  // Interpolate rotation for swipe, pivoting from top-left corner
  const rotate = pan.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  // Fetch profiles and preload images
  useEffect(() => {
    const loadProfiles = async () => {
      if (loading || !hasMore) return;
      setLoading(true);
      try {
        const newProfiles = await GetFeedData(page);
        if (newProfiles.length === 0) {
          setHasMore(false);
          return;
        }
        await preloadImages(newProfiles);
        setProfiles((prev) => [...prev, ...newProfiles]);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfiles();
  }, [page]);

  // Prefetch next batch when nearing the end
  useEffect(() => {
    if (currentProfileIndex >= profiles.length - 3 && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [currentProfileIndex, profiles.length, hasMore, loading]);

  const closeProfile = () => {
    setModalVisible(false);
    setSelectedProfile(null);
  };

  const openProfile = (match) => {
    setSelectedProfile(match);
    setModalVisible(true);
  };

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
      currentProfile.images &&
      currentImageIndex < currentProfile.images.length - 1
    ) {
      animateImageChange(currentImageIndex + 1);
    }
  };

  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = async (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;

      if (translationX > SWIPE_THRESHOLD) {
        // Swipe right: Like profile
        setLiked(true);
        try {
          await likeProfile(currentProfile.uid);
        } catch (error) {
          console.error("Error liking profile:", error);
        }

        // Animate card off-screen to the right with spring
        Animated.sequence([
          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: width * 1.5, y: 0 },
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.timing(likeTextOpacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(imageOpacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Update state after animation completes
          setCurrentProfileIndex(currentProfileIndex + 1);
          setCurrentImageIndex(0);
          setLiked(false);
          pan.setValue({ x: 0, y: 0 });
          imageOpacity.setValue(1); // Reset opacity for next profile
        });
      } else if (translationX < -SWIPE_THRESHOLD) {
        // Swipe left: Next profile
        Animated.sequence([
          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: -width * 1.5, y: 0 },
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.timing(likeTextOpacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(imageOpacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Update state after animation completes
          setCurrentProfileIndex(currentProfileIndex + 1);
          setCurrentImageIndex(0);
          pan.setValue({ x: 0, y: 0 });
          imageOpacity.setValue(1); // Reset opacity for next profile
        });
      } else {
        // Reset card position with spring
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(likeTextOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  };

  const handleLike = () => {
    setLiked(true);
    try {
      likeProfile(currentProfile.uid);
      if (currentProfile.city === "Jaipur") {
        setMatched(true);
      }
    } catch (error) {
      console.error("Error liking profile:", error);
    }

    Animated.sequence([
      Animated.timing(likeTextOpacity, {
        toValue: 0.8,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(likeTextOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(imageOpacity, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setLiked(false);
      setCurrentProfileIndex(currentProfileIndex + 1);
      setCurrentImageIndex(0);
      imageOpacity.setValue(1); // Reset opacity for next profile
    });
  };

  const handleDislike = () => {
    Animated.sequence([
      Animated.timing(imageOpacity, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentProfileIndex(currentProfileIndex + 1);
      setCurrentImageIndex(0);
      imageOpacity.setValue(1); // Reset opacity for next profile
    });
  };

  const handleMessage = () => {
    setShowMessagePopup(true);
    Animated.timing(messagePopupAnim, {
      toValue: height - 300,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const closeMessage_popup = () => {
    Animated.timing(messagePopupAnim, {
      toValue: height,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setShowMessagePopup(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={bg1} style={styles.container}>
        <GestureHandlerRootView>
          <View style={styles.navbar}>
            <SideNavBar navigation={navigation} />
            <Image
              source={{
                uri: "https://via.placeholder.com/100x40/FF5555/FFFFFF?text=Tinder",
              }}
              style={styles.logo}
              cachePolicy="memory-disk"
              contentFit="contain"
            />
            <Pressable
              onPress={() => navigation.navigate("Plans")}
              style={{ position: "absolute", right: 60, top: 35 }}
            >
              <Image
                source={crown}
                style={{ width: 30, height: 30 }}
                cachePolicy="memory-disk"
              />
            </Pressable>
            <ProfileFilter />
          </View>

          {profiles.length === 0 && loading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.loader}
            />
          ) : (
            <View style={styles.imageContainer}>
              {/* Next profile (background) */}
              {nextProfile && (
                <View style={[styles.touchableImage, { position: "absolute" }]}>
                  <Image
                    source={{
                      uri:
                        nextProfile.images && nextProfile.images[0]
                          ? nextProfile.images[0]
                          : DEFAULT_IMAGE,
                    }}
                    style={styles.profileImage}
                    cachePolicy="memory-disk"
                  />
                  <LinearGradient
                    colors={["rgba(0, 0, 0, 0.5)", "transparent"]}
                    style={styles.bottomInfoContainer}
                    start={{ x: 0.5, y: 0.5 }}
                    end={{ x: 0.5, y: 0 }}
                  >
                    <Text style={styles.name}>
                      {nextProfile.username || "Unknown"},{" "}
                      {nextProfile.dob ? CalculateAge(nextProfile.dob) : "N/A"}
                    </Text>
                    <View
                      style={{ display: "flex", flexDirection: "row", gap: 6 }}
                    >
                      <Text style={styles.datingType}>
                        {nextProfile.datingType || "N/A"}
                      </Text>
                    </View>
                    <Text style={styles.location}>
                      📍 Lives in {nextProfile.city || "Unknown"}
                    </Text>
                  </LinearGradient>
                </View>
              )}

              {/* Current profile (foreground) */}
              {currentProfile && (
                <PanGestureHandler
                  onGestureEvent={onPanGestureEvent}
                  onHandlerStateChange={onHandlerStateChange}
                >
                  <Animated.View
                    style={{
                      ...styles.touchableImage,
                      transform: [
                        { translateX: pan.x },
                        { translateY: pan.y },
                        { rotate: rotate },
                      ],
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={handleImageTap}
                      style={{ position: "relative" }}
                    >
                      <Animated.Image
                        source={{
                          uri:
                            currentProfile.images &&
                            currentProfile.images[currentImageIndex]
                              ? currentProfile.images[currentImageIndex]
                              : DEFAULT_IMAGE,
                        }}
                        style={{
                          ...styles.profileImage,
                          opacity: imageOpacity,
                        }}
                        cachePolicy="memory-disk"
                      />

                      <Animated.View
                        style={{
                          ...styles.likeTextOverlay,
                          opacity: likeTextOpacityInterpolate,
                        }}
                      >
                        <Text style={styles.likeText}>LIKE</Text>
                      </Animated.View>

                      <LinearGradient
                        colors={["rgba(0, 0, 0, 0.5)", "transparent"]}
                        style={styles.bottomInfoContainer}
                        start={{ x: 0.5, y: 0.5 }}
                        end={{ x: 0.5, y: 0 }}
                      >
                        <Text style={styles.name}>
                          {currentProfile.username || "Unknown"},{" "}
                          {currentProfile.dob
                            ? CalculateAge(currentProfile.dob)
                            : "N/A"}
                        </Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 6,
                          }}
                        >
                          <Text style={styles.datingType}>
                            {currentProfile.datingType || "N/A"}
                          </Text>
                        </View>
                        <Text style={styles.location}>
                          📍 Lives in {currentProfile.city || "Unknown"}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                </PanGestureHandler>
              )}

              <View style={styles.indicators}>
                {currentProfile.images &&
                  currentProfile.images.map((_, index) => (
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

              <TouchableOpacity
                style={[styles.button, styles.userDetailIcon]}
                onPress={() => openProfile(currentProfile)}
              >
                <Text style={styles.buttonText}>
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require("../assets/photos/detail.png")}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          )}

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
                flexDirection: "column",
                gap: 6,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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

          {showMessagePopup && (
            <Animated.View
              style={{
                ...styles.messagePopup,
                transform: [{ translateY: messagePopupAnim }],
              }}
            >
              <Text style={styles.popupTitle}>Send a Message</Text>
              <Text style={styles.prefilledMessage}>
                Hey, you look amazing! Want to grab a coffee?
              </Text>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={closeMessage_popup}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeMessage_popup}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </GestureHandlerRootView>
      </ImageBackground>

      <StatusBar style="dark" />

      <ProfilePopup
        isVisible={isModalVisible}
        match={selectedProfile}
        onClose={closeProfile}
      />
    </SafeAreaView>
  );
};

// Styles remain unchanged
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
    position: "relative",
  },
  touchableImage: {
    width: width * 0.95,
    height: height * 0.65,
  },
  profileImage: {
    width: width * 0.95,
    height: height * 0.65,
    borderRadius: 12,
  },
  likeTextOverlay: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: "#00FF00",
    borderRadius: 10,
    transform: [{ rotate: "20deg" }],
  },
  likeText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#00FF00",
    textAlign: "center",
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
  datingType: {
    borderRadius: 60,
    color: "white",
    paddingVertical: 3,
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
  userDetailIcon: {
    position: "absolute",
    bottom: 20,
    right: 10,
    elevation: 10,
    borderRadius: 60,
  },
  buttonText: {
    fontSize: 30,
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
