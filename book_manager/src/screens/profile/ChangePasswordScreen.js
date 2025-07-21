import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { changePassword } from '../../../api/auth';

const ChangePasswordScreen = () => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleChangePass = async () => {
    try {
      await changePassword({ oldPass, newPass });
      Alert.alert('Đổi mật khẩu thành công');
    } catch (e) {
      Alert.alert('Đổi mật khẩu thất bại', e.response?.data?.message || 'Lỗi');
    }
  };

  return (
    <View>
      <TextInput placeholder="Mật khẩu cũ" secureTextEntry value={oldPass} onChangeText={setOldPass} />
      <TextInput placeholder="Mật khẩu mới" secureTextEntry value={newPass} onChangeText={setNewPass} />
      <Button title="Đổi mật khẩu" onPress={handleChangePass} />
    </View>
  );
};

export default ChangePasswordScreen;

