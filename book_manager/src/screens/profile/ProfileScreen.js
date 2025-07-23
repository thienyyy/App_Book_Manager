import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import {
  Text,
  IconButton,
  ActivityIndicator,
  Divider,
  Button,
} from 'react-native-paper';
import { getProfile } from '../../api/user';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';

const BASE_URL = 'http://172.16.43.89:3000'; // 👉 đổi theo IP backend thật

const ProfileScreen = () => {
  const [ user, setUser ] = useState({});
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const loadProfile = async () => {
    try {
      const data = await getProfile(); // lấy profile từ API
      console.log(data);
      
      setUser(data); // cập nhật vào context (nếu cần chia sẻ toàn app)

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load profile';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) loadProfile();
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="account-edit"
          size={24}
          onPress={() => navigation.navigate('EditProfile')}
        />
      ),
    });
  }, [navigation]);

  if (loading) {
    return <ActivityIndicator animating size="large" style={{ marginTop: 40 }} />;
  }

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {user.avatar ? (
          <Image
            source={{ uri: `${BASE_URL}/${user.avatar}` }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
        )}

        <Text style={styles.name}>{user.name || 'Unnamed'}</Text>
        <Text style={styles.role}>Role: {user.role}</Text>
      </View>

      <Divider style={{ marginVertical: 16 }} />

      <Text style={styles.item}>📧 Email: {user.email}</Text>
      <Text style={styles.item}>👫 Gender: {user.gender || 'N/A'}</Text>
      <Text style={styles.item}>🎂 DOB: {user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</Text>
      <Text style={styles.item}>
        🔒 Status:{' '}
        <Text style={{ color: user.is_banned ? '#e53935' : '#43a047' }}>
          {user.is_banned ? 'Banned' : 'Active'}
        </Text>
      </Text>

    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    backgroundColor: '#cfcfcf',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    color: '#555',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  role: {
    fontSize: 14,
    color: '#888',
  },
  item: {
    fontSize: 16,
    marginBottom: 12,
  },
});
