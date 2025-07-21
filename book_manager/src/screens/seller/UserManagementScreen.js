import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { Card } from 'react-native-paper';
import { getAllUsers } from '../../api/user';

const BASE_URL = 'http://172.16.40.25:3000'; // 🔁 Đổi theo IP backend thật

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = async (pageNumber = 1) => {
    try {
      if (loading) return;
      setLoading(true);
      const res = await getAllUsers({ page: pageNumber });
      if (pageNumber === 1) {
        setUsers(res.users);
      } else {
        setUsers(prev => [...prev, ...res.users]);
      }
      setTotalPages(res.totalPages);
      setPage(res.page);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers(1);
  };

  const loadMore = () => {
    if (page < totalPages) {
      loadUsers(page + 1);
    }
  };

  const renderUser = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {item.avatar ? (
          <Image
            source={{ uri: `${BASE_URL}/${item.avatar}` }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.placeholder]}>
            <Text style={styles.placeholderText}>👤</Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name || 'No Name'}</Text>
          <Text style={styles.info}>📧 {item.email}</Text>
          <Text style={styles.info}>⚧ Gender: {item.gender || 'N/A'}</Text>
          <Text style={styles.info}>
            🎂 DOB: {item.dob ? new Date(item.dob).toLocaleDateString() : 'N/A'}
          </Text>
          <Text style={styles.info}>🔐 Role: {item.role}</Text>
          <Text style={styles.info}>
            🚫 Status: {item.is_banned ? 'Banned' : 'Active'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  useEffect(() => {
    loadUsers(1);
  }, []);

  return (
    <View style={styles.container}>
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

export default UserManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f7fa',
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  placeholderText: {
    fontSize: 28,
    color: '#666',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
});
