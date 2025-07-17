import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { getRevenueOverview } from '../../api/revenue';

const RevenueScreen = () => {
  const [revenue, setRevenue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const res = await getRevenueOverview();

      if (res.success && typeof res.totalRevenue === 'number') {
        setRevenue(res.totalRevenue);
        setOrders(res.orders || []);
      } else {
        Alert.alert('Error', 'Invalid response format from server.');
      }
    } catch (error) {
      console.error('Revenue error:', error);
      Alert.alert('Error', 'Failed to load revenue data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchRevenue();
    } catch (err) {
      Alert.alert('Error', 'Could not refresh revenue data.');
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.bookTitle}>{item.bookTitle || 'Unknown Book'}</Text>
      <Text style={styles.text}>Buyer: {item.buyerName || 'N/A'}</Text>
      <Text style={styles.text}>Price: ${item.price?.toFixed(2) || '0.00'}</Text>
      <Text style={styles.text}>Quantity: {item.quantity || 0}</Text>
      <Text style={styles.text}>
        Date: {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Revenue</Text>
        <Text style={styles.summaryValue}>${revenue.toFixed(2)}</Text>
      </View>

      <Text style={styles.orderTitle}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No orders found.</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007bff']} />
        }
      />
    </View>
  );
};

export default RevenueScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f5',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: '#007bff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  summaryValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#007bff',
  },
  text: {
    fontSize: 14,
    color: '#555',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});
