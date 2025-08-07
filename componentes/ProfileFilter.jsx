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

export default function FilterScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [showOutOfRange, setShowOutOfRange] = useState(false);
  const [interested, setInterested] = useState(null);
  const [cities, setCities] = useState([]); // Initially empty
  const [addCityModalVisible, setAddCityModalVisible] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [suggestedCities, setSuggestedCities] = useState([]);
  const [availableCities, setAvailableCities] = useState([]); // Store all available cities for suggestions

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Transgender (Male)", value: "Transgender (Male)" },
    { label: "Transgender (Female)", value: "Transgender (Female)" },
    { label: "Both", value: "Both" },
  ];

  const fetchCities = async () => {
    try {
      const arr = await GetCities();
      const formattedCities = arr.map((c) => ({ label: c.name, value: c.id }));
      setAvailableCities(formattedCities);   
    } catch (e) {
      console.log("Error fetching cities:", e);
    }
  };

  useEffect(() => {
    fetchCities();
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
      console.log("Error saving cities to AsyncStorage:", e);
    }
  };

  const handleCitySelect = (city) => {
    setCityInput("");
    setSuggestedCities([]);
    setAddCityModalVisible(false);
    setCities((prevCities) => {
      const updatedCities = [...prevCities, city];
      console.log("Updated cities list:", updatedCities);
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
              <TouchableOpacity onPress={() => setAddCityModalVisible(true)}>
                <Text style={styles.linkText}>Add a new location</Text>
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
                  console.log("Show verified profiles:", value);
                }}
                trackColor={{ false: "#D3D3D3", true: "#FF3E55" }}
                thumbColor={showOutOfRange ? "#FFFFFF" : "#FFFFFF"}
              />
            </View>
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setAddCityModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add New City</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter city name"
              value={cityInput}
              onChangeText={handleCityInputChange}
            />
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
  dropdown: {
    height: 40,
    width: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  prefrenceContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  prefrenceTitle: {
    width: "70%",
    fontSize: 16,
  },
  prefrenceSwitch: {
    width: "30%",
  },
  cities: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
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
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  optionText: {
    fontSize: 13,
    paddingHorizontal: 8,
    borderRadius: 50,
    paddingVertical: 3,
    backgroundColor: "#06bcee",
    color: "white",
  },
  linkText: {
    color: "#FF3E55",
    fontSize: 14,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderValue: {
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
  },
});
