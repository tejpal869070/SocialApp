import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";

const UpdateProfileDetails = ({ visible, onClose }) => {
  const [slideAnim] = useState(new Animated.Value(500));
  const [zodiac, setZodiac] = useState("");
  const [education, setEducation] = useState([]);
  const [children, setChildren] = useState("");
  const [vaccinated, setVaccinated] = useState("");
  const [personality, setPersonality] = useState([]);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleSave = () => {
    console.log("Zodiac:", zodiac);
    console.log("Education:", education);
    console.log("Children:", children);
    console.log("Vaccinated:", vaccinated);
    console.log("Personality:", personality);
    onClose();
  };

  const zodiacSigns = [
    "Capricorn",
    "Aquarius",
    "Pisces",
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
  ];
  const educationLevels = [
    "Bachelors",
    "In College",
    "High School",
    "PhD",
    "In Grad School",
    "Masters",
    "Trade School",
  ];
  const childrenOptions = [
    "I want children",
    "I don't want children",
    "I have children and want more",
    "I have children and don't want more",
    "Not sure yet",
  ];
  const vaccinationOptions = [
    "Vaccinated",
    "Unvaccinated",
    "Prefer not to say",
  ];

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[styles.popup, { transform: [{ translateY: slideAnim }] }]}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                  <Text style={styles.title}>Update Profile</Text>
                  <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButton}>×</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>What is your zodiac sign?</Text>
                <View style={styles.inputContainer}>
                  {zodiacSigns.map((sign) => (
                    <TouchableOpacity
                      key={sign}
                      onPress={() => setZodiac(sign)}
                      style={[
                        styles.option,
                        zodiac === sign && styles.selected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          zodiac === sign && styles.selectedoptionText,
                        ]}
                      >
                        {sign}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>What is your education level?</Text>
                <View style={styles.inputContainer}>
                  {educationLevels.map((level) => {
                    const isSelected = education.includes(level);
                    return (
                      <TouchableOpacity
                        key={level}
                        onPress={() => {
                          setEducation((prev) =>
                            prev.includes(level)
                              ? prev.filter((l) => l !== level)
                              : [...prev, level]
                          );
                        }}
                        style={[styles.option, isSelected && styles.selected]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.selectedoptionText,
                          ]}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.label}>Do you want children?</Text>
                <View style={styles.inputContainer}>
                  {childrenOptions.map((option) => {
                    const isSelected = children === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setChildren(option)}
                        style={[styles.option, isSelected && styles.selected]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.selectedoptionText,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.label}>Are you vaccinated?</Text>
                <View style={styles.inputContainer}>
                  {vaccinationOptions.map((option) => {
                    const isSelected = vaccinated === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setVaccinated(option)}
                        style={[styles.option, isSelected && styles.selected]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.selectedoptionText,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  closeButton: {
    fontSize: 28,
    color: "black",
  },
  popup: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 6,
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 6,
    borderColor: "#c7c7c7",
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 85,
    marginVertical: 5,
  },
  optionText: {
    fontSize: 14,
  },
  selectedoptionText: {
    color: "white",
    fontWeight: 600,
  },
  selected: {
    fontSize: 14,
    color: "red",
    backgroundColor: "#1DA1F2",
    borderRadius: 85,
  },
  saveButton: {
    backgroundColor: "#1DA1F2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UpdateProfileDetails;
