import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>🏠 Home Screen</Text>
      <Text style={{ fontSize: 16, color: '#333', marginBottom: 40 }}>
        Đây là màn hình Home — điều hướng thành công!
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
