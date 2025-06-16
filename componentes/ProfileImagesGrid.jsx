import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / 3;

const ProfileImagesGrid = ({ images }) => {
  return (
    <View style={styles.container}>
      {images.map((uri, index) => (
        <Image key={index} source={{ uri }} style={styles.image} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom : 40
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderWidth: 1,
    borderColor: "#fff",
  },
});

export default ProfileImagesGrid;
