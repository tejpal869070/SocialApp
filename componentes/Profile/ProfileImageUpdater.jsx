import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  deleteImageFromServer,
  uploadImageToServer,
} from "../../controller/UserController";

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = (width - 90) / 3;
const IMAGE_HEIGHT = IMAGE_WIDTH * (5 / 4);
const EDIT_IMAGE_WIDTH = width - 40;
const EDIT_IMAGE_HEIGHT = EDIT_IMAGE_WIDTH * (5 / 4);

const ProfileImageUpdater = ({
  isModalVisible,
  closeModal,
  existingPhotos,
}) => {
  const [images, setImages] = useState(existingPhotos || []);
  const [selectedImage, setSelectedImage] = useState(null);
  const maxImages = 6;

  useEffect(() => {
    setImages(existingPhotos || []);
  }, [existingPhotos]);

  const pickImage = async () => {
    if (images.length >= maxImages) {
      Alert.alert(
        "Limit Reached",
        `You can only add up to ${maxImages} images.`
      );
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [4, 5],
    });

    if (!result.canceled) {
      try {
        const response = await uploadImageToServer(result.assets[0].uri);
        console.log( response?.data?.images[0])
        if (response?.data?.images && response?.data?.images.length > 0) {
          setImages((prevImages) => [...prevImages, response?.data?.images[0]]);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to upload image. Please try again.");
      }
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    console.log(`uploads/` + imageUrl?.split('/uploads/')[1])
    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteImageFromServer(`uploads/` + imageUrl?.split('/uploads/')[1]);
            setImages((prevImages) =>
              prevImages.filter((img) => img !== imageUrl)
            );
          } catch (error) {
            Alert.alert("Error", "Failed to delete image. Please try again.");
          }
        },
      },
    ]);
  };

  const renderEditView = () => (
    <View style={styles.editOverlay}>
      <View style={styles.editContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedImage(null)}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: selectedImage }} style={styles.editImage} />
      </View>
    </View>
  );

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
    >
      {selectedImage ? (
        renderEditView()
      ) : (
        <View style={styles.modalOverlay}>
          <View style={styles.popupContainer}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Profile Photo</Text>
              <TouchableOpacity onPress={closeModal}>
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={{ color: "#f6fd95ff", fontStyle : "italic", marginBottom :20 }}>
              Atleast 1 photo is required
            </Text>
            <View style={styles.imageGrid}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <TouchableOpacity onPress={() => setSelectedImage(image)}>
                    <Image source={{ uri: image }} style={styles.image} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteImage(image)}
                  >
                    <Icon name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              {Array.from({ length: maxImages - images.length }).map(
                (_, index) => (
                  <TouchableOpacity
                    key={`empty-${index}`}
                    style={styles.emptyImageContainer}
                    onPress={pickImage}
                  >
                    <Icon name="add" size={40} color="#888" />
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: width - 40,
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    marginBottom: 10,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    borderRadius: 12,
    padding: 2,
  },
  emptyImageContainer: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    marginBottom: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  editOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  editContainer: {
    width: width - 40,
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  editImage: {
    width: EDIT_IMAGE_WIDTH,
    height: EDIT_IMAGE_HEIGHT,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 20,
  },
  replaceButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  replaceButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileImageUpdater;
