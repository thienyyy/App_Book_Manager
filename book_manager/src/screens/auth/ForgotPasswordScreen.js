import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { sendForgotPasswordEmail, resetPassword } from "../../api/auth";

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Nhập email, 2: OTP + newPass
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      return Alert.alert("Thông báo", "Vui lòng nhập email hợp lệ.");
    }
    setLoading(true);
    try {
      await sendForgotPasswordEmail({ email });
      Alert.alert("Thành công", "OTP đã được gửi về email của bạn.");
      setStep(2);
    } catch (e) {
      Alert.alert("Lỗi", e.response?.data?.message || "Gửi OTP thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim() || !newPassword.trim()) {
      return Alert.alert("Thông báo", "Vui lòng nhập đầy đủ OTP và mật khẩu mới.");
    }
    setLoading(true);
    try {
      await resetPassword({ otp, newPassword, email });
      Alert.alert("Thành công", "Mật khẩu đã được đặt lại.");
      navigation.navigate("Login");
    } catch (e) {
      Alert.alert("Lỗi", e.response?.data?.message || "Đặt lại mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.formBox}>
        {step === 1 ? (
          <>
            <Text style={styles.title}>Quên mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Gửi OTP</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Đặt lại mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Mã OTP"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6fc",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f8fafc",
    color: "#222",
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

export default ForgotPasswordScreen;
