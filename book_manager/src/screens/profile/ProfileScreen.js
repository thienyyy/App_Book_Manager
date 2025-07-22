import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { Text, Button, Divider, ActivityIndicator } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import { getProfile } from "../../api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const BASE_URL = "http://172.16.40.25:3000";

const ProfileScreen = ({ onLogout }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const { logout, setUser } = useContext(AuthContext);
  const navigation = useNavigation();

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

 const handleLogout = () => {
  Alert.alert(
    "Xác nhận đăng xuất",
    "Bạn có chắc chắn muốn đăng xuất?",
    [
      {
        text: "Không",
        style: "cancel"
      },
      {
        text: "Có",
        onPress: async () => {
          try {
            await logout();
            if (onLogout) onLogout();
          } catch (error) {
            console.log("Lỗi khi logout:", error);
            Alert.alert("Lỗi", "Đăng xuất thất bại. Vui lòng thử lại.");
          }
        }
      }
    ],
    { cancelable: true }
  );
};


  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  if (loading) {
    return <ActivityIndicator animating size="large" style={{ marginTop: 40 }} />;
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

      <Button
        mode="contained"
        style={{ marginBottom: 10 }}
        onPress={handleChangePassword}
      >
        Đổi mật khẩu
      </Button>
      <Button mode="contained" buttonColor="red" onPress={handleLogout}>
        Đăng xuất
      </Button>
    </View>
  );

};
const validate = () => {
  if (!oldPassword || !newPassword || !confirmPassword) {
    Alert.alert("Lỗi", "Vui lòng nhập đầy đủ các trường");
    return false;
  }
  if (newPassword.length < 8) {
    Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 8 ký tự");
    return false;
  }
  if (newPassword !== confirmPassword) {
    Alert.alert("Lỗi", "Xác nhận mật khẩu không khớp");
    return false;
  }
  if (newPassword === oldPassword) {
    Alert.alert("Lỗi", "Mật khẩu mới không được trùng mật khẩu hiện tại");
    return false;
  }
  return true;
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
