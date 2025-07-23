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
    isActive: true,
    favorites: [],
    pages: [],
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
        isActive: book.isActive ?? true,
        favorites: book.favorites || [],
        pages: book.pages || [],
      });
    } catch (error) {
      console.error("❌ Error fetching book:", error);
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

  const handlePageChange = (index, field, value) => {
    setForm((prevForm) => {
      const newPages = [...prevForm.pages];
      newPages[index] = {
        ...newPages[index],
        [field]: field === "pageNumber" ? Number(value) : value,
      };
      return { ...prevForm, pages: newPages };
    });
  };

  const addPage = () => {
    setForm((prevForm) => ({
      ...prevForm,
      pages: [
        ...prevForm.pages,
        { pageNumber: prevForm.pages.length + 1, content: "" },
      ],
    }));
  };

  const removePage = (indexToRemove) => {
    setForm((prevForm) => {
      const newPages = prevForm.pages.filter(
        (_, index) => index !== indexToRemove
      );
      return { ...prevForm, pages: newPages };
    });
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

    if (pages.some((page) => !page.pageNumber || !page.content)) {
      return Alert.alert(
        "Lỗi",
        "Tất cả các trang phải có số trang và nội dung."
      );
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
        isActive,
        favorites,
        pages: pages.map((page) => ({
          pageNumber: Number(page.pageNumber),
          content: page.content,
        })),
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

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Trạng thái hoạt động</Text>
        <Switch
          value={form.isActive}
          onValueChange={(value) => handleChange("isActive", value)}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={form.isActive ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      <Text style={styles.label}>Danh sách trang</Text>
      {form.pages.length > 0 ? (
        form.pages.map((page, index) => (
          <View key={index} style={styles.pageContainer}>
            <TouchableOpacity
              style={styles.deletePageButton}
              onPress={() => removePage(index)}
            >
              <Text style={styles.deletePageButtonText}>🗑 Xóa trang</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Số trang</Text>
            <TextInput
              style={styles.input}
              placeholder="Số trang"
              keyboardType="numeric"
              value={page.pageNumber?.toString() || ""}
              onChangeText={(text) =>
                handlePageChange(index, "pageNumber", text)
              }
              inputMode="numeric"
            />
            <Text style={styles.label}>Nội dung trang</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Nội dung trang"
              multiline
              numberOfLines={4}
              value={page.content || ""}
              onChangeText={(text) => handlePageChange(index, "content", text)}
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
  noPagesText: {
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deletePageButton: {
    backgroundColor: "#e74c3c",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  deletePageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default EditBookScreen;
