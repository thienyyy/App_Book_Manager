import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { getBookRevenueList } from '../../api/revenue';

export default function BookRevenueListScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookRevenue = async () => {
    try {
      const data = await getBookRevenueList(); // [{ _id, title, sold, revenue, stock, imageUrl }]
      setBooks(data);
    } catch (err) {
      console.log('Lỗi khi fetch doanh thu từng sách:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookRevenue();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookRevenue();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0077cc" />
        <Text>Đang tải danh sách sách...</Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Không có dữ liệu sách bán ra.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.detail}>Đã bán: {item.sold}</Text>
            <Text style={styles.detail}>Doanh thu: {item.revenue} VND</Text>
            <Text style={styles.detail}>Tồn kho: {item.stock}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#e6f2ff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 90,
    borderRadius: 6,
    marginRight: 12,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#333',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
