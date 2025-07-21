import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

const BookCard = ({ book, onEdit, onDelete, onPress }) => (
  <View style={styles.card}>
    {book.image && <Image source={{ uri: book.image }} style={styles.image} />}
    
    <Text style={styles.title}>{book.title}</Text>
    <Text style={styles.author}>Tác giả: {book.author}</Text>
    <Text style={styles.price}>Giá: ${book.price}</Text>

    <View style={styles.buttonWrapper}>
      {onPress && <View style={styles.button}><Button title="📖 Xem chi tiết" onPress={onPress} color="#2196F3" /></View>}
      {onEdit && <View style={styles.button}><Button title="✏️ Sửa" onPress={onEdit} color="#4CAF50" /></View>}
      {onDelete && <View style={styles.button}><Button title="🗑️ Xoá" onPress={onDelete} color="#F44336" /></View>}
    </View>
  </View>
);

export default BookCard;

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    height: 140,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  price: {
    fontSize: 15,
    color: '#2e7d32',
    marginBottom: 12,
  },
  buttonWrapper: {
    gap: 8,
  },
  button: {
    marginVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
