// ProfileImageUpdater.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";

const MAX_IMAGES = 9;

const ProfileImageUpdater = ({
  isModalVisible,
  closeModal,
  existingPhotos = [],
}) => {
  const [images, setImages] = useState([]);

  const combinedImages = [...existingPhotos, ...images].slice(0, MAX_IMAGES);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ Works for now
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      if (uri) {
        if (existingPhotos.length + images.length < MAX_IMAGES) {
          // ✅ Fixed
          setImages((prev) => [...prev, uri]);
        } else {
          alert("Maximum 9 images allowed.");
        }
      }
    }
  };

  const handleUpdateProfile = () => {
    alert("Profile updated!");
    closeModal();
  };

  const renderImageGrid = () => {
    const placeholders = [...combinedImages];
    while (placeholders.length < MAX_IMAGES) {
      placeholders.push(null);
    }

    return (
      <FlatList
        data={placeholders}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) =>
          item ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(index)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.placeholder} onPress={pickImage}>
              <Text style={styles.plusIcon}>+</Text>
            </TouchableOpacity>
          )
        }
      />
    );
  };

  const handleRemoveImage = (index) => {
    const isFromExisting = index < existingPhotos.length;
    if (isFromExisting) {
      // Optional: handle separately if you want to track removals from existing
      alert("Cannot remove existing image here."); // or handle via callback
      return;
    }

    const adjustedIndex = index - existingPhotos.length;
    const updated = [...images];
    updated.splice(adjustedIndex, 1);
    setImages(updated);
  };

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={closeModal}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Update Profile Images</Text>
        {renderImageGrid()}
        <TouchableOpacity
          onPress={handleUpdateProfile}
          style={styles.updateButton}
        >
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { justifyContent: "center", alignItems: "center" },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "95%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    alignSelf: "center",
  },
  image: {
    width: 90,
    height: 110,
    margin: 5,
    borderRadius: 10,
  },
  placeholder: {
    width: 90,
    height: 110,
    margin: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dotted",
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    fontSize: 28,
    color: "#888",
  },
  updateButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    marginTop: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
  },
  imageContainer: {
    position: "relative",
    width: 90,
    height: 110,
    margin: 5,
  },

  removeButton: {
    position: "absolute",
    top: 0,
    right: -6,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  removeButtonText: {
    color: "white",
    fontSize: 14,
    lineHeight: 18,
  },
});

export default ProfileImageUpdater;
