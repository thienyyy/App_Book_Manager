// file: screens/profile/ProfileScreen.js
import React, { useEffect, useState } from 'react';
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

const BASE_URL = 'http://172.16.40.35:3000'; // 👉 đổi theo IP backend thật

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const loadProfile = async () => {
  try {
    const res = await getProfile();
    setProfile(res.data);
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
          onPress={() => navigation.navigate('EditProfile', { profile })}
        />
      ),
    });
  }, [navigation, profile]);

  if (loading) {
    return <ActivityIndicator animating size="large" style={{ marginTop: 40 }} />;
  }

  if (!profile) return null;

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {profile.avatar ? (
  <Image
    source={{ uri: `${BASE_URL}/${profile.avatar}` }}
    style={styles.avatar}
  />
) : (
  <View style={[styles.avatar, styles.avatarPlaceholder]}>
    <Text style={styles.avatarText}>
      {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
    </Text>
  </View>
)}

        <Text style={styles.name}>{profile.name || 'Unnamed'}</Text>
        <Text style={styles.role}>Role: {profile.role}</Text>
      </View>

      <Divider style={{ marginVertical: 16 }} />

      <Text style={styles.item}>📧 Email: {profile.email}</Text>
      <Text style={styles.item}>👫 Gender: {profile.gender || 'N/A'}</Text>
      <Text style={styles.item}>🎂 DOB: {profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'}</Text>
      <Text style={styles.item}>
        🔒 Status:{' '}
        <Text style={{ color: profile.is_banned ? '#e53935' : '#43a047' }}>
          {profile.is_banned ? 'Banned' : 'Active'}
        </Text>
      </Text>

      <Button
        mode="contained"
        icon="account-edit"
        onPress={() => navigation.navigate('EditProfile')}
        style={{ marginTop: 24, borderRadius: 8 }}
      >
        Edit Profile
      </Button>
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
