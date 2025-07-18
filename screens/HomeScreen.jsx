import { StatusBar } from "expo-status-bar";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
import { CalculateAge } from "../controller/ReusableFunction";
import { LinearGradient } from "expo-linear-gradient";
import { GetFeedData, likeProfile } from "../controller/UserController";
import HomeProfilePopup from "../componentes/Profile/HomeProfilePopup";

const DEFAULT_IMAGE = "https://via.placeholder.com/300?text=No+Image";

const preloadImages = async (profiles) => {
  const imageUrls = profiles.flatMap(
    (profile) => profile.images?.filter(Boolean) || [DEFAULT_IMAGE]
  );
  try {
    await Promise.all(
      imageUrls.map((url) =>
        Image.prefetch(url).catch((error) => {
          console.warn(`Failed to prefetch image: ${url}`, error);
          return Promise.resolve();
        })
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
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showLikeEffect, setShowLikeEffect] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const messagePopupAnim = useRef(new Animated.Value(height)).current;
  const imageOpacity = useRef(new Animated.Value(1)).current;
  const likeTextOpacity = useRef(new Animated.Value(0)).current;
  const likeButtonScale = useRef(new Animated.Value(1)).current;

  const currentProfile = profiles[currentProfileIndex] || {};
  const nextProfile = profiles[currentProfileIndex + 1] || {};

  const likeTextOpacityInterpolate = useMemo(
    () =>
      pan.x.interpolate({
        inputRange: [0, width / 7],
        outputRange: [0, 0.8],
        extrapolate: "clamp",
      }),
    [pan.x]
  );

  useEffect(() => {
    likeTextOpacity.setValue(0);
  }, [currentProfileIndex]);

  const rotate = useMemo(
    () =>
      pan.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ["-10deg", "0deg", "10deg"],
        extrapolate: "clamp",
      }),
    [pan.x]
  );

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
  }, [page, hasMore]);

  useEffect(() => {
    if (currentProfileIndex >= profiles.length - 3 && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [currentProfileIndex, profiles.length, hasMore, loading]);

  const closeProfile = useCallback(() => {
    setModalVisible(false);
    setSelectedProfile(null);
  }, []);

  const openProfile = useCallback((match) => {
    setSelectedProfile(match);
    setModalVisible(true);
  }, []);

  const animateImageChange = useCallback(
    (newIndex) => {
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
    },
    [imageOpacity]
  );

  const handleImageTap = useCallback(
    (event) => {
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
    },
    [currentImageIndex, currentProfile.images, animateImageChange]
  );

  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = useCallback(
    async (event) => {
      if (event.nativeEvent.state === State.END) {
        const { translationX } = event.nativeEvent;

        if (Math.abs(translationX) > SWIPE_THRESHOLD) {
          const isLike = translationX > 0;
          if (isLike) {
            setLiked(true);
            try {
              likeProfile(currentProfile.uid).catch((error) => {
                console.error("Error liking profile:", error);
              });
            } catch (error) {
              console.error("Error liking profile:", error);
            }
          }

          Animated.timing(pan, {
            toValue: { x: translationX > 0 ? width * 1.5 : -width * 1.5, y: 0 },
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setCurrentProfileIndex((prev) => prev + 1);
            setCurrentImageIndex(0);
            setLiked(false);
            pan.setValue({ x: 0, y: 0 });
            imageOpacity.setValue(1);
            likeTextOpacity.setValue(0);
            likeButtonScale.setValue(1);
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            velocity: 0.5,
            tension: 60,
            friction: 10,
            useNativeDriver: true,
          }).start(() => {
            likeTextOpacity.setValue(0);
          });
        }
      }
    },
    [pan, imageOpacity, likeTextOpacity, likeButtonScale, currentProfile.uid]
  );

  const handleLike = useCallback(() => {
    setLiked(true);
    setShowLikeEffect(true); // Trigger the like effect

    likeProfile(currentProfile.uid).catch((error) => {
      console.error("Error liking profile:", error);
    });

    // Animate the like button and effect
    Animated.parallel([
      Animated.timing(likeButtonScale, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(likeTextOpacity, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After animation completes, hide the like effect and move to the next profile
      Animated.parallel([
        Animated.timing(likeButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(likeTextOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pan, {
          toValue: { x: width * 1.5, y: 0 },
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentProfileIndex((prev) => prev + 1);
        setCurrentImageIndex(0);
        setLiked(false);
        setShowLikeEffect(false); // Hide the like effect
        pan.setValue({ x: 0, y: 0 });
        imageOpacity.setValue(1);
        likeButtonScale.setValue(1);
      });
    });
  }, [currentProfile.uid, pan, imageOpacity, likeTextOpacity, likeButtonScale]);

  const handleDislike = useCallback(() => {
    Animated.timing(pan, {
      toValue: { x: -width * 1.5, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentProfileIndex((prev) => prev + 1);
      setCurrentImageIndex(0);
      pan.setValue({ x: 0, y: 0 });
      imageOpacity.setValue(1);
    });
  }, [pan, imageOpacity]);

  const handleSuperLike = useCallback(() => {
    // Implement super like logic if needed
    console.log("Super like pressed");
  }, []);

  const handleNext = useCallback(() => {
    // Implement next profile logic if needed
    setCurrentProfileIndex((prev) => prev + 1);
    setCurrentImageIndex(0);
    pan.setValue({ x: 0, y: 0 });
    imageOpacity.setValue(1);
  }, [pan, imageOpacity]);

  const handleMessage = useCallback(() => {
    setShowMessagePopup(true);
    Animated.timing(messagePopupAnim, {
      toValue: height - 300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [messagePopupAnim]);

  const closeMessage_popup = useCallback(() => {
    Animated.timing(messagePopupAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowMessagePopup(false));
  }, [messagePopupAnim]);

  const currentProfileImage = useMemo(
    () =>
      currentProfile.images && currentProfile.images[currentImageIndex]
        ? currentProfile.images[currentImageIndex]
        : DEFAULT_IMAGE,
    [currentProfile.images, currentImageIndex]
  );

  const nextProfileImage = useMemo(
    () =>
      nextProfile.images && nextProfile.images[0]
        ? nextProfile.images[0]
        : DEFAULT_IMAGE,
    [nextProfile.images]
  );

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

          <LinearGradient
            colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            locations={[0, 0.9]}
            style={[styles.fullScreenContainer, { height: height * 0.5 }]}
          >
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
                  <View
                    style={[styles.touchableImage, { position: "absolute" }]}
                  >
                    <Image
                      source={{ uri: nextProfileImage }}
                      style={styles.profileImage}
                      cachePolicy="memory-disk"
                      contentFit="cover"
                    />
                    <LinearGradient
                      colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)"]}
                      style={[
                        styles.bottomInfoContainer,
                        { bottom: height * 0.13 },
                      ]}
                      start={{ x: 0.5, y: 1 }}
                      end={{ x: 0.5, y: 0 }}
                      locations={[0, 1]} // Make sure it's completely transparent
                    >
                      <Text style={styles.name}>
                        {nextProfile.username || "Unknown"}{" "}
                        {nextProfile.dob
                          ? CalculateAge(nextProfile.dob)
                          : "N/A"}
                      </Text>
                      <Text style={styles.location}>
                        📍 {currentProfile.city || "N/A"}
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
                          { rotate },
                        ],
                        zIndex: 1,
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={handleImageTap}
                        style={{ position: "relative" }}
                      >
                        <Animated.Image
                          source={{ uri: currentProfileImage }}
                          style={{
                            ...styles.profileImage,
                            opacity: imageOpacity,
                          }}
                          cachePolicy="memory-disk"
                          contentFit="cover"
                        />

                        <Animated.View
                          style={{
                            ...styles.likeTextOverlay,
                            opacity: likeTextOpacityInterpolate,
                          }}
                        >
                          <Image
                            source={require("../assets/photos/like-text-effect-png.png")}
                            style={{ width: 200, height: 200 }}
                          />
                        </Animated.View>

                        <LinearGradient
                          colors={[
                            "rgba(255, 255, 255, 0)",
                            "rgba(0, 0, 0, 0)",
                          ]}
                          start={{ x: 0.5, y: 1 }}
                          end={{ x: 0.5, y: 0 }}
                          style={styles.bottomInfoContainer}
                          locations={[0, 0.8]} // Smooth fade to transparent
                        >
                          <Text style={styles.name}>
                            {currentProfile.username || "Unknown"}{" "}
                            {currentProfile.dob
                              ? CalculateAge(currentProfile.dob)
                              : "N/A"}
                          </Text>
                          <Text style={styles.location}>
                            📍 {currentProfile.city || "N/A"}
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
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "white" }]}
                onPress={handleDislike}
              >
                <Text style={styles.actionButtonText}>❌</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    width: 100,
                    height: 100,
                    backgroundColor: liked ? "white" : "black",
                    borderRadius: 600,
                    padding: 8,
                  },
                ]}
                onPress={handleLike}
              >
                <Animated.Text
                  style={[
                    styles.actionButtonText,
                    {
                      fontSize: 70,
                      transform: [{ scale: likeButtonScale }],
                      color: liked ? "#00FF00" : "#FFF",
                    },
                  ]}
                >
                  {liked ? "❤️" : "💚"}
                </Animated.Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "white" }]}
                onPress={() => openProfile(currentProfile)}
              >
                <Image
                  style={{ width: 50, height: 50 }}
                  source={require("../assets/photos/detail.png")}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>

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

      <HomeProfilePopup
        isVisible={isModalVisible}
        match={selectedProfile}
        onClose={closeProfile}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Dark background like Tinder
  },
  fullScreenContainer: {
    flex: 1,
    width: "100%",
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
  logo: {
    width: 100,
    height: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: width,
    height: height,
  },
  touchableImage: {
    width: width,
    height: height,
  },
  profileImage: {
    width: width,
    height: height * 0.95,
    borderRadius: 0,
  },
  likeTextOverlay: {
    position: "absolute",
    top: height * 0.2,
    left: width * 0.05,
    paddingHorizontal: 20,
    // borderWidth: 2,
    // borderColor: "#00FF00",
    // borderRadius: 10,
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
    top: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
    borderRadius: 4,
  },
  activeIndicator: {
    backgroundColor: "#fff",
  },
  bottomInfoContainer: {
    position: "absolute",
    bottom: height * 0.08,
    left: 0,
    right: 0,
    padding: 20,
    height: 160,
  },
  statusContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    color: "#fff",
    backgroundColor: "rgba(0, 255, 0, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  location: {
    fontSize: 18,
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 20,
    position: "absolute",
    bottom: 0,
    width: width,
    backgroundColor: "transparent",
    zIndex: 1,
    height: 150,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  actionButtonText: {
    fontSize: 30,
    color: "#fff",
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
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});

export default HomeScreen;
