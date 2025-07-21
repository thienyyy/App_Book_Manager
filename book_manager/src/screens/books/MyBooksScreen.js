import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert, RefreshControl } from 'react-native';
import { getMyBooks, deleteBook } from '../../api/book';
import BookCard from '../../components/BookCard';

const MyBooksScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

 const fetchBooks = async () => {
    setRefreshing(true);
    try {
      const response = await getMyBooks();
      if (response.data.success) {
        setBooks(response.data.books);
      } else {
        Alert.alert('Lỗi', response.data.message || 'Không thể tải sách.');
      }
    } catch (err) {
      console.log('📛 Lỗi khi tải sách:', err);
      Alert.alert('Lỗi', 'Lỗi khi tải sách.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá sách này?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá',
        onPress: async () => {
          try {
            const response = await deleteBook(bookId);
            if (response.data.success) {
              Alert.alert('Thành công', 'Đã xoá sách.');
              fetchBooks();
            } else {
              Alert.alert('Lỗi', response.data.message || 'Không xoá được sách.');
            }
          } catch (err) {
            Alert.alert('Lỗi', 'Lỗi khi xoá sách.');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <BookCard
      book={item}
      onPress={() => navigation.navigate('BookDetail', { id: item._id })}
      onEdit={() => navigation.navigate('EditBook', { id: item._id })}
      onDelete={() => handleDelete(item._id)}
    />
  );

  return (
     <View style={styles.container}>
    <View style={styles.buttonWrapper}>
      <Button title="➕ Thêm sách mới" color="#1d4ed8" onPress={() => navigation.navigate('AddBook')} />
    </View>

    {books.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>📚 Bạn chưa có sách nào.</Text>
      </View>
    ) : (
      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchBooks} />}
      />
    )}
  </View>
  );
};

export default MyBooksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // nền sáng nhẹ
    padding: 16,
  },
  buttonWrapper: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});


