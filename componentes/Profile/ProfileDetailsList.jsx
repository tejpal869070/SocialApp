import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { changeUserDetails, GetCities } from "../../controller/UserController";
import { SuccessPopup2 } from "../Popups";

const editableFields = [
  "gender",
  "education",
  "profession",
  "eating_preference",
  "drinking",
  "hobbies",
  "dating_type",
  "city",
];

const ProfileDetailsList = ({ profile, refreshData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // For hobbies & dating_type multi input
  const [multiItems, setMultiItems] = useState([]);
  const [multiInput, setMultiInput] = useState("");

  // For city picker
  const [allCities, setAllCities] = useState([]);
  const [citySearch, setCitySearch] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    refreshData();
  }, [success]);

  useEffect(() => {
    if (modalVisible && selectedField === "city") {
      loadCities();
    }
  }, [modalVisible, selectedField]);

  const loadCities = async () => {
    setLoadingCities(true);
    try {
      const cities = await GetCities();
      setAllCities(cities);
      setFilteredCities(cities);
    } catch (e) {
      Alert.alert("Error", "Failed to load cities");
    } finally {
      setLoadingCities(false);
    }
  };

  useEffect(() => {
    if (selectedField === "city") {
      const filtered = allCities.filter(
        (c) =>
          c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
          c.state.toLowerCase().includes(citySearch.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [citySearch, allCities, selectedField]);

  const openEditModal = (field, currentValue) => {
    setSelectedField(field);
    if (field === "hobbies" || field === "dating_type") {
      setMultiItems(currentValue || []);
      setMultiInput("");
    } else if (field === "city") {
      setCitySearch("");
      setInputValue(currentValue?.name || "");
    } else if (field === "gender") {
      setInputValue(
        currentValue === "M" || currentValue === "Male" ? "Male" : "Female"
      );
    } else {
      setInputValue(currentValue ? currentValue.toString() : "");
    }

    setModalVisible(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    let formattedValue;

    if (selectedField === "gender") {
      formattedValue = inputValue === "Male" ? "M" : "F";
    } else if (selectedField === "city") {
      const cityObj = allCities.find(
        (c) => c.name.toLowerCase() === inputValue.toLowerCase()
      );
      if (!cityObj) {
        Alert.alert("Error", "Please select a valid city from the list.");
        setIsSaving(false);
        return;
      }
      formattedValue = cityObj.name;
    } else if (["hobbies", "dating_type"].includes(selectedField)) {
      formattedValue = multiItems;
    } else {
      formattedValue = inputValue;
    }

    const formData = {
      [selectedField]: formattedValue,
    };

    try {
      await changeUserDetails(formData);
      setSuccess(true);
      setModalVisible(false);
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  const addMultiItem = () => {
    if (multiInput.trim() && !multiItems.includes(multiInput.trim())) {
      setMultiItems((prev) => [...prev, multiInput.trim()]);
      setMultiInput("");
    }
  };

  const removeMultiItem = (item) => {
    setMultiItems((prev) => prev.filter((i) => i !== item));
  };

  const {
    dob,
    gender,
    phone,
    email,
    education,
    profession,
    eating_preference,
    drinking,
    hobbies,
    dating_type,
    lifestyle,
    city,
  } = profile;

  const details = [
    {
      label: "Date of Birth",
      value: dob,
      field: "dob",
      icon: "calendar-outline",
      iconType: "Ionicons",
    },
    {
      label: "Gender",
      value: gender === "M" ? "Male" : "Female",
      field: "gender",
      icon: "male-female-outline",
      iconType: "Ionicons",
    },
    {
      label: "Phone",
      value: phone,
      field: "phone",
      icon: "call-outline",
      iconType: "Ionicons",
    },
    {
      label: "Email",
      value: email,
      field: "email",
      icon: "mail-outline",
      iconType: "Ionicons",
    },
    {
      label: "City",
      value: city?.name || city,
      field: "city",
      icon: "location",
      iconType: "Ionicons",
    },
    {
      label: "Education",
      value: education,
      field: "education",
      icon: "school-outline",
      iconType: "Ionicons",
    },
    {
      label: "Profession",
      value: profession,
      field: "profession",
      icon: "briefcase-outline",
      iconType: "Ionicons",
    },
    {
      label: "Eating Preference",
      value: eating_preference,
      field: "eating_preference",
      icon: "restaurant-outline",
      iconType: "Ionicons",
    },
    {
      label: "Drinking",
      value: drinking,
      field: "drinking",
      icon: "beer-outline",
      iconType: "Ionicons",
    },
    {
      label: "Hobbies",
      value: hobbies?.length ? hobbies.join(", ") : "Not set",
      field: "hobbies",
      icon: "palette",
      iconType: "FontAwesome5",
    },
    {
      label: "Dating Type",
      value: dating_type?.length ? dating_type.join(", ") : "Not set",
      field: "dating_type",
      icon: "palette",
      iconType: "FontAwesome5",
    },
  ];

  return (
    <View style={{ flex: 1, position: success && "absolute" }}>
      <ScrollView
        scrollEnabled={!success}
        contentContainerStyle={styles.listContent}
      >
        {details.map((item, index) => {
          const isEditable = editableFields.includes(item.field);
          return (
            <Animated.View
              key={item.label}
              entering={FadeInDown.delay(index * 100).duration(500)}
            >
              <TouchableOpacity
                disabled={!isEditable}
                onPress={() => openEditModal(item.field, profile[item.field])}
              >
                <LinearGradient
                  colors={["#ffffff", "#f1f5f9"]}
                  style={styles.card}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {item.iconType === "Ionicons" ? (
                    <Ionicons
                      name={item.icon}
                      size={28}
                      color="#ff6f61"
                      style={styles.icon}
                    />
                  ) : (
                    <FontAwesome5
                      name={item.icon}
                      size={28}
                      color="#ff6f61"
                      style={styles.icon}
                    />
                  )}
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>{item.label}</Text>
                    <Text style={styles.value}>{item.value}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit {selectedField?.replace(/_/g, " ")}
            </Text>

            {/* Gender picker */}
            {selectedField === "gender" && (
              <View style={styles.optionRow}>
                {["Female", "Male"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      inputValue === option && styles.optionButtonSelected,
                    ]}
                    onPress={() => setInputValue(option)}
                    disabled={isSaving}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        inputValue === option && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* City searchable picker */}
            {selectedField === "city" && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Search city..."
                  value={citySearch}
                  onChangeText={setCitySearch}
                  editable={!isSaving}
                />
                {loadingCities ? (
                  <ActivityIndicator size="small" color="#ff6f61" />
                ) : (
                  <FlatList
                    style={{ maxHeight: 150, marginTop: 10 }}
                    data={filteredCities}
                    keyExtractor={(item) => item.id}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.cityItem}
                        onPress={() => {
                          setInputValue(item.name);
                          setCitySearch(item.name);
                        }}
                        disabled={isSaving}
                      >
                        <Text style={styles.cityName}>{item.name}</Text>
                        <Text style={styles.cityState}>{item.state}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </>
            )}

            {/* Hobbies and Dating Type multi input */}
            {(selectedField === "hobbies" ||
              selectedField === "dating_type") && (
              <>
                <View style={styles.multiInputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder={`Add ${selectedField.replace("_", " ")}`}
                    value={multiInput}
                    onChangeText={setMultiInput}
                    editable={!isSaving}
                    onSubmitEditing={addMultiItem}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={addMultiItem}
                    disabled={isSaving || !multiInput.trim()}
                  >
                    <Ionicons name="add" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                <View style={styles.multiItemsContainer}>
                  {multiItems.map((item) => (
                    <View key={item} style={styles.multiItem}>
                      <Text style={styles.multiItemText}>{item}</Text>
                      <TouchableOpacity onPress={() => removeMultiItem(item)}>
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color="#ff6f61"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Default text input */}
            {!["gender", "city", "hobbies", "dating_type"].includes(
              selectedField
            ) && (
              <TextInput
                style={styles.input}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Enter new value"
                editable={!isSaving}
              />
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
                disabled={isSaving}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { opacity: isSaving ? 0.6 : 1 }]}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text style={{ color: "white" }}>
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {success && (
        <SuccessPopup2
          onClose={() => {
            setSuccess(false);
            setModalVisible(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#fff2f2ff",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 0.5,
    borderColor: "rgba(255, 111, 97, 0.2)",
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "85%",
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1f2937",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#ff6f61",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#ff6f61",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  optionButtonSelected: {
    backgroundColor: "#ff6f61",
  },
  optionText: {
    color: "#ff6f61",
    fontWeight: "600",
    fontSize: 16,
  },
  optionTextSelected: {
    color: "#fff",
  },
  cityItem: {
    paddingVertical: 8,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  cityName: {
    fontWeight: "600",
    fontSize: 16,
  },
  cityState: {
    color: "#64748b",
  },
  multiInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#ff6f61",
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  multiItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  multiItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6f61",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  multiItemText: {
    color: "white",
    marginRight: 6,
  },
});

export default ProfileDetailsList;
