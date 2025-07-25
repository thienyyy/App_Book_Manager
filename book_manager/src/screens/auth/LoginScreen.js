import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { loginAPI } from "../../api/auth";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 18,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 18,
    letterSpacing: 1,
  },
  formBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: "#f8fafc",
    color: "#222",
  },
  loginBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 4,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  linkText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginTop: 12,
  },
  logo: {
  width: 250,           
  height: 250,           
  borderRadius: 16,      
  marginBottom: 20,
  resizeMode: 'cover',  
  alignSelf: 'center',  
},
});

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { loadProfile, login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ Email và Mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const res = await loginAPI({ email, password });
      const token = res.data.data.token;
      const userObj = res.data.data.user || res.data.user;
      await AsyncStorage.setItem("authToken", token);
      let profileLoaded = false;
      if (typeof loadProfile === "function") {
        try {
          await loadProfile(userObj);
          profileLoaded = true;
        } catch (_) {}
      }
      if (!profileLoaded && typeof login === "function") {
        await login(token, userObj);
      }
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess();
      }
    } catch (e) {
      Alert.alert("Lỗi", e.response?.data?.message || "Sai tài khoản hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f2f6fc" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Image
          source={require("../../../assets/bia-sach.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Đăng nhập</Text>
        <View style={styles.formBox}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Text>
          </TouchableOpacity>

          {/* Link đăng ký */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: 18 }}
          >
            <Text style={styles.smallText}>
              Chưa có tài khoản? <Text style={styles.linkText}>Đăng ký</Text>
            </Text>
          </TouchableOpacity>

          {/* Link forgot password */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            style={{ marginTop: 12 }}
          >
            <Text style={styles.smallText}>
              <Text style={styles.linkText}>Quên mật khẩu?</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;