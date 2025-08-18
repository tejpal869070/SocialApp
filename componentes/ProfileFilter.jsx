import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Switch,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetCities } from "../controller/UserController";

export default function FilterScreen({ onFilterChange }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [showOutOfRange, setShowOutOfRange] = useState(false);
  const [interested, setInterested] = useState(null);
  const [cities, setCities] = useState([]); // Initially empty
  const [addCityModalVisible, setAddCityModalVisible] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [suggestedCities, setSuggestedCities] = useState([]);
  const [availableCities, setAvailableCities] = useState([]); // Store all available cities for suggestions

  const genderOptions = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "Trans", value: "T" },
  ];

  const fetchCities = async () => {
    try {
      const arr = await GetCities();
      const formattedCities = arr.map((c) => ({ label: c.name, value: c.id }));
      setAvailableCities(formattedCities); 
    } catch (e) {
      console.error("Error fetching cities:", e);
    }
  };

  // Load saved data from AsyncStorage on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load cities
        const savedCities = await AsyncStorage.getItem("selectedCities"); 
        let parsedCities = [];
        if (savedCities) {
          try {
            parsedCities = JSON.parse(savedCities);
            if (
              Array.isArray(parsedCities) &&
              parsedCities.every((city) => city.label && city.value)
            ) {
              setCities(parsedCities);
            } else {
              console.warn(
                "Invalid savedCities format, expected array of objects with label and value:",
                parsedCities
              );
              // Reset to empty array if invalid
              await AsyncStorage.setItem("selectedCities", JSON.stringify([]));
            }
          } catch (parseError) {
            console.error("Error parsing savedCities:", parseError);
            await AsyncStorage.setItem("selectedCities", JSON.stringify([]));
          }
        } else {
          console.log(
            "No savedCities found in AsyncStorage, initializing empty"
          );
          await AsyncStorage.setItem("selectedCities", JSON.stringify([]));
        }

        // Load showOutOfRange
        const savedShowOutOfRange = await AsyncStorage.getItem(
          "showOutOfRange"
        );
        console.log(
          "Raw showOutOfRange from AsyncStorage:",
          savedShowOutOfRange
        );
        let parsedShowOutOfRange = false;
        if (savedShowOutOfRange) {
          try {
            parsedShowOutOfRange = JSON.parse(savedShowOutOfRange);
            if (typeof parsedShowOutOfRange === "boolean") {
              setShowOutOfRange(parsedShowOutOfRange);
            } else {
              console.warn(
                "Invalid showOutOfRange format, expected boolean:",
                parsedShowOutOfRange
              );
              await AsyncStorage.setItem(
                "showOutOfRange",
                JSON.stringify(false)
              );
            }
          } catch (parseError) {
            console.error("Error parsing showOutOfRange:", parseError);
            await AsyncStorage.setItem("showOutOfRange", JSON.stringify(false));
          }
        } else {
          console.log(
            "No showOutOfRange found in AsyncStorage, initializing false"
          );
          await AsyncStorage.setItem("showOutOfRange", JSON.stringify(false));
        }

        // Load interested
        const savedInterested = await AsyncStorage.getItem("interested");
        console.log("Raw interested from AsyncStorage:", savedInterested);
        let parsedInterested = null;
        if (savedInterested) {
          try {
            parsedInterested = JSON.parse(savedInterested);
            const validOption = genderOptions.find(
              (option) => option.value === parsedInterested?.value
            );
            if (validOption) {
              setInterested(validOption);
            } else {
              console.warn(
                "Invalid interested value, not found in genderOptions:",
                parsedInterested
              );
              await AsyncStorage.setItem("interested", JSON.stringify(null));
            }
          } catch (parseError) {
            console.error("Error parsing interested:", parseError);
            await AsyncStorage.setItem("interested", JSON.stringify(null));
          }
        } else {
          console.log("No interested found in AsyncStorage, initializing null");
          await AsyncStorage.setItem("interested", JSON.stringify(null));
        }

        // Fetch cities after loading saved data
        await fetchCities();
      } catch (e) {
        console.error("Error loading saved data from AsyncStorage:", e);
      }
    };
    loadSavedData();
  }, []);

  const handleCityInputChange = (text) => {
    setCityInput(text);
    if (text.length > 0) {
      const filteredCities = availableCities
        .filter((city) => city.label.toLowerCase().includes(text.toLowerCase()))
        .slice(0, 6);
      setSuggestedCities(filteredCities);
    } else {
      setSuggestedCities([]);
    }
  };

  const saveCitiesToStorage = async (updatedCities) => {
    try {
      await AsyncStorage.setItem(
        "selectedCities",
        JSON.stringify(updatedCities)
      );
      console.log("Saved cities to AsyncStorage:", updatedCities);
    } catch (e) {
      console.error("Error saving cities to AsyncStorage:", e);
    }
  };

  const saveShowOutOfRangeToStorage = async (value) => {
    try {
      await AsyncStorage.setItem("showOutOfRange", JSON.stringify(value));
      console.log("Saved showOutOfRange to AsyncStorage:", value);
    } catch (e) {
      console.error("Error saving showOutOfRange to AsyncStorage:", e);
    }
  };

  const saveInterestedToStorage = async (item) => {
    try {
      await AsyncStorage.setItem("interested", JSON.stringify(item));
      console.log("Saved interested to AsyncStorage:", item);
    } catch (e) {
      console.error("Error saving interested to AsyncStorage:", e);
    }
  };

  const handleCitySelect = (city) => {
    if (cities.some((existingCity) => existingCity.value === city.value)) {
      console.log("City already selected:", city.label);
      setCityInput("");
      setSuggestedCities([]);
      setAddCityModalVisible(false);
      return;
    }

    setCityInput("");
    setSuggestedCities([]);
    setAddCityModalVisible(false);
    setCities((prevCities) => {
      const updatedCities = [...prevCities, city];
      saveCitiesToStorage(updatedCities);
      return updatedCities;
    });
  };

  const handleRemoveCity = (cityToRemove) => {
    setCities((prevCities) => {
      const updatedCities = prevCities.filter(
        (city) => city.value !== cityToRemove.value
      );
      console.log("Removed city:", cityToRemove);
      console.log("Updated cities list:", updatedCities);
      saveCitiesToStorage(updatedCities);
      return updatedCities;
    });
  };

  return (
    <View style={styles.container}>
      {/* Filter Button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="filter" size={24} color="white" />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Discovery Settings</Text>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <ScrollView style={styles.citiesContainer}>
                <View style={styles.cities}>
                  {cities.length === 0 ? (
                    <Text style={styles.noCitiesText}>No cities selected</Text>
                  ) : (
                    cities.map((city, index) => (
                      <View key={index} style={styles.cityItem}>
                        <Text style={styles.optionText}>{city.label}</Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveCity(city)}
                          style={styles.removeButton}
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#FF3E55"
                          />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              </ScrollView>
              <TouchableOpacity
                style={[styles.addCityButton, { width: "50%" }]}
                onPress={() => setAddCityModalVisible(true)}
              >
                <Text style={styles.addCityButtonText}>Add a new location</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.prefrenceContainer}>
              <Text style={[styles.prefrenceTitle, { width: "50%" }]}>
                Interested In
              </Text>
              <Dropdown
                style={[styles.dropdown, { width: "50%" }]}
                data={genderOptions}
                labelField="label"
                valueField="value"
                placeholder="Select gender"
                value={interested}
                onChange={(item) => {
                  setInterested(item);
                  saveInterestedToStorage(item);
                  console.log("Selected gender:", item);
                }}
              />
            </View>

            <View style={styles.prefrenceContainer}>
              <Text style={styles.prefrenceTitle}>
                Show only verified profiles
              </Text>
              <Switch
                style={styles.prefrenceSwitch}
                value={showOutOfRange}
                onValueChange={(value) => {
                  setShowOutOfRange(value);
                  saveShowOutOfRangeToStorage(value);
                  console.log("Show verified profiles:", value);
                }}
                trackColor={{ false: "#D3D3D3", true: "#FF3E55" }}
                thumbColor={showOutOfRange ? "#FFFFFF" : "#FFFFFF"}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                onFilterChange();
                setModalVisible(false);
              }}
              style={[
                styles.addCityButton,
                { backgroundColor: "#fa4c4cff", marginTop: 20 },
              ]}
            >
              <Text style={styles.addCityButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add City Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={addCityModalVisible}
        onRequestClose={() => setAddCityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addCityModalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setAddCityModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add New City</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.cityInput}
                placeholder="Enter city name"
                placeholderTextColor="#888"
                value={cityInput}
                onChangeText={handleCityInputChange}
              />
            </View>
            {suggestedCities.length > 0 && (
              <FlatList
                data={suggestedCities}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleCitySelect(item)}
                  >
                    <Text style={styles.suggestionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionList}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  filterButton: {
    position: "absolute",
    right: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "80%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  addCityModalContent: {
    height: "50%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  citiesContainer: {
    maxHeight: 120,
    marginBottom: 10,
  },
  cities: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F3FF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    color: "#005B99",
    fontWeight: "500",
  },
  removeButton: {
    marginLeft: 8,
  },
  noCitiesText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  addCityButton: {
    backgroundColor: "#3e8bffff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  addCityButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 10,
  },
  cityInput: {
    height: 48,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  suggestionList: {
    maxHeight: 200,
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
  dropdown: {
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F9F9F9",
  },
  prefrenceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    backgroundColor: "#F9F9F9",
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  prefrenceTitle: {
    width: "70%",
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  prefrenceSwitch: {
    width: "30%",
  },
});
