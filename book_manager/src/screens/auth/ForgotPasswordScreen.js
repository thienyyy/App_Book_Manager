import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { sendForgotPasswordEmail, resetPassword } from "../../APi/auth";

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP + newPass
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      return Alert.alert("Lỗi", "Vui lòng nhập email");
    }
    setLoading(true);
    try {
      await sendForgotPasswordEmail({ email });
      Alert.alert("Thành công", "OTP đã được gửi đến email của bạn");
      setStep(2);
    } catch (e) {
      Alert.alert("Lỗi", e.response?.data?.message || "Không thể gửi OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      return Alert.alert("Lỗi", "Vui lòng nhập đầy đủ OTP và mật khẩu mới");
    }
    setLoading(true);
    try {
      await resetPassword({ otp, newPassword, email });
      Alert.alert("Thành công", "Mật khẩu đã được đặt lại");
      navigation.navigate("Login"); // Sau khi reset thành công quay về Login
    } catch (e) {
      Alert.alert(
        "Lỗi",
        e.response?.data?.message || "Không thể đặt lại mật khẩu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nhập email của bạn"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Button
            title={loading ? "Đang gửi..." : "Gửi OTP"}
            onPress={handleSendOTP}
            disabled={loading}
          />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nhập mã OTP"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Button
            title={loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
            onPress={handleResetPassword}
            disabled={loading}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});

export default ForgotPasswordScreen;
