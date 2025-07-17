import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { createBook } from '../../api/book';

const AddBookScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    category: '',
    stock: '',
  });

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const { title, author, price, description, category } = form;
    if (!title || !author || !price || !description || !category) {
      return Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin sách.');
    }

    try {
      const response = await createBook(form);
      if (response.success) {
        Alert.alert('Thành công', 'Đã thêm sách thành công!');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', response.message || 'Thêm sách thất bại!');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi thêm sách.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Thêm Sách Mới</Text>

      {['title', 'author', 'price', 'description', 'category', 'stock'].map(key => (
        <TextInput
          key={key}
          placeholder={key.toUpperCase()}
          style={styles.input}
          keyboardType={key === 'price' || key === 'stock' ? 'numeric' : 'default'}
          value={form[key]}
          onChangeText={(value) => handleChange(key, value)}
        />
      ))}

      <Button title="Thêm Sách" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default AddBookScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 10,
    borderRadius: 8,
  },
});
