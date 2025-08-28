import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
  ActivityIndicator,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ProfilePopup from "../componentes/Profile/ProfilePopup";
import messageIcon from "../assets/photos/message.png";
import { getLikedByMe, getWhoLikedMe } from "../controller/UserController";

const { width } = Dimensions.get("window");
const itemSpacing = 10;
const itemsPerRow = 3;
const totalSpacing = (itemsPerRow + 1) * itemSpacing;
const itemWidth = (width - totalSpacing) / itemsPerRow;

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  const monthDifference = new Date().getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && new Date().getDate() < birthDate.getDate())
  ) {
    return age - 1;
  }
  return age;
};

const LikedByMeTab = ({ openProfile, searchText }) => {
  const [likedByMeData, setLikedByMeData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const didMountRef = useRef(false);

  const fetchLikedByMe = async (pageNum, isRefresh = false) => {
    if (isLoading || (!hasMore && !isRefresh)) return;

    isRefresh ? setIsRefreshing(true) : setIsLoading(true);

    const data = await getLikedByMe(pageNum); 
    const validData = data.filter(
      (item) => item && item.user_id && item.username && item.images
    );
    setLikedByMeData((prev) =>
      isRefresh ? validData : [...prev, ...validData]
    );
    setHasMore(data.length > 0);
    setIsLoading(false); 
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (!didMountRef.current) {
      fetchLikedByMe(1, true);
      didMountRef.current = true;
    }
  }, []);

  const onRefresh = () => {
    setPage(1);
    fetchLikedByMe(1, true);
  };

  const filteredLikedByMe = likedByMeData.filter((match) =>
    match?.username?.toLowerCase().includes(searchText.toLowerCase())
  );
 

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLikedByMe(nextPage);
    }
  };

  const renderFooter = () => {
    if (isLoading) {
      return (
        <ActivityIndicator size="large" color="black" style={styles.loader} />
      );
    }
    if (!hasMore && filteredLikedByMe.length > 0) {
      return <Text style={styles.noDataText}>No more data</Text>;
    }
    return null;
  };

  const renderLikedByMeItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.matchItem, { width: itemWidth }]}
      onPress={() => openProfile(item)}
    >
      <Image source={{ uri: item.images }} style={styles.matchImage} />
      <Text style={styles.matchName}>
        {item.username?.split(" ")[0] || "Unknown"},{" "}
        {item.dob ? calculateAge(item.dob) : "N/A"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={filteredLikedByMe}
      renderItem={renderLikedByMeItem}
      keyExtractor={(item) => item.user_id.toString()}
      numColumns={itemsPerRow}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={false}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );
};

const WhoLikedMeTab = ({ openProfile, searchText }) => {
  const [whoLikedMeData, setWhoLikedMeData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const didMountRef = useRef(false);

  const fetchWhoLikedMe = async (pageNum, isRefresh = false) => {
    if (isLoading || (!hasMore && !isRefresh)) return;

    isRefresh ? setIsRefreshing(true) : setIsLoading(true);

    const data = await getWhoLikedMe(pageNum);
    const validData = data.filter(
      (item) => item && item.user_id && item.username && item.images
    );
    setWhoLikedMeData((prev) =>
      isRefresh ? validData : [...prev, ...validData]
    );
    setHasMore(data.length > 0);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (!didMountRef.current) {
      fetchWhoLikedMe(1, true);
      didMountRef.current = true;
    }
  }, []);

  const onRefresh = () => {
    setPage(1);
    fetchWhoLikedMe(1, true);
  };

  const filteredWhoLikedMe = whoLikedMeData.filter((item) =>
    item?.username?.toLowerCase().includes(searchText.toLowerCase())
  );

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchWhoLikedMe(nextPage);
    }
  };

  const renderFooter = () => {
    if (isLoading) {
      return (
        <ActivityIndicator size="large" color="black" style={styles.loader} />
      );
    }
    if (!hasMore && filteredWhoLikedMe.length > 0) {
      return <Text style={styles.noDataText}>No more data</Text>;
    }
    return null;
  };

  const renderLikedItem = ({ item }) => (
    <View style={styles.likedItem}>
      <TouchableOpacity onPress={() => openProfile(item)}>
        <Image source={{ uri: item.images }} style={styles.likedImage} />
      </TouchableOpacity>
      <View style={styles.likedInfo}>
        <Text style={styles.likedName}>{item.username || "Unknown"}</Text>
        <Text style={styles.likedDetail}>
          Age: {item.dob ? calculateAge(item.dob) : "N/A"} • 📍
          {item.city || "Unknown"}
        </Text>
      </View>
      <Pressable>
        <Image
          alt="message"
          source={messageIcon}
          style={{ width: 40, height: 40 }}
        />
      </Pressable>
    </View>
  );

  return (
    <FlatList
      data={filteredWhoLikedMe}
      renderItem={renderLikedItem}
      keyExtractor={(item) => item.user_id.toString()}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );
};

const MyMatches = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "likedByMe", title: "Liked By Me" },
    { key: "whoLikedMe", title: "Who Liked Me" },
  ]);

  const openProfile = useCallback((match) => {
    setSelectedMatch(match);
    setModalVisible(true);
  }, []);

  const closeProfile = () => {
    setModalVisible(false);
    setSelectedMatch(null);
  };

  const renderScene = useMemo(
    () =>
      SceneMap({
        likedByMe: () => (
          <LikedByMeTab openProfile={openProfile} searchText={searchText} />
        ),
        whoLikedMe: () => (
          <WhoLikedMeTab openProfile={openProfile} searchText={searchText} />
        ),
      }),
    [searchText]
  );

  return (
    <ImageBackground
      source={require("../assets/photos/app-bg-7.jpg")}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Matches</Text>
        <View style={styles.searchContainer}>
          {/* Add search input if needed */}
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
        onClose={closeProfile}
        user_id={selectedMatch?.user_id}
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
  loader: {
    marginVertical: 20,
  },
  noDataText: {
    textAlign: "center",
    padding: 10,
    color: "#888",
  },
});

export default MyMatches;
