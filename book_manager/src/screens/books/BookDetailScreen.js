import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Image, Text } from 'react-native';
import { Card, ActivityIndicator } from 'react-native-paper';
import { getBookById } from '../../api/book';

export default function BookDetailScreen({ route }) {
  const { id } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookById(id)
      .then((res) => setBook(res.data.book || res.data))
      .catch((err) => console.error('Failed to load book:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!book) return <Text style={{ padding: 20 }}>Book not found.</Text>;

  const imageURL = book.image?.startsWith('http')
    ? book.image
    : book.image
    ? `http://192.168.2.15:3000/${book.image.replace(/\\/g, '/')}`
    : 'https://via.placeholder.com/150';

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Cover source={{ uri: imageURL }} style={{ height: 220 }} />
        <Card.Title title={book.title} subtitle={`Author: ${book.author}`} />
        <Card.Content>
          <Text>💵 Price: {book.price?.toLocaleString()} VND</Text>
          <Text>📚 Category: {book.category}</Text>
          <Text>📦 Stock: {book.stock}</Text>
          <Text style={styles.desc}>{book.description}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  desc: { marginTop: 10, fontSize: 16, lineHeight: 22 },
});
