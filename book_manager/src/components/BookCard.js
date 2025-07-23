import { Image, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const API_BASE_URL = "http://172.16.43.89:3000/"; // hoặc IP máy backend thực tế

const BookCard = ({ book, onEdit, onDelete, onPress }) => {
  const imageUrl = book.image
    ? `${API_BASE_URL}${book.image.replace(/\\/g, "/")}`
    : null;

  return (
    <View style={styles.card}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Không có ảnh</Text>
        </View>
      )}

      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>Tác giả: {book.author}</Text>
      <Text style={styles.category}>Thể loại: {book.category}</Text>
      <Text style={styles.price}>Giá: {book.price}đ</Text>
      <Text style={styles.stock}>Số lượng: {book.stock}</Text>
      <Text style={styles.description}>Mô tả: {book.description}</Text>

      <View style={styles.buttonWrapper}>
        {onPress && (
          <View style={styles.button}>
            <TouchableOpacity onPress={onPress} style={styles.detailButton}>
              <Text style={styles.buttonText}>📖 Xem chi tiết</Text>
            </TouchableOpacity>
          </View>
        )}
        {onEdit && (
          <View style={styles.button}>
            <TouchableOpacity onPress={onEdit} style={styles.editButton}>
              <Text style={styles.buttonText}>✏️ Sửa</Text>
            </TouchableOpacity>
          </View>
        )}
        {onDelete && (
          <View style={styles.button}>
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Text style={styles.buttonText}>🗑️ Xoá</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default BookCard;

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    height: 140,
    width: "100%",
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePlaceholder: {
    height: 140,
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  imagePlaceholderText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  price: {
    fontSize: 15,
    color: "#2e7d32",
    marginBottom: 2,
  },
  stock: {
    fontSize: 14,
    color: "#1e40af",
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 8,
    fontStyle: "italic",
  },
  buttonWrapper: {
    gap: 8,
  },
  button: {
    marginVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
});
