import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.75; // 75% of screen width

const SideNavBar = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? -SIDEBAR_WIDTH : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "Profile", icon: "person", link: "Start" },
    { name: "Settings", icon: "settings-outline", link: "Start" },
    { name: "Contact us", icon: "call-outline", link: "Start" },
  ];

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate("Start");
  };

  return (
    <>
      {/* Toggle Button */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleSidebar}>
        <Ionicons name="menu-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Sidebar */}
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        {/* User Info */}
        {/* <View style={styles.userInfo}>
          <Ionicons name="person-circle-outline" size={55} color="#4a90e2" />
          <View>
            <Text style={styles.userId}>Tarun Soni</Text>
            <Text style={styles.subId}>+91-8690708302</Text>
          </View>
        </View> */}

        <Text style={styles.logo}>ForThose</Text>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <TouchableOpacity
            onPress={() => navigation.navigate(item.link)}
            key={index}
            style={styles.menuItem}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color="#666"
              style={styles.icon}
            />
            <Text style={styles.menuText}>{item.name}</Text>
            {item.name === "Contact us" && (
              <Text style={styles.contactNumber}>0120-7102028</Text>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.menuItem,
            { backgroundColor: "#ff6b6b", borderRadius: 6, marginTop: 50 },
          ]}
        >
          <View
            style={[
              styles.menuText,
              {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              },
            ]}
          >
            <Text
              style={{
                marginLeft: 10,
                color: "white",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              Logout
            </Text>
            <Ionicons
              name="log-out-outline"
              size={24}
              color="white"
              style={{ fontWeight: 800 }}
            />
          </View>
        </TouchableOpacity>

        {/* Social Icons */}
        <View style={styles.socialContainer}>
          <Text style={styles.socialHeader}>Connect with us</Text>
          <View style={styles.socialIcons}>
            {[
              "logo-facebook",
              "logo-twitter",
              "logo-instagram",
              "logo-youtube",
              "logo-whatsapp",
            ].map((icon, index) => (
              <Ionicons
                key={index}
                name={icon}
                size={30}
                color="#666"
                style={styles.socialIcon}
              />
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Real11 v1.0.103 | Made in India</Text>
      </Animated.View>

      {/* Overlay */}
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={toggleSidebar}
          activeOpacity={1}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    position: "absolute",
    top: 35,
    left: 20,
    zIndex: 1000,
  },
  logo: {
    fontSize: 24,
    fontWeight: 700,
    borderBottomWidth : 2,
    paddingBottom : 10
  },
  sidebar: {
    position: "absolute",
    top: 80,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: height,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  userInfo: {
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  userId: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subId: {
    fontSize: 14,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  contactNumber: {
    marginLeft: "auto",
    color: "#4a90e2",
    fontSize: 14,
  },
  socialContainer: {
    marginTop: 20,
  },
  socialHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  socialIcon: {
    marginRight: 15,
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    fontSize: 12,
    color: "#666",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 998,
  },
});

export default SideNavBar;
