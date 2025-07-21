import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 18 }}>🏠 Xin chào, {user?.name || 'User'}!</Text>
      <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
        Email: {user?.email || 'N/A'}
      </Text>
      <Text style={{ fontSize: 16, color: '#333', marginBottom: 10 }}>
        Role: {user?.role || 'user'}
      </Text>
      <Text style={{ fontSize: 16, color: '#333', marginBottom: 40 }}>
        Đây là trang Home dành cho người dùng!
      </Text>

      <TouchableOpacity
        style={{ backgroundColor: '#FF3B30', padding: 12, borderRadius: 5 }}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Quay về Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
