import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TextInput,
} from "react-native";
import { matches } from "../assets/Data/Matches"; 
import ProfilePopup from "../componentes/ProfilePopup";

const { width } = Dimensions.get("window");
const itemSpacing = 10;
const itemsPerRow = 4;
const totalSpacing = (itemsPerRow + 1) * itemSpacing;
const itemWidth = (width - totalSpacing) / itemsPerRow;

const MyMatches = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const filteredMatches = matches.filter((match) =>
    match.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const openProfile = (match) => {
    setSelectedMatch(match);
    setModalVisible(true);
  };

  const closeProfile = () => {
    setModalVisible(false);
    setSelectedMatch(null);
  };

  const renderMatchItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.matchItem, { width: itemWidth }]}
      onPress={() => openProfile(item)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.matchImage} />
      <Text style={styles.matchName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../assets/photos/app-bg-7.jpg")}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Matches</Text>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search matches..."
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
        </View>
      </View>

      <FlatList
        data={filteredMatches}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
        numColumns={itemsPerRow}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Modular Popup */}
      <ProfilePopup
        isVisible={isModalVisible}
        match={selectedMatch}
        onClose={closeProfile}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: "#FF5555",
    padding: 20,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  searchContainer: { marginTop: 10 },
  searchInput: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  gridContainer: {
    paddingHorizontal: itemSpacing,
    paddingVertical: 15,
  },
  matchItem: {
    alignItems: "center",
    margin: itemSpacing / 2,
    borderRadius: 12,
    padding: 6,
    backgroundColor: "#fff",
    elevation: 3,
  },
  matchImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 4,
  },
  matchName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});

export default MyMatches;
