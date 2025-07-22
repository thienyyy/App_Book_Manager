import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import api from "./../../APi/url";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardFlip from "react-native-card-flip";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.6;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

const GRADIENT_SET_1 = ["#f093fb", "#f5576c"];
const GRADIENT_SET_2 = ["#667eea", "#764ba2"];
const GRADIENT_SET_3 = ["#A5D6A7", "#4CAF50"];

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        setUserId(id || "687e042430a6d79cf89e4b75");
      } catch (err) {
        console.error("Error fetching user ID:", err);
      }
    };
    getUserId();
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data.books);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching books:", err);
      handleError(err, "Failed to fetch books.");
      setLoading(false);
    }
  };

  const toggleFavorite = async (bookId) => {
    try {
      const res = await api.post(`/books/${bookId}/favorite`);
      setBooks((prev) =>
        prev.map((book) =>
          book._id === bookId
            ? { ...book, favorites: res.data.favorites }
            : book
        )
      );
    } catch (err) {
      console.error("Error toggling favorite:", err);
      handleError(err, "Failed to update favorite status.");
    }
  };

  const handleRating = async (bookId, ratingValue) => {
    try {
      const res = await api.post(`/books/${bookId}/rating`, {
        rating: ratingValue,
      });

      const { averageRating, totalRatings } = res.data;

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === bookId ? { ...book, averageRating, totalRatings } : book
        )
      );
    } catch (err) {
      console.error("Error rating book:", err);
      Alert.alert("Error", "Không thể gửi đánh giá.");
    }
  };

  const handleError = (err, defaultMessage) => {
    if (err.response) {
      if (err.response.status === 401) {
        Alert.alert("Unauthorized", "Please log in to perform this action.");
      } else if (err.response.status === 404) {
        Alert.alert(
          "Not Found",
          err.response.data.message || "Book not found."
        );
      } else {
        Alert.alert("Error", err.response.data.message || defaultMessage);
      }
    } else {
      Alert.alert("Network Error", "Unable to connect to the server.");
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchBooks();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
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
    <View style={{ flex: 1 }}>
      {/* Button mở danh sách yêu thích */}
      <TouchableOpacity
        style={styles.favoriteListButton}
        onPress={() => navigation.navigate("FavoriteScreen")}
      >
        <Icon name="heart" size={28} color="#fff" />
        <Text style={styles.favoriteText}>Yêu thích</Text>
      </TouchableOpacity>

      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item, index }) => (
          <CardFlip
            style={styles.cardFlip}
            ref={(card) => (item.cardRef = card)}
            duration={1000}
          >
            {/* Mặt trước */}
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => item.cardRef.flip()}
            >
              <LinearGradient
                colors={
                  index % 3 === 0
                    ? GRADIENT_SET_1
                    : index % 3 === 1
                    ? GRADIENT_SET_2
                    : GRADIENT_SET_3
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientFill}
              >
                {item.genre && (
                  <Text style={styles.genre}>{item.genre.toUpperCase()}</Text>
                )}

                <View style={styles.titleAuthorContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.author}>{item.author}</Text>
                </View>

                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => handleRating(item._id, i + 1)}
                      activeOpacity={0.6}
                    >
                      <Icon
                        name={
                          i < Math.floor(item.averageRating)
                            ? "star"
                            : i < item.averageRating
                            ? "star-half"
                            : "star-outline"
                        }
                        size={28}
                        color="#FFD700"
                        style={styles.starIcon}
                      />
                    </TouchableOpacity>
                  ))}
                  <Text style={styles.averageRatingText}>
                    {item.averageRating?.toFixed(1)}
                  </Text>
                  <Text style={styles.totalRatingsText}>
                    ({item.totalRatings})
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Mặt sau */}
            <TouchableOpacity
              style={[styles.card, styles.back]}
              onPress={() => item.cardRef.flip()}
            >
              <TouchableOpacity
                style={styles.favoriteIcon}
                onPress={() => toggleFavorite(item._id)}
              >
                <Icon
                  name={
                    item.favorites.includes(userId) ? "heart" : "heart-outline"
                  }
                  size={28}
                  color={item.favorites.includes(userId) ? "red" : "#333"}
                />
              </TouchableOpacity>

              <View style={styles.backContent}>
                {item.imageURL && (
                  <Image
                    source={{ uri: item.imageURL }}
                    style={styles.backImageLarge}
                  />
                )}
                <Text style={styles.description}>{item.description}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("BookDetail", { bookId: item._id })
                    }
                  >
                    <Icon name="eye-outline" size={30} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </CardFlip>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: {
    marginTop: 80,
    padding: 5,
    alignItems: "center",
  },
  cardFlip: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 40,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 0,
    overflow: "hidden",
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
  },
  gradientFill: {
    flex: 1,
    padding: 15,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  back: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  titleAuthorContainer: {
    marginBottom: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  genre: {
    fontSize: 12,
    color: "white",
    marginBottom: 5,
  },
  author: {
    fontSize: 18,
    color: "#eee",
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  starIcon: {
    marginRight: 2,
  },
  averageRatingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFD700",
    marginLeft: 5,
  },
  totalRatingsText: {
    fontSize: 12,
    color: "#ccc",
    marginLeft: 5,
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  backContent: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  backImageLarge: {
    width: "100%",
    height: CARD_HEIGHT * 0.6,
    resizeMode: "cover",
  },
  description: {
    fontSize: 14,
    textAlign: "justify",
    marginVertical: 10,
    paddingHorizontal: 12,
  },
  actions: {
    alignItems: "center",
  },
  favoriteListButton: {
    position: "absolute",
    top: 20,
    left: 10,
    backgroundColor: "#f5576c",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    zIndex: 100,
    elevation: 5,
  },
  favoriteText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
});
