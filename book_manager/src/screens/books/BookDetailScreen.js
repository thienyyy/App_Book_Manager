import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { getBookById } from "../../api/book";

const BookDetailScreen = () => {
  const route = useRoute();
  const { id } = route.params;
  console.log(id);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBook = async () => {
    try {
      const res = await getBookById(id);
      console.log(res.data);
      setBook(res.data.book);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sách:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin sách.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.centered}>
        <Text>Không tìm thấy sách</Text>
      </View>
    );
  }
  const API_BASE_URL = "http://172.16.43.89:3000/"; // hoặc IP máy backend thực tế
  const imageUrl = book.image
    ? `${API_BASE_URL}${book.image.replace(/\\/g, "/")}`
    : null;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {book.image && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>Tác giả: {book.author}</Text>
      <Text style={styles.category}>Thể loại: {book.category}</Text>
      <Text style={styles.price}>Giá: {book.price} VND</Text>
      <Text style={styles.stock}>Số lượng: {book.stock}</Text>
      <Text style={styles.isActive}>
        Trạng thái: {book.isActive ? "Hoạt động" : "Không hoạt động"}
      </Text>
      <Text style={styles.favorites}>
        Lượt yêu thích: {book.favorites?.length || 0}
      </Text>
      <Text style={styles.description}>Mô tả: {book.description}</Text>
      <Text style={styles.owner}>
        Người bán: {book.owner?.name || "Không xác định"} (
        {book.owner?.email || "Không có email"})
      </Text>
      <Text style={styles.pagesTitle}>Danh sách trang:</Text>
      {book.pages && book.pages.length > 0 ? (
        book.pages.map((page, index) => (
          <View key={index} style={styles.pageContainer}>
            <Text style={styles.pageNumber}>Trang {page.pageNumber}</Text>
            <Text style={styles.pageContent}>{page.content}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noPagesText}>Không có trang nào.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  author: {
    fontSize: 16,
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: "green",
    marginBottom: 4,
  },
  stock: {
    fontSize: 16,
    marginBottom: 4,
  },
  isActive: {
    fontSize: 16,
    marginBottom: 4,
  },
  favorites: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    marginVertical: 8,
    lineHeight: 20,
  },
  owner: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginTop: 12,
    marginBottom: 16,
  },
  pagesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  pageContainer: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  pageContent: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  noPagesText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default BookDetailScreen;
