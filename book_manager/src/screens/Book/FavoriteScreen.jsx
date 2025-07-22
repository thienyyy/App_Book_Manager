import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import api from "../../../APi/url";

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://192.168.75.1:3000/";

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/books/favorites");
      setFavorites(res.data.books || []);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.noData}>Chưa có sách yêu thích nào.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: BASE_URL + item.image.replace("\\", "/") }}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.author}>Tác giả: {item.author}</Text>
                <Text style={styles.category}>Thể loại: {item.category}</Text>
                {/* Hiển thị rating */}
                {/* <Text style={styles.rating}>
                  Đánh giá:{" "}
                  {item.averageRating !== undefined &&
                  item.averageRating !== null
                    ? item.averageRating.toFixed(1)
                    : "Chưa có"}
                </Text> */}
              </View>
            </View>
          )}
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
  rating: { fontSize: 16, fontWeight: "bold", color: "#FF9800", marginTop: 8 },
});
