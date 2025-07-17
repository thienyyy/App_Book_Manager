import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';

const BookCard = ({ book, onEdit, onDelete, onDetail }) => {
  const {
    _id,
    title = 'No Title',
    author = 'Unknown',
    price = 0,
    description = '',
    image,
  } = book;

  const imageURL =
    image && image.startsWith('http')
      ? image
      : image
      ? `http://192.168.2.15:3000/${image.replace(/\\/g, '/')}`
      : 'https://via.placeholder.com/150';

  return (
    <Card style={styles.card} mode="elevated">
      <View style={styles.row}>
        <Image source={{ uri: imageURL }} style={styles.img} />
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text>Author: {author}</Text>
          <Text>Price: {price.toLocaleString()} VND</Text>
          <Text numberOfLines={2}>Description: {description}</Text>

          <View style={styles.actions}>
            <Button onPress={() => onDetail(_id)}>📖 View</Button>
            <Button onPress={() => onEdit(_id)}>✏️ Edit</Button>
            <Button onPress={() => onDelete(_id)} textColor="red">
              🗑️ Delete
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default BookCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
  img: {
    width: 90,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 6,
  },
});
