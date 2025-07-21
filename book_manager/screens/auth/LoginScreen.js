import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { loginAPI } from '../../api/auth';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
const handleLogin = async () => {
  if (!email.trim() || !password.trim()) {
    Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ Email và Mật khẩu');
    console.log('[DEBUG] Thiếu email hoặc password');
    return;
  }

  console.log('[DEBUG] Gửi API login với:', { email, password });

  try {
    const res = await loginAPI({ email, password });
    console.log('[DEBUG] API login response:', res.data);
    Alert.alert('Đăng nhập thành công');
    navigation.navigate('Home');
  } catch (e) {
    if (e.response) {
      // Server trả lỗi có response
      console.log('[DEBUG] API login thất bại (response):', e.response.data);
      Alert.alert('Đăng nhập thất bại', e.response.data.message || 'Sai tài khoản hoặc mật khẩu');
    } else if (e.request) {
      // Request đã gửi nhưng không có response
      console.log('[DEBUG] API login thất bại (request sent but no response)');
      Alert.alert('Lỗi mạng', 'Không kết nối được tới server');
    } else {
      // Lỗi khác
      console.log('[DEBUG] API login thất bại (khác):', e.message);
      Alert.alert('Lỗi', e.message);
    }
    if (e.response) {
  Alert.alert('Đăng nhập thất bại', e.response.data.message || 'Sai tài khoản hoặc mật khẩu');
}
  }
};



  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>Đăng nhập</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
          marginBottom: 20,
        }}
      />
      <TouchableOpacity
        style={{ backgroundColor: '#007BFF', padding: 12, borderRadius: 5 }}
        onPress={handleLogin}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={{ color: 'blue', marginTop: 16, textAlign: 'center' }}>
          Chưa có tài khoản? Đăng ký
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
