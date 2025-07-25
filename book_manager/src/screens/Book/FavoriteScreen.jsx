import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import api from "../../api/url";

export default function FavoriteScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

const BASE_URL = "http://192.168.2.3:3000";

  useEffect(() => {
    fetchFavorites();
  }, []);

  // ✅ Lấy danh sách yêu thích
  const fetchFavorites = async () => {
    if (!refreshing) setLoading(true);
    try {
      const res = await api.get("/books/favorites");
      setFavorites(res.data.books || []);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ Gọi khi kéo xuống để làm mới
  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  // ✅ Reload mỗi khi quay lại màn hình
  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  // ✅ Bỏ yêu thích
  const removeFavorite = async (bookId) => {
    try {
      await api.post(`/books/${bookId}/favorite`);
      setFavorites((prev) => prev.filter((book) => book._id !== bookId));
    } catch (err) {
      console.error("Error removing favorite:", err);
      Alert.alert("Lỗi", "Không thể xóa khỏi yêu thích.");
    }
  };

  // ✅ Hiển thị loading lần đầu
  if (loading && !refreshing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const renderRightActions = (bookId) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => removeFavorite(bookId)}
    >
      <Icon name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item._id)}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("BookDetail", { bookId: item._id })}
      >
        <Image
          source={{ uri: BASE_URL + item.image.replace("\\", "/") }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>Tác giả: {item.author}</Text>
          <Text style={styles.category}>Thể loại: {item.category}</Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => removeFavorite(item._id)}
        >
          <Icon name="heart" size={28} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.noData}>Chưa có sách yêu thích nào.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 10, backgroundColor: "#f8f8f8" },
  noData: { textAlign: "center", marginTop: 50, fontSize: 16, color: "gray" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 3,
  },
  image: { width: 100, height: 130, borderRadius: 8, marginRight: 10 },
  info: { flex: 1, justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  author: { fontSize: 14, color: "#333" },
  category: { fontSize: 14, color: "#666", marginTop: 5 },
  favoriteIcon: { padding: 8 },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    borderRadius: 10,
    marginVertical: 10,
  },
});
