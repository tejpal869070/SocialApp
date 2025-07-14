import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import {
  deleteImageFromServer,
  uploadImageToServer,
} from "../../controller/UserController";

const MAX_IMAGES = 6;

const ProfileImageUpdater = ({
  isModalVisible,
  closeModal,
  existingPhotos = [],
}) => {
  const [imageUrls, setImageUrls] = useState(existingPhotos);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalVisible) {
      setImageUrls(existingPhotos);
    }
  }, [isModalVisible, existingPhotos]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Media library access is required.");
      return;
    }

    if (imageUrls.length >= MAX_IMAGES) {
      Alert.alert(
        "Limit Reached",
        `You can upload up to ${MAX_IMAGES} images.`
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri; 

      try {
        setLoading(true);
        const uploaded = await uploadImageToServer(uri);
        const uploadedUrl = uploaded?.data?.images?.[0];

        if (uploadedUrl) {
          const updated = [...imageUrls, uploadedUrl];
          setImageUrls(updated);
        } else {
          Alert.alert("Upload Failed", "No image returned from server.");
        }
      } catch (error) {
        console.error("Upload errorrrr:", error);
        Alert.alert(
          "Upload Error",
          error?.response?.data?.message || error.message || "Upload failed."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveImage = async (imageUrl, index) => {
    try {
      const success = await deleteImageFromServer(imageUrl);
      if (success) {
        const updated = [...imageUrls];
        updated.splice(index, 1);
        setImageUrls(updated);
      } else {
        Alert.alert("Delete Error", "Failed to delete image.");
      }
    } catch (error) {
      Alert.alert("Error", error?.message || "Failed to delete image.");
    }
  };

  const renderImageGrid = () => (
    <FlatList
      data={imageUrls}
      numColumns={3}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item }} style={styles.image} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveImage(item, index)}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={closeModal}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Update Profile Images</Text>
        {loading && <ActivityIndicator size="small" color="#0000ff" />}
        {renderImageGrid()}

        <TouchableOpacity
          style={[
            styles.uploadButton,
            imageUrls.length >= MAX_IMAGES && { opacity: 0.5 },
          ]}
          onPress={pickImage}
          disabled={imageUrls.length >= MAX_IMAGES}
        >
          <Text style={styles.uploadButtonText}>Upload New</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={closeModal} style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Close</Text>
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
  uploadButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: "#28a745",
    borderRadius: 5,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  updateButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileImageUpdater;
