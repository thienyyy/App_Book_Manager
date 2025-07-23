import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { getRatingStats } from "../../api/book";
import { Ionicons } from "@expo/vector-icons";
import { BarChart, PieChart } from "react-native-chart-kit";

const TopRatedScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getRatingStats();
        
        setData(stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const renderBook = (book) => (
    <View key={book.id} style={styles.bookCard}>
      <Text style={styles.bookTitle}>{book.title}</Text>
      <Text style={styles.bookInfo}>Author: {book.author}</Text>
      <Text style={styles.bookInfo}>Category: {book.category}</Text>
      <Text style={styles.bookInfo}>⭐ {book.averageRating}</Text>
      <Text style={styles.bookInfo}>❤️ {book.totalFavorites}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#000" />;
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text>Error loading data.</Text>
      </View>
    );
  }

  const chartWidth = Dimensions.get("window").width - 30;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📊 User Book Statistics</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⭐ Top Rated Books</Text>
        {data.topRatedBooks.map(renderBook)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>❤️ Most Favorited Books</Text>
        {data.topFavoriteBooks.map(renderBook)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📉 Rating Distribution</Text>
        <BarChart
          data={{
            labels: ["1⭐", "2⭐", "3⭐", "4⭐", "5⭐"],
            datasets: [
              {
                data: [
                  data.overview.ratingDistribution["1"],
                  data.overview.ratingDistribution["2"],
                  data.overview.ratingDistribution["3"],
                  data.overview.ratingDistribution["4"],
                  data.overview.ratingDistribution["5"],
                ],
              },
            ],
          }}
          width={chartWidth}
          height={220}
          fromZero
          showValuesOnTopOfBars
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: () => "#333",
            propsForLabels: {
              fontSize: 12,
            },
          }}
          style={{ borderRadius: 16 }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📘 Top Favorite Books (Pie Chart)</Text>
        <PieChart
          data={data.topFavoriteBooks.map((book, index) => ({
            name: book.title,
            population: book.totalFavorites,
            color: ["#f00", "#0f0", "#00f", "#ff0", "#0ff"][index % 5],
            legendFontColor: "#333",
            legendFontSize: 12,
          }))}
          width={chartWidth}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  bookCard: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookInfo: {
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TopRatedScreen;
