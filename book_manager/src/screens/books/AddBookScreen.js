import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { createBook } from "../../api/book";

const AddBookScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const { title, author, price, description, category, stock } = form;

    // Kiểm tra các trường rỗng
    if (!title || !author || !price || !description || !category || !stock) {
      return Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin sách.");
    }

    // Kiểm tra giá trị số
    if (isNaN(price) || Number(price) < 0) {
      return Alert.alert("Lỗi", "Giá sách phải là một số không âm.");
    }

    if (isNaN(stock) || Number(stock) < 0) {
      return Alert.alert("Lỗi", "Số lượng tồn kho phải là một số không âm.");
    }

    setLoading(true);

    try {
      const response = await createBook(form);
      const res = response?.data || response;

      if (res.success) {
        Alert.alert("Thành công", "Đã thêm sách thành công!");
        setForm({
          title: "",
          author: "",
          price: "",
          description: "",
          category: "",
          stock: "",
        });
        navigation.goBack();
      } else {
        Alert.alert("Lỗi", res.message || "Thêm sách thất bại!");
      }
    } catch (error) {
      console.log("Lỗi khi thêm sách:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi thêm sách.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>Thêm Sách Mới</Text>

      {["title", "author", "price", "description", "category", "stock"].map(
        (key) => (
          <TextInput
            key={key}
            placeholder={key.toUpperCase()}
            style={styles.input}
            keyboardType={
              key === "price" || key === "stock" ? "numeric" : "default"
            }
            multiline={key === "description"}
            autoCapitalize="sentences"
            value={form[key]}
            onChangeText={(value) => handleChange(key, value)}
          />
        )
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="Thêm Sách" onPress={handleSubmit} />
      )}
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
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    padding: 10,
    borderRadius: 8,
  },
});
