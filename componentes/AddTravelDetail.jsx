import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GetCities, postTravelDetails } from "../controller/UserController";
import { ErrorPopup, SuccessPopup2 } from "./Popups";

const AddTravelDetail = ({ onDetailAdded }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [travelType, setTravelType] = useState("Between cities");

  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);
  const [city, setCity] = useState(null);

  const [description, setDescription] = useState("");
  const [cityList, setCityList] = useState([]);

  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const fetchCities = async () => {
    try {
      const arr = await GetCities();
      setCityList(arr.map((c) => ({ label: c.name, value: c.id })));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  const getCityLabelById = (id) =>
    cityList.find((item) => item.value === id)?.label || "";

  const handleSubmit = async () => {
    // Prevent submission while loading
    if (loading) {
      return;
    }

    if (
      travelType === "Between cities" &&
      (!fromCity || !toCity || !selectedDate || !description)
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (
      travelType === "Particular city" &&
      (!city || !selectedDate || !description)
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Map travelType to the desired format before submitting
    const mappedTravelType =
      travelType === "Between cities" ? "between_cities" : "city";

    const data = {
      travel_type: mappedTravelType, // Use mapped value
      from_city:
        mappedTravelType === "between_cities"
          ? getCityLabelById(fromCity)
          : null,
      to_city:
        mappedTravelType === "between_cities"
          ? getCityLabelById(toCity)
          : getCityLabelById(city),
      travel_date: selectedDate.toISOString().split("T")[0],
      description,
    };

    setLoading(true); // Set loading to true while making the API call

    try {
      // Call API
      await postTravelDetails(data);
      setSuccess(true);
      setError("");
    } catch (error) {
      console.log(error.response?.data);
      setError(error?.response?.data?.message || "Error! Please try again.");
    } finally {
      setLoading(false); // Reset loading state after submission
    }

    // Reset all fields after submission
    setFromCity(null);
    setToCity(null);
    setCity(null);
    setSelectedDate(null);
    setDescription("");
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
        disabled={loading} // Disable when loading
      >
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add Travel Details</Text>

                <View style={styles.travelTypeContainer}>
                  {["Between cities", "Particular city"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.travelTypeButton,
                        travelType === type && styles.travelTypeButtonActive,
                      ]}
                      onPress={() => setTravelType(type)}
                      disabled={loading} // Disable when loading
                    >
                      <Text
                        style={[
                          styles.travelTypeText,
                          travelType === type && styles.travelTypeTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {travelType === "Between cities" ? (
                  <>
                    <DropDownPicker
                      open={fromOpen}
                      value={fromCity}
                      items={cityList}
                      setOpen={setFromOpen}
                      setValue={setFromCity}
                      setItems={setCityList}
                      searchable
                      placeholder="From City"
                      zIndex={7000}
                      zIndexInverse={1000}
                      style={styles.dropdown}
                      disabled={loading} // Disable when loading
                    />
                    <DropDownPicker
                      open={toOpen}
                      value={toCity}
                      items={cityList}
                      setOpen={setToOpen}
                      setValue={setToCity}
                      setItems={setCityList}
                      searchable
                      placeholder="To City"
                      zIndex={6000}
                      zIndexInverse={900}
                      style={styles.dropdown}
                      disabled={loading} // Disable when loading
                    />
                  </>
                ) : (
                  <DropDownPicker
                    open={cityOpen}
                    value={city}
                    items={cityList}
                    setOpen={setCityOpen}
                    setValue={setCity}
                    setItems={setCityList}
                    searchable
                    placeholder="City"
                    zIndex={5000}
                    zIndexInverse={800}
                    style={styles.dropdown}
                    disabled={loading} // Disable when loading
                  />
                )}

                <TouchableOpacity
                  onPress={() => setDatePickerVisibility(true)}
                  style={styles.input}
                  disabled={loading} // Disable when loading
                >
                  <Text>
                    {selectedDate
                      ? selectedDate.toISOString().split("T")[0]
                      : "Select a Date"}
                  </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleDateConfirm}
                  onCancel={() => setDatePickerVisibility(false)}
                  minimumDate={new Date()}
                />

                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  placeholder="Description"
                  placeholderTextColor="#999"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  editable={!loading} // Disable when loading
                />

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  disabled={loading} // Disable when loading
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsModalVisible(false)}
                  disabled={loading} // Disable when loading
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {error && <ErrorPopup error={error} onClose={() => setError("")} />}
      {success && (
        <SuccessPopup2
          onClose={() => {
            setSuccess(false);
            onDetailAdded();
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#FF5555",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "95%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  dropdown: {
    marginBottom: 10,
    zIndex: 5000,
  },
  travelTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  travelTypeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    marginHorizontal: 5,
    alignItems: "center",
  },
  travelTypeButtonActive: {
    backgroundColor: "#FF5555",
    borderColor: "#FF5555",
  },
  travelTypeText: {
    fontSize: 16,
    color: "#333",
  },
  travelTypeTextActive: {
    color: "#FFF",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#FF5555",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FF5555",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default AddTravelDetail;
