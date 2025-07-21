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
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchBook = async () => {
    try {
      setInitialLoading(true);
      const res = await getBookById(id);
      const book = res.data.book;

      setForm({
        title: book.title || "",
        author: book.author || "",
        price: book.price?.toString() || "0",
        description: book.description || "",
        category: book.category || "",
        stock: book.stock?.toString() || "0",
      });
    } catch (error) {
      console.error("❌ Lỗi khi tải sách:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu sách.");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBook();
  }, [id]);

  const handleChange = (name, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { title, author, price, description, category, stock } = form;

    if (!title || !author || !price || !description || !category || !stock) {
      return Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
    }

    if (isNaN(price) || parseFloat(price) < 0) {
      return Alert.alert("Lỗi", "Giá sách phải là số không âm.");
    }

    if (isNaN(stock) || parseInt(stock) < 0) {
      return Alert.alert("Lỗi", "Số lượng phải là số nguyên không âm.");
    }

    try {
      setLoading(true);
      const updatedBook = {
        title,
        author,
        price: parseFloat(price),
        description,
        category,
        stock: parseInt(stock),
      };

      const res = await updateBook(id, updatedBook);
      if (res.data?.success) {
        Alert.alert("Thành công", "Cập nhật sách thành công", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Lỗi", res.data?.message || "Cập nhật thất bại.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      Alert.alert("Lỗi", "Không thể cập nhật sách.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Tên sách</Text>
      <TextInput
        style={styles.input}
        value={form.title}
        onChangeText={(text) => handleChange("title", text)}
        autoCapitalize="sentences"
      />

      <Text style={styles.label}>Tác giả</Text>
      <TextInput
        style={styles.input}
        value={form.author}
        onChangeText={(text) => handleChange("author", text)}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Giá</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.price}
        onChangeText={(text) => handleChange("price", text)}
        inputMode="numeric"
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        value={form.description}
        onChangeText={(text) => handleChange("description", text)}
        autoCapitalize="sentences"
      />

      <Text style={styles.label}>Thể loại</Text>
      <TextInput
        style={styles.input}
        value={form.category}
        onChangeText={(text) => handleChange("category", text)}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Số lượng</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.stock}
        onChangeText={(text) => handleChange("stock", text)}
        inputMode="numeric"
      />

      <Button
        title={loading ? "Đang lưu..." : "Lưu thay đổi"}
        onPress={handleSubmit}
        disabled={loading}
      />
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
