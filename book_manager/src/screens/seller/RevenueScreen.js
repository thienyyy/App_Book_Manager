// src/screens/seller/RevenueScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getRevenue } from '../../api/revenue';
import { Card } from 'react-native-paper';
import formatCurrency from '../../utils/formatCurrency';


const RevenueScreen = () => {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadRevenue = async () => {
    try {
      setLoading(true);
      const data = await getRevenue();
      setRevenue(data);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to fetch revenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
  }, []);

  if (loading || !revenue) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Total Books Sold</Text>
          <Text style={styles.value}>{revenue.totalBooksSold}</Text>

          <Text style={styles.label}>Total Revenue</Text>
          <Text style={styles.value}>{formatCurrency(revenue.totalRevenue)}</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

export default RevenueScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 12,
    borderRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    marginTop: 8,
    color: '#555',
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
});
