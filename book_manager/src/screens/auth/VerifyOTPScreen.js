import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "../../APi/axiosInstance";

const VerifyOTPScreen = () => {
  const [otp, setOtp] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert("Lỗi", "Vui lòng nhập OTP");
      return;
    }

    try {
      const response = await axios.post("/auth/verify-email", { email, otp });
      if (response.data.success) {
        Alert.alert("Thành công", "Xác minh email thành công");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log("[DEBUG] Verify OTP Error", error);
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể xác minh OTP"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác minh OTP</Text>

      <Text style={styles.label}>Mã OTP đã gửi đến email:</Text>
      <Text style={styles.email}>{email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập mã OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Xác minh</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerifyOTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
