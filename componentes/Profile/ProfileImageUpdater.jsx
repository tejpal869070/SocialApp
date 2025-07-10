import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker"; 
import { deleteImageFromServer, uploadImageToServer } from "../../controller/UserController";

const MAX_IMAGES = 6;

const ProfileImageUpdater = ({
  isModalVisible,
  closeModal,
  existingPhotos = [],
}) => {
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState(existingPhotos); // URLs of existing images
  const [loading, setLoading] = useState(false);

  const combinedImages = [...existingPhotos, ...images].slice(0, MAX_IMAGES);

  useEffect(() => {
    setImages([]);  // Reset images when modal is closed or opened
  }, [isModalVisible]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      if (existingPhotos.length + images.length < MAX_IMAGES) {
        try {
          setLoading(true);
          const uploadedImageUrl = await uploadImageToServer(uri);
          setImages((prev) => [...prev, uploadedImageUrl]);
        } catch (error) {
          Alert.alert("Error", error.message || "Failed to upload image");
        } finally {
          setLoading(false);
        }
      } else {
        Alert.alert("Limit Exceeded", "You can upload up to 9 images only.");
      }
    }
  };

  const handleUpdateProfile = () => {
    Alert.alert("Profile updated!");
    closeModal();
  };

  const handleRemoveImage = async (index) => {
    const isFromExisting = index < existingPhotos.length;
    try {
      if (isFromExisting) {
        const imageId = existingPhotos[index].id; // Assuming your images have an `id` for deletion
        const success = await deleteImageFromServer(imageId);
        if (success) {
          Alert.alert("Success", "Image deleted successfully!");
          return;
        } else {
          Alert.alert("Error", "Failed to delete image.");
        }
      } else {
        const adjustedIndex = index - existingPhotos.length;
        const updatedImages = [...images];
        updatedImages.splice(adjustedIndex, 1);
        setImages(updatedImages);
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete image");
    }
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

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={closeModal}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Update Profile Images</Text>
        {loading && <Text>Uploading...</Text>}
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
