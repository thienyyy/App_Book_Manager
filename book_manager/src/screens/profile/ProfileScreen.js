import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { Text, Button, Divider, ActivityIndicator } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import { getProfile } from "../../APi/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const BASE_URL = "http://192.168.75.1:3000";

const ProfileScreen = ({ rootNavigation }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(AuthContext);
  const navigation = useNavigation(); // Ensure this is called within the component

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        setUserData(res.data);
      } catch (err) {
        console.log("Lỗi load profile:", err.message);
        if (err.response?.status === 401) {
          await AsyncStorage.removeItem("authToken");
          setUser(null);
          navigation.reset({
            index: 0,
            routes: [{ name: "Auth" }],
          });
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      console.log("Logout initiated - Token removed");
      if (rootNavigation) {
        rootNavigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
        Alert.alert("Thông báo", "Đăng xuất thành công");
      } else {
        console.log("rootNavigation is undefined - Check prop passing");
      }
    } catch (error) {
      console.log("Error during logout:", error);
      Alert.alert("Lỗi", "Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <ActivityIndicator animating size="large" style={{ marginTop: 40 }} />
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {userData.avatar ? (
          <Image
            source={{ uri: `${BASE_URL}/${userData.avatar}` }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {userData.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.role}>Role: {userData.role}</Text>
      </View>

      <Divider style={{ marginVertical: 16 }} />

      <Text style={styles.item}>📧 Email: {userData.email}</Text>

      <Divider style={{ marginVertical: 16 }} />

      {/* <Button
        mode="contained"
        style={{ marginBottom: 10 }}
        onPress={() => navigation("ChangePassword")}
      >
        Đổi mật khẩu
      </Button> */}
      {/* <Button mode="contained" color="red" onPress={handleLogout}>
        Đăng xuất
      </Button> */}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  avatarWrapper: { alignItems: "center", marginBottom: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 36, fontWeight: "bold" },
  name: { fontSize: 20, fontWeight: "bold", marginTop: 8 },
  role: { fontSize: 14, color: "#888" },
  item: { fontSize: 16, marginBottom: 12 },
});
