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

const { width } = Dimensions.get("window");
const itemSpacing = 10; // Margin between items
const itemsPerRow = 4;
const totalSpacing = (itemsPerRow + 1) * itemSpacing; // Total spacing per row (including left and right)
const itemWidth = (width - totalSpacing) / itemsPerRow; // Calculate width for each item

const MyMatches = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  // Filter matches based on search text
  const filteredMatches = matches.filter((match) =>
    match.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderMatchItem = ({ item }) => (
    <TouchableOpacity style={[styles.matchItem, { width: itemWidth }]}>
      <Image source={{ uri: item.image }} style={styles.matchImage} />
      <Text style={styles.matchName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../assets/photos/app-bg-3.jpg")}
      style={styles.container}
    >
      {/* Header */}
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
      {/* Search Field */}

      {/* Matches Grid */}
      <FlatList
        data={filteredMatches}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
        numColumns={itemsPerRow} // 3 items per row
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#1F2A44",
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  searchContainer: {
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
    elevation: 2,
  },
  gridContainer: {
    paddingHorizontal: itemSpacing,
    paddingVertical: 15,
  },
  matchItem: {
    alignItems: "center",
    margin: itemSpacing / 2, // Half the spacing for each side
    borderRadius: 15,
    padding: 10,
    backgroundColor: "#ffffffcc",
    // elevation: 3,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
  },
  matchImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1, // Ensure square image
    borderRadius: 50, // Half of the width for a circular image
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#FF5555",
  },
  matchName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});

export default MyMatches;
