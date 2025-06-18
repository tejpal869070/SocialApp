import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome";
import bg1 from "../assets/photos/little-red.jpg";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export const MatchPopup = ({ onClose }) => {
  const leftImageScale = useSharedValue(0);
  const rightImageScale = useSharedValue(0);
  const heartScale = useSharedValue(0);

  useEffect(() => {
    leftImageScale.value = withTiming(1, { duration: 500 });
    rightImageScale.value = withTiming(1, { duration: 500 });
    heartScale.value = withTiming(1, { duration: 700 });
  }, []);

  const leftImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: leftImageScale.value }, { skewY: "-5deg" }],
  }));

  const rightImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rightImageScale.value }, { skewY: "5deg" }],
  }));

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartScale.value,
  }));

  return (
    <ImageBackground source={bg1} style={styles.container}>
      <View style={styles.imageContainer}>
        <AnimatedImage
          source={{
            uri: "https://i.pinimg.com/736x/b2/c1/14/b2c114970d1473b26ae3e9433fd656e2.jpg",
          }}
          style={[styles.image, leftImageStyle]}
        />
        <AnimatedIcon
          name="heart"
          size={45}
          color="#ff4081"
          style={[styles.heartIcon, heartStyle]}
        />
        <AnimatedImage
          source={{
            uri: "https://img.freepik.com/free-photo/young-beautiful-girl-posing-black-leather-jacket-park_1153-8104.jpg?semt=ais_hybrid&w=740",
          }}
          style={[styles.image, rightImageStyle]}
        />
      </View>

      <Text style={styles.title}>You matched!</Text>
      <Text style={styles.subtitle}>
        This is a chance to get to know each other better
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Send message 📩</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          { marginTop: 15, backgroundColor: "white", color: "red" },
        ]}
        onPress={onClose}
      >
        <Text style={styles.buttonText2}>Back</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 160,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "#ff5e7a",
  },
  heartIcon: {
    marginHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#ff4081",
    padding: 12,
    borderRadius: 25,
    width: "60%",
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: 500,
    fontSize: 16,
  },
  buttonText2: {
    color: "black",
    fontSize: 16,
    fontWeight: 500,
  },
});

export default MatchPopup;
