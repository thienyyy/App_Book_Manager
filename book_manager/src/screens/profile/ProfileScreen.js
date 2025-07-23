import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { Text, Button, Divider, ActivityIndicator } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import { getProfile } from "../../api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const BASE_URL = "exp://172.16.43.89:8081";

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
          style: "cancel",
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
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
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
        <Text style={styles.role}>Vai trò: {userData.role}</Text>
      </View>

      <Divider style={styles.divider} />

      <Text style={styles.item}>📧 Email: {userData.email}</Text>

      <Divider style={styles.divider} />

      <Button
        mode="contained"
        style={styles.btnPrimary}
        onPress={handleChangePassword}
      >
        Đổi mật khẩu
      </Button>
      <Button mode="contained" style={styles.btnLogout} onPress={handleLogout}>
        Đăng xuất
      </Button>
    </View>
  );
};

// 👉 Style đơn giản, dịu mắt
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB", // nền trắng xám dịu
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: "#D1D5DB", // xám nhẹ
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#374151", // xám đậm
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 10,
    color: "#1F2937", // xám đậm hơn
  },
  role: {
    fontSize: 14,
    color: "#6B7280", // xám nhẹ
    marginTop: 4,
  },
  item: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 12,
  },
  divider: {
    marginVertical: 16,
    height: 1,
    backgroundColor: "#E5E7EB", // xám nhạt
  },
  btnPrimary: {
    marginBottom: 10,
    backgroundColor: "#3B82F6", // xanh dương nhẹ
  },
  btnLogout: {
    backgroundColor: "#EF4444", // đỏ dịu
  },
});

export default ProfileScreen;
