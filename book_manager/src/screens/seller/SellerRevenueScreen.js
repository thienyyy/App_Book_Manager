import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { getOverviewRevenue } from '../../api/revenue';

export default function SellerRevenueScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overview, setOverview] = useState(null);

  const fetchRevenue = async () => {
    try {
      const data = await getOverviewRevenue();
      console.log(data);
      
      setOverview(data.revenue);
    } catch (err) {
      console.log('Lỗi khi fetch tổng doanh thu:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRevenue();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!overview) {
    return (
      <View style={styles.center}>
        <Text>Không thể tải dữ liệu doanh thu.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>Tổng Quan Doanh Thu</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Tổng doanh thu:</Text>
        <Text style={styles.value}>{overview.totalRevenue} VND</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Tổng sách đã bán:</Text>
        <Text style={styles.value}>{overview.totalSold}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  box: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f0f8ff',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077cc',
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
