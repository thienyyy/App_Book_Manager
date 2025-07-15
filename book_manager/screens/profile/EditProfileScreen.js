import React, { useContext, useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { updateProfile } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const EditProfileScreen = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');

  const handleUpdate = async () => {
    try {
      await updateProfile({ name });
      Alert.alert('Cập nhật thành công');
    } catch (e) {
      Alert.alert('Lỗi cập nhật', e.response?.data?.message || 'Lỗi');
    }
  };

  return (
    <View>
      <TextInput placeholder="Tên" value={name} onChangeText={setName} />
      <Button title="Lưu" onPress={handleUpdate} />
    </View>
  );
};

export default EditProfileScreen;