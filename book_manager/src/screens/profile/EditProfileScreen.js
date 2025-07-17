import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getProfile, updateProfile } from '../../api/user';

const BASE_URL = 'http://192.168.2.15:3000'; // 🔁 IP backend

const EditProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    gender: '',
    dob: '',
  });
  const [avatar, setAvatar] = useState(null);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
      setForm({
        name: res.data.name || '',
        email: res.data.email || '',
        gender: res.data.gender || '',
        dob: res.data.dob ? res.data.dob.split('T')[0] : '',
      });
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChooseAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const img = result.assets[0];
      setAvatar({
        uri: img.uri,
        name: img.fileName || 'avatar.jpg',
        type: img.type || 'image/jpeg',
      });
    }
  };

  /*const handleSave = async () => {
    try {
      const data = {
        ...form,
        avatar: avatar
          ? {
              uri: avatar.uri,
              name: avatar.name,
              type: avatar.type,
            }
          : undefined,
      };

      const res = await updateProfile(data);
      Alert.alert('Success', 'Profile updated!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update profile');
    }
  };*/
  const handleSave = async () => {
  try {
    const name = form.name.trim();
    const email = form.email.trim();
    const gender = form.gender.trim().toLowerCase();
    const dob = form.dob.trim();

    // 1. Validate Name
    if (!name) {
      Alert.alert('Validation Error', 'Full name is required.');
      return;
    }

    // 2. Validate Email (đúng định dạng cơ bản)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      Alert.alert('Validation Error', 'Email is required.');
      return;
    } else if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Email format is invalid.');
      return;
    }

    // 3. Validate Gender (cho phép rỗng)
    const allowedGenders = ['male', 'female', ''];
    if (!allowedGenders.includes(gender)) {
      Alert.alert('Validation Error', 'Gender must be "male", "female", or left empty.');
      return;
    }

    // 4. Validate DOB nếu được nhập
    if (dob) {
      // Kiểm tra định dạng YYYY-MM-DD
      const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dobRegex.test(dob)) {
        Alert.alert('Validation Error', 'Date of birth must be in format YYYY-MM-DD.');
        return;
      }

      const dobDate = new Date(dob);
      const now = new Date();
      const isValidDate = !isNaN(dobDate.getTime());

      if (!isValidDate) {
        Alert.alert('Validation Error', 'Date of birth is not a valid date.');
        return;
      }

      if (dobDate > now) {
        Alert.alert('Validation Error', 'Date of birth cannot be in the future.');
        return;
      }

      if (dobDate.getFullYear() < 1900) {
        Alert.alert('Validation Error', 'Date of birth is too far in the past.');
        return;
      }
    }

    // Nếu tất cả hợp lệ thì gửi API
    const data = {
      name,
      email,
      gender,
      dob,
    };

    const res = await updateProfile(data);
    Alert.alert('Success', 'Profile updated successfully!');
    navigation.goBack();
  } catch (err) {
    const errorMsg =
      err?.response?.data?.message ||
      err?.message ||
      'Failed to update profile. Please try again later.';
    Alert.alert('Error', errorMsg);
  }
};


  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleChooseAvatar}>
        {avatar ? (
          <Image source={{ uri: avatar.uri }} style={styles.avatar} />
        ) : profile?.avatar ? (
          <Image source={{ uri: `${BASE_URL}/${profile.avatar}` }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={{ color: '#888' }}>Choose Avatar</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender (male/female)"
        value={form.gender}
        onChangeText={(text) => setForm({ ...form, gender: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={form.dob}
        onChangeText={(text) => setForm({ ...form, dob: text })}
      />

      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
});
