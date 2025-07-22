import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import CardFlip from "react-native-card-flip";
import Icon from "react-native-vector-icons/Ionicons";
import api from "./../../APi/url";

const { width } = Dimensions.get("window");
const BOOK_WIDTH = width * 0.9;
const BOOK_HEIGHT = BOOK_WIDTH * 1.4;

export default function BookDetailScreen({ route, navigation }) {
  const { bookId } = route.params;
  const [loading, setLoading] = useState(true);
  const [currentPageContent, setCurrentPageContent] = useState("");
  const [nextPageContent, setNextPageContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [bookImage, setBookImage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const cardRef = useRef(null);

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      const bookRes = await api.get(`/books/${bookId}`);
      const bookData = bookRes.data.book;

      setBookImage(bookData.imageURL || "");
      setIsFavorite(bookData.isFavorite || false);

      const pagesCount = bookData.pages.length;
      setTotalPages(pagesCount);

      if (pagesCount === 0) {
        setLoading(false);
        return;
      }

      const progressRes = await api.get(`/books/${bookId}/progress`);
      const lastPage = progressRes.data.lastReadPage || 1;
      setCurrentPage(lastPage);
      await fetchPage(lastPage);
    } catch (err) {
      console.error("Error fetching book details or progress:", err);
      handleError(err, "Failed to load book details.");
      setLoading(false);
    }
  };

  const fetchPage = async (pageNumber) => {
    setLoading(true);
    try {
      const resPage = await api.get(`/books/${bookId}/page/${pageNumber}`);
      setCurrentPageContent(resPage.data.content);

      if (pageNumber < totalPages) {
        const nextPageRes = await api.get(
          `/books/${bookId}/page/${pageNumber + 1}`
        );
        setNextPageContent(nextPageRes.data.content);
      } else {
        setNextPageContent("");
      }
    } catch (err) {
      console.error("Error fetching page:", err);
      handleError(err, "Failed to load page content.");
    }
    setLoading(false);
  };

  const toggleFavorite = async () => {
    try {
      const res = await api.post(`/books/${bookId}/favorite`);
      setIsFavorite(res.data.isFavorite);
    } catch (err) {
      console.error("Error toggling favorite:", err);
      handleError(err, "Failed to update favorite status.");
    }
  };

  const handleError = (err, defaultMessage) => {
    if (err.response) {
      if (err.response.status === 401) {
        Alert.alert("Unauthorized", "Please log in to access this book.");
      } else if (err.response.status === 404) {
        Alert.alert(
          "Not Found",
          err.response.data.message || "Book or page not found."
        );
      } else {
        Alert.alert("Error", err.response.data.message || defaultMessage);
      }
    } else {
      Alert.alert("Network Error", "Unable to connect to the server.");
    }
  };

  const nextPage = () => {
    if (currentPage >= totalPages) {
      Alert.alert("End of Book", "You have reached the last page.");
      return;
    }
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    setCurrentPageContent(nextPageContent);
    fetchPage(newPage);
    cardRef.current.flip();
  };

  const prevPage = () => {
    if (currentPage === 1) return;
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    fetchPage(newPage);
    cardRef.current.flip();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Ảnh bìa lớn */}
        {bookImage ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: bookImage }} style={styles.bookImage} />
            {/* Icon yêu thích đè lên ảnh */}
            {/* <TouchableOpacity
              style={styles.favoriteIcon}
              onPress={toggleFavorite}
            >
              <Icon
                name={isFavorite ? "heart" : "heart-outline"}
                size={30}
                color={isFavorite ? "red" : "#fff"}
              />
            </TouchableOpacity> */}
          </View>
        ) : null}

        {/* CardFlip cho nội dung */}
        <CardFlip style={styles.cardContainer} ref={cardRef}>
          <View style={[styles.card, styles.front]}>
            <Text style={styles.pageTitle}>Trang {currentPage}</Text>
            <Text style={styles.pageContent}>{currentPageContent}</Text>
          </View>
          <View style={[styles.card, styles.back]}>
            <Text style={styles.pageTitle}>
              Trang{" "}
              {currentPage + 1 <= totalPages ? currentPage + 1 : currentPage}
            </Text>
            <Text style={styles.pageContent}>
              {nextPageContent || currentPageContent}
            </Text>
          </View>
        </CardFlip>

        {/* Nút điều hướng */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.btn, currentPage === 1 && styles.btnDisabled]}
            onPress={prevPage}
            disabled={currentPage === 1}
          >
            <Text style={styles.btnText}>← Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              currentPage >= totalPages && styles.btnDisabled,
            ]}
            onPress={nextPage}
            disabled={currentPage >= totalPages}
          >
            <Text style={styles.btnText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },
  imageWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  bookImage: {
    width: "95%",
    height: 250,
    borderRadius: 12,
    resizeMode: "contain",
  },
  favoriteIcon: {
    position: "absolute",
    top: 15,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 50,
  },
  cardContainer: { width: BOOK_WIDTH, height: BOOK_HEIGHT },
  card: {
    width: BOOK_WIDTH,
    height: BOOK_HEIGHT,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
  front: { backgroundColor: "#f9f9f9" },
  back: { backgroundColor: "#e0f7fa" },
  pageTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  pageContent: { fontSize: 16, textAlign: "justify" },
  controls: { flexDirection: "row", marginTop: 20, gap: 20 },
  btn: { backgroundColor: "#f093fb", padding: 12, borderRadius: 8 },
  btnDisabled: { backgroundColor: "#cccccc", opacity: 0.5 },
  btnText: { color: "#fff", fontSize: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});
