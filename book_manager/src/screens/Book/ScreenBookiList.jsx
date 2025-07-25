import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
  Animated,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/url";
import CardFlip from "react-native-card-flip";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

const rainbowColors = [
  "#ff0000",
  "#ff7f00",
  "#ffff00",
  "#00ff00",
  "#0000ff",
  "#4b0082",
  "#8f00ff",
];

// ✅ Component hiển thị sách với viền gradient động
function BookCard({ item, index, userId, onFavorite, onDetail, onRate }) {
  const flipRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Animation xoay vòng gradient
  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.gradientWrapper}>
      {/* Animated Gradient Border */}
      <Animated.View
        style={[
          styles.gradientBorder,
          {
            transform: [{ rotate }],
          },
        ]}
      >
        <LinearGradient
          colors={rainbowColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <CardFlip style={styles.cardFlip} ref={flipRef}>
        {/* ✅ Mặt trước kiểu Netflix */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => flipRef.current.flip()}
          activeOpacity={0.9}
        >
          {/* Hình ảnh chiếm 70% */}
          <Image
            source={{ uri: item.imageURL }}
            style={styles.frontImageNetflix}
          />

          {/* Overlay gradient + text */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.overlayGradient}
          >
            <Text style={styles.titleNetflix} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.authorNetflix} numberOfLines={1}>
              {item.author}
            </Text>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => onRate(item._id, i + 1)} // ✅ Gửi rating khi nhấn
                  activeOpacity={0.7}
                  style={{ marginHorizontal: 2 }}
                >
                  <Icon
                    name={
                      i < Math.floor(item.averageRating)
                        ? "star"
                        : i < item.averageRating
                        ? "star-half"
                        : "star-outline"
                    }
                    size={22}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
              <Text style={styles.averageRatingText}>
                {item.averageRating?.toFixed(1)}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ✅ Mặt sau giữ nguyên */}
        <TouchableOpacity
          style={[styles.card, styles.back]}
          onPress={() => flipRef.current.flip()}
        >
          <Image
            source={{ uri: item.imageURL }}
            style={styles.backImageLarge}
          />
          <Text style={styles.description} numberOfLines={6}>
            {item.description}
          </Text>
          <View style={styles.backActions}>
            <TouchableOpacity
              onPress={() => onDetail(item._id)}
              style={styles.iconButton}
            >
              <Icon name="eye-outline" size={28} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onFavorite(item._id)}
              style={styles.iconButton}
            >
              <Icon
                name={
                  item.favorites?.includes(userId) ? "heart" : "heart-outline"
                }
                size={28}
                color={item.favorites?.includes(userId) ? "red" : "#555"}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </CardFlip>
    </View>
  );
}

export default function BookListScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [dislikedBooks, setDislikedBooks] = useState([]);
  const [lastIndex, setLastIndex] = useState(null);

  const swiperRef = useRef(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        setUserId(id || "guest-user");
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
      console.log(res.data);
      
      setBooks(res.data.books);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching books:", err);
      setLoading(false);
    }
  };

  // ✅ Cập nhật yêu thích (Optimistic UI)
  const toggleFavorite = async (bookId) => {
    setBooks((prev) =>
      prev.map((book) =>
        book._id === bookId
          ? {
              ...book,
              favorites: book.favorites.includes(userId)
                ? book.favorites.filter((id) => id !== userId)
                : [...book.favorites, userId],
            }
          : book
      )
    );

    try {
      await api.post(`/books/${bookId}/favorite`);
    } catch (err) {
      console.error("Error toggling favorite:", err);
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

  const undoSwipe = () => {
    if (lastIndex !== null && swiperRef.current) {
      swiperRef.current.swipeBack();
      const lastDisliked = dislikedBooks.pop();
      setDislikedBooks([...dislikedBooks]);
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
      {/* Nút Undo */}
      <TouchableOpacity
        style={[
          styles.favoriteListButton,
          { top: 15, backgroundColor: "#4CAF50" },
        ]}
        onPress={undoSwipe}
      >
        <Icon name="refresh" size={28} color="#fff" />
        <Text style={styles.favoriteText}>Undo</Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        cards={books}
        renderCard={(item, index) => (
          <BookCard
            item={item}
            index={index}
            userId={userId}
            onFavorite={toggleFavorite}
            onDetail={(id) =>
              navigation.navigate("BookDetail", {
                bookId: id,
                refreshFavorite: true,
              })
            }
            onRate={handleRating}
          />
        )}
        onSwipedRight={(index) => {
          toggleFavorite(books[index]._id);
          setLastIndex(index);
        }}
        onSwipedLeft={(index) => {
          setDislikedBooks((prev) => [...prev, books[index]]);
          setLastIndex(index);
        }}
        overlayLabels={{
          left: {
            title: "NOPE",
            style: { label: { backgroundColor: "red", color: "white" } },
          },
          right: {
            element: (
              <View
                style={{
                  backgroundColor: "rgba(255,0,0,0.7)",
                  borderRadius: 50,
                  padding: 15,
                }}
              >
                <Icon name="heart" size={40} color="#fff" />
              </View>
            ),
            style: {
              wrapper: { justifyContent: "center", alignItems: "center" },
            },
          },
        }}
        animateOverlayLabelsOpacity
        cardIndex={0}
        backgroundColor="transparent"
        stackSize={3}
        cardVerticalMargin={150}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  gradientWrapper: {
    borderRadius: 18,
    padding: 4,
    marginBottom: 20,
    alignSelf: "center",
    overflow: "hidden",
  },
  gradientBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    opacity: 0.8,
  },
  cardFlip: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    padding: 15,
    justifyContent: "space-between",
  },
  back: {
    justifyContent: "center",
    alignItems: "center",
  },
  genre: { fontSize: 12, color: "#333", marginBottom: 5 },
  title: { fontSize: 24, fontWeight: "bold", color: "#222" },
  author: { fontSize: 18, color: "#666" },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  averageRatingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFD700",
    marginLeft: 5,
  },
  backImageLarge: {
    width: "100%",
    height: CARD_HEIGHT * 0.6,
    resizeMode: "cover",
  },
  backActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
  iconButton: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 50,
    elevation: 3,
  },

  description: {
    fontSize: 14,
    textAlign: "justify",
    marginVertical: 10,
    paddingHorizontal: 12,
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
  frontImageNetflix: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlayGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  titleNetflix: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  authorNetflix: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  averageRatingText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
});