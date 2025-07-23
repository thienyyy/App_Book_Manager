import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import api from "../../APi/url";

export default function ChangePasswordScreen({ navigation }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    return true;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await api.put("/users/me/password", {
        currentPassword: oldPassword,
        newPassword: newPassword,
      });
      Alert.alert("Thành công", "Mật khẩu đã được thay đổi");
      navigation.goBack();
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err.response || err.message);
      Alert.alert(
        "Lỗi",
        err.response?.data?.message || "Đổi mật khẩu thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đổi mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu hiện tại"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới (ít nhất 8 ký tự)"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu mới"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleChangePassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
