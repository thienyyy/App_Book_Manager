import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { FlatList, Snackbar, ActivityIndicator, Text, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import BookCard from '../../components/BookCard';
import { getMyBooks, deleteBook } from '../../api/book';

const MyBooksScreen = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const navigation = useNavigation();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getMyBooks();
      if (res.data?.books) {
        setBooks(res.data.books);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setSnackbar({ visible: true, message: 'Failed to load books' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this book?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBook(id);
            fetchBooks();
          } catch (err) {
            setSnackbar({ visible: true, message: 'Delete failed' });
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchBooks);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : books.length === 0 ? (
        <Text style={styles.empty}>📭 No books found</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onEdit={(id) => navigation.navigate('EditBook', { id })}
              onDelete={(id) => handleDelete(id)}
              onDetail={(id) => navigation.navigate('BookDetail', { id })}
            />
          )}
        />
      )}

      <FAB
        icon="plus"
        label="Add Book"
        style={styles.fab}
        onPress={() => navigation.navigate('AddBook')}
      />

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
};

export default MyBooksScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { paddingBottom: 80 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
  fab: { position: 'absolute', right: 20, bottom: 30 },
});
