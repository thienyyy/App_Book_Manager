// BookDetailScreen.js - Hiển thị chi tiết sách
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getBookById } from "../../api/book";
import { getToken } from "../../utils/tokenStorage"; // ✅


const BookDetailScreen = () => {
  const route = useRoute();
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBook = async () => {
    try {
      const token = await getToken(); // ✅ đúng
      const data = await getBookById(bookId, token);
      setBook(data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sách:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin sách");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchBook(); // gọi hàm fetchBook đã khai báo ở trên
}, []);


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

  return (
    <ScrollView style={styles.container}>
      {book.image && (
        <Image source={{ uri: book.image }} style={styles.image} />
      )}
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>Tác giả: {book.author}</Text>
      <Text style={styles.category}>Thể loại: {book.category}</Text>
      <Text style={styles.price}>Giá: {book.price} VND</Text>
      <Text style={styles.stock}>Số lượng: {book.stock}</Text>
      <Text style={styles.description}>Mô tả: {book.description}</Text>
      <Text style={styles.owner}>Người bán: {book.owner?.name} ({book.owner?.email})</Text>
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
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default BookDetailScreen;
