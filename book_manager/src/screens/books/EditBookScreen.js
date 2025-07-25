// src/screens/EditBookScreen.js

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
  Switch,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "../../api/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBookById, updateBook } from "../../api/book";
import api from "../../api/url";

export default function EditBookScreen({ route, navigation }) {
  const { id } = route.params;
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    isActive: true,
    favorites: [],
    pages: [],
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Thiếu quyền", "Cần cấp quyền truy cập thư viện ảnh.");
      }
    })();
    if (id) fetchBook();
  }, [id]);

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
        isActive: book.isActive ?? true,
        favorites: book.favorites || [],
        pages: book.pages || [],
        image: book.image || book.coverImage || "",
      });
    } catch (error) {
      console.error("❌ Error fetching book:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu sách.");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handlePageChange = (index, field, value) => {
    setForm((prev) => {
      const pages = [...prev.pages];
      pages[index] = {
        ...pages[index],
        [field]: field === "pageNumber" ? Number(value) : value,
      };
      return { ...prev, pages };
    });
  };

  const addPage = () =>
    setForm((prev) => ({
      ...prev,
      pages: [
        ...prev.pages,
        { pageNumber: prev.pages.length + 1, content: "" },
      ],
    }));

  const removePage = (index) =>
    setForm((prev) => ({
      ...prev,
      pages: prev.pages.filter((_, i) => i !== index),
    }));

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets.length > 0) {
        setForm((prev) => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (error) {
      console.error("❌ Error picking image:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh.");
    }
  };

  const handleSubmit = async () => {
    const {
      title,
      author,
      price,
      description,
      category,
      stock,
      isActive,
      favorites,
      pages,
      image,
    } = form;
    if (!title || !author || !price || !description || !category || !stock) {
      return Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc.");
    }
    if (isNaN(price) || parseFloat(price) < 0) {
      return Alert.alert("Lỗi", "Giá sách phải là số không âm.");
    }
    if (isNaN(stock) || parseInt(stock) < 0) {
      return Alert.alert("Lỗi", "Số lượng phải là số nguyên không âm.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", parseFloat(price));
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", parseInt(stock));
    formData.append("isActive", isActive.toString());
    formData.append("favorites", JSON.stringify(favorites));
    formData.append("pages", JSON.stringify(pages));

    if (image) {
      const uri =
        Platform.OS === "android" ? image : image.replace("file://", "");
      const filename = uri.split("/").pop();
      const ext = filename.split(".").pop();
      formData.append("image", { uri, name: filename, type: `image/${ext}` });
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        return Alert.alert("Lỗi xác thực", "Vui lòng đăng nhập lại.");
      }
      const res = await updateBook(id, formData);

      Alert.alert("Thành công", "Cập nhật sách thành công", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
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
      <Text style={styles.label}>Ảnh bìa</Text>
      {form.imageUri ? (
        <Image source={{ uri: form.imageUri }} style={styles.coverImage} />
      ) : null}
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Chọn ảnh bìa</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Tên sách</Text>
      <TextInput
        style={styles.input}
        value={form.title}
        onChangeText={(t) => handleChange("title", t)}
        autoCapitalize="sentences"
      />

      <Text style={styles.label}>Tác giả</Text>
      <TextInput
        style={styles.input}
        value={form.author}
        onChangeText={(t) => handleChange("author", t)}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Giá</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.price}
        onChangeText={(t) => handleChange("price", t)}
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        value={form.description}
        onChangeText={(t) => handleChange("description", t)}
      />

      <Text style={styles.label}>Thể loại</Text>
      <TextInput
        style={styles.input}
        value={form.category}
        onChangeText={(t) => handleChange("category", t)}
      />

      <Text style={styles.label}>Số lượng</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.stock}
        onChangeText={(t) => handleChange("stock", t)}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Trạng thái hoạt động</Text>
        <Switch
          value={form.isActive}
          onValueChange={(v) => handleChange("isActive", v)}
        />
      </View>

      <Text style={styles.label}>Danh sách trang</Text>
      {form.pages.length > 0 ? (
        form.pages.map((page, idx) => (
          <View key={idx} style={styles.pageContainer}>
            <TouchableOpacity
              onPress={() => removePage(idx)}
              style={styles.deletePageButton}
            >
              <Text style={styles.deletePageButtonText}>🗑 Xóa trang</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Số trang</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={page.pageNumber.toString()}
              onChangeText={(t) => handlePageChange(idx, "pageNumber", t)}
            />
            <Text style={styles.label}>Nội dung trang</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              value={page.content}
              onChangeText={(t) => handlePageChange(idx, "content", t)}
            />
          </View>
        ))
      ) : (
        <Text style={styles.noPagesText}>Không có trang nào để chỉnh sửa.</Text>
      )}

      <TouchableOpacity style={styles.addButton} onPress={addPage}>
        <Text style={styles.addButtonText}>Thêm trang</Text>
      </TouchableOpacity>

      <Button
        title={loading ? "Đang lưu..." : "Lưu thay đổi"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  label: { marginBottom: 5, fontWeight: "bold", color: "#444" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  pageContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
  },
  noPagesText: { color: "#666", marginBottom: 15, textAlign: "center" },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  deletePageButton: {
    backgroundColor: "#e74c3c",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  deletePageButtonText: { color: "#fff", fontWeight: "bold" },
  coverImage: { width: "100%", height: 200, borderRadius: 8, marginBottom: 10 },
  imageButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  imageButtonText: { color: "#fff", fontWeight: "bold" },
});
