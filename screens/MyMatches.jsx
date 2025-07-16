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
  Pressable,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { matches, whoLikedMeData } from "../assets/Data/Matches";
import ProfilePopup from "../componentes/Profile/ProfilePopup";
import messageIcon from "../assets/photos/message.png";

const { width } = Dimensions.get("window");
const itemSpacing = 10;
const itemsPerRow = 3;
const totalSpacing = (itemsPerRow + 1) * itemSpacing;
const itemWidth = (width - totalSpacing) / itemsPerRow;

const MatchesTab = ({ openProfile, searchText }) => {
  const filteredMatches = matches.filter((match) =>
    match.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderMatchItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.matchItem, { width: itemWidth }]}
      onPress={() => openProfile(item)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.matchImage} />
      <Text style={styles.matchName}>
        {item.name}, {item.age}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={filteredMatches}
      renderItem={renderMatchItem}
      keyExtractor={(item) => item.id}
      numColumns={itemsPerRow}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const WhoLikedMeTab = ({ openProfile, searchText }) => {
  const likedMatches = whoLikedMeData.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderLikedItem = ({ item }) => (
    <View style={styles.likedItem}>
      <TouchableOpacity onPress={() => openProfile(item)}>
        <Image source={{ uri: item.images[0] }} style={styles.likedImage} />
      </TouchableOpacity>
      <View style={styles.likedInfo}>
        <Text style={styles.likedName}>{item.name}</Text>
        <Text style={styles.likedDetail}>
          Age: {item.age} • 📍{item.city}
        </Text>
      </View>
      <Pressable>
        <Image
          alt="sd"
          source={messageIcon}
          style={{ width: 40, height: 40 }}
        />
      </Pressable>
    </View>
  );

  return (
    <FlatList
      data={likedMatches}
      renderItem={renderLikedItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const MyMatches = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "matches", title: "All Matches" },
    { key: "whoLikedMe", title: "Who Liked Me" },
  ]);

  const openProfile = (match) => {
    setSelectedMatch(match);
    setModalVisible(true);
  };

  const closeProfile = () => {
    setModalVisible(false);
    setSelectedMatch(null);
  };

  const renderScene = SceneMap({
    matches: () => (
      <MatchesTab openProfile={openProfile} searchText={searchText} />
    ),
    whoLikedMe: () => (
      <WhoLikedMeTab openProfile={openProfile} searchText={searchText} />
    ),
  });

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

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
            indicatorStyle={styles.tabIndicator}
          />
        )}
      />

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
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  matchItem: {
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
    fontStyle: "italic",
  },
  likedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  likedImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  likedInfo: {
    flex: 1,
  },
  likedName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    fontStyle: "italic",
  },
  likedDetail: {
    fontSize: 14,
    color: "#666",
  },
  tabBar: {
    backgroundColor: "black",
    elevation: 2,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  tabIndicator: {
    backgroundColor: "white",
    height: 2,
  },
});

export default MyMatches;
