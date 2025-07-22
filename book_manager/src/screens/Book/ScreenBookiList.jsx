import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import api from "./../../api/url";
import { AuthContext } from "../../context/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardFlip from "react-native-card-flip";
import { LinearGradient } from "expo-linear-gradient";
import { Appbar, Provider as PaperProvider } from "react-native-paper";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.6;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

export default function BookListScreen({ navigation, onLogout }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);


  

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id || "defaultUserId");
    };
    getUserId();
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data.books);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch books");
    } finally {
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
      console.error(err);
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
    <PaperProvider>
      <View style={{ flex: 1 }}>
        {/* Appbar custom button to rõ ràng */}
       <Appbar.Header style={{ backgroundColor: '#333' }}>
  <Appbar.Content title="Danh sách sách" titleStyle={{ color: '#fff' }} />
</Appbar.Header>

        {/* Nút yêu thích */}
        <TouchableOpacity
          style={styles.favoriteListButton}
          onPress={() => navigation.navigate("FavoriteScreen")}
        >
          <Icon name="heart" size={24} color="#fff" />
          <Text style={styles.favoriteText}>Yêu thích</Text>
        </TouchableOpacity>

        <FlatList
          data={books}
          keyExtractor={(item) => item._id}
          refreshing={refreshing}
          onRefresh={fetchBooks}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <CardFlip
              style={styles.cardFlip}
              ref={(card) => (item.cardRef = card)}
              duration={1000}
            >
              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => item.cardRef.flip()}
              >
                <LinearGradient
                  colors={["#f093fb", "#f5576c"]}
                  style={styles.gradientFill}
                >
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.author}>Tác giả: {item.author}</Text>

                  <View style={styles.row}>
                    <TouchableOpacity
                      onPress={() => toggleFavorite(item._id)}
                      style={{ marginRight: 10 }}
                    >
                      <Icon
                        name={
                          item.favorites?.includes(userId)
                            ? "heart"
                            : "heart-outline"
                        }
                        size={24}
                        color="#fff"
                      />
                    </TouchableOpacity>
                    <Icon name="star" size={20} color="#FFD700" />
                    <Text style={styles.averageRatingText}>
                      {item.averageRating?.toFixed(1) || "0.0"}
                    </Text>
                    <Text style={styles.totalRatingsText}>
                      ({item.totalRatings || 0})
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.card, styles.back]}
                onPress={() => item.cardRef.flip()}
              >
                <Text style={styles.description}>{item.description}</Text>
              </TouchableOpacity>
            </CardFlip>
          )}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: {
    padding: 5,
    paddingTop: 10,
    alignItems: "center",
  },
  cardFlip: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 40,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  gradientFill: {
    flex: 1,
    padding: 15,
    justifyContent: "space-between",
  },
  back: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  author: {
    fontSize: 16,
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
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
  description: {
    fontSize: 14,
    textAlign: "center",
  },
  favoriteListButton: {
    position: "absolute",
    top: 70,
    left: 10,
    backgroundColor: "#f5576c",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 25,
    zIndex: 20,
  },
  favoriteText: {
    color: "#fff",
    marginLeft: 6,
  },

});
