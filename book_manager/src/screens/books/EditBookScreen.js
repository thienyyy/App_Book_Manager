// screens/books/EditBookScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { updateBook, getBookById } from "../../api/book";

const EditBookScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [book, setBook] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const { data } = await getBookById(id);
      setBook(data);
      setForm({
        title: data.title,
        author: data.author,
        price: data.price.toString(),
        description: data.description,
        category: data.category,
        stock: data.stock.toString(),
      });
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    const { title, author, price, description, category, stock } = form;
    if (!title || !author || !price || !description || !category) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await updateBook(id, {
        title,
        author,
        price: parseFloat(price),
        description,
        category,
        stock: parseInt(stock),
      });
      Alert.alert("Thành công", "Cập nhật sách thành công", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Không thể cập nhật sách");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !book) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tên sách</Text>
      <TextInput
        style={styles.input}
        value={form.title}
        onChangeText={(text) => handleChange("title", text)}
      />

      <Text style={styles.label}>Tác giả</Text>
      <TextInput
        style={styles.input}
        value={form.author}
        onChangeText={(text) => handleChange("author", text)}
      />

      <Text style={styles.label}>Giá</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.price}
        onChangeText={(text) => handleChange("price", text)}
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        value={form.description}
        onChangeText={(text) => handleChange("description", text)}
      />

      <Text style={styles.label}>Loại</Text>
      <TextInput
        style={styles.input}
        value={form.category}
        onChangeText={(text) => handleChange("category", text)}
      />

      <Text style={styles.label}>Số lượng</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.stock}
        onChangeText={(text) => handleChange("stock", text)}
      />

      <Button title="Lưu thay đổi" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditBookScreen;
