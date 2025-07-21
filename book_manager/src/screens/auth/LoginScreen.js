import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Image, StyleSheet, Platform } from "react-native";
import { loginAPI } from "../../../api/auth";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../../../context/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 18,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
    letterSpacing: 1,
  },
  formBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    color: '#222',
  },
  loginBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  registerText: {
    color: '#444',
    textAlign: 'center',
    fontSize: 15,
  },
});

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { loadProfile, user, login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ Email và Mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const res = await loginAPI({ email, password });
      console.log("[DEBUG] Đăng nhập thành công:", res.data);
      const token = res.data.data.token;
      const userObj = res.data.data.user || res.data.user;
      await AsyncStorage.setItem("authToken", token); // Lưu token vào AsyncStorage
      let profileLoaded = false;
      if (typeof loadProfile === 'function') {
        try {
          await loadProfile(userObj);
          profileLoaded = true;
        } catch (err) {
          console.log('[DEBUG] loadProfile thất bại, sẽ dùng user từ login:', err.message);
        }
      }
      if (!profileLoaded && typeof login === 'function') {
        await login(token, userObj);
      }
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess();
      }
    } catch (e) {
      if (e.response) {
        Alert.alert(
          "Đăng nhập thất bại",
          e.response.data.message || "Sai tài khoản hoặc mật khẩu"
        );
      } else if (e.request) {
        Alert.alert("Lỗi mạng", "Không thể kết nối đến server");
      } else {
        Alert.alert("Lỗi", e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f2f6fc' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Image
          source={require('../../../assets/icon.png')}
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
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8} disabled={loading}>
            <Text style={styles.loginText}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}
            style={{ marginTop: 18 }}>
            <Text style={styles.registerText}>
              Chưa có tài khoản? <Text style={{ color: '#007bff', fontWeight: 'bold' }}>Đăng ký</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
