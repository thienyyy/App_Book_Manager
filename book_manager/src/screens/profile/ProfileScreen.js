import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../../../context/AuthContext';

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);

  return (
    <View>
      <Text>Email: {user?.email}</Text>
      <Text>Role: {user?.role}</Text>
    </View>
  );
};

export default ProfileScreen;
