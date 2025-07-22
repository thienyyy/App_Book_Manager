import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { changePassword } from "../../APi/auth";

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePass = async () => {
    try {
      await changePassword({ currentPassword, newPassword });
      Alert.alert("Đổi mật khẩu thành công");
    } catch (e) {
      Alert.alert("Đổi mật khẩu thất bại", e.response?.data?.message || "Lỗi");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu hiện tại"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="Đổi mật khẩu" onPress={handleChangePass} />
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
});
