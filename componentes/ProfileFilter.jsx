import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Dropdown } from "react-native-element-dropdown";

export default function FilterScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [distance, setDistance] = useState(80);
  const [showFurther, setShowFurther] = useState(true);
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [showOutOfRange, setShowOutOfRange] = useState(false);
  const [interested, setInterested] = React.useState(null);

  const CITIES = [
    "Jaipur",
    "Delhi",
    "Udaipur",
    "Jodhpur",
    "Ajmer",
    "Pune",
    "Mumbai",
    "Nagaur",
    "Kota",
    "Bikaner",
    "Kolkata",
    "Ganganagar",
    "South",
    "North",
    "East",
    "West",
  ];

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Transgender (Male)", value: "Transgender (Male)" },
    { label: "Transgender (Female)", value: "Transgender (Female)" },
    { label: "Both", value: "Both" },
  ];

  const handleSelect = (gender) => {
    setSelectedGender(gender);
    setModalVisible(false);
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
              <View style={styles.row}>
                <View style={styles.cities}>
                  {CITIES.map((city, index) => (
                    <Text key={index} style={styles.optionText}>
                      {city}
                    </Text>
                  ))}
                </View>
              </View>
              <TouchableOpacity>
                <Text style={styles.linkText}>Add a new location</Text>
              </TouchableOpacity>
            </View>

            {/* Age Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Age range</Text>
              <Text style={styles.sliderValue}>
                {ageRange[0]} - {ageRange[1]}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={100}
                value={ageRange[1]}
                onValueChange={(value) =>
                  setAgeRange([ageRange[0], Math.round(value)])
                }
                minimumTrackTintColor="#FF3E55"
                maximumTrackTintColor="#D3D3D3"
                thumbTintColor="#FF3E55"
              />
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
                onValueChange={setShowOutOfRange}
                trackColor={{ false: "#D3D3D3", true: "#FF3E55" }}
                thumbColor={showOutOfRange ? "#FFFFFF" : "#FFFFFF"}
              />
            </View>
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
    borderRadius : 8,
    paddingHorizontal :4
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
