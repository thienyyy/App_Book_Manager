import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions,
} from "react-native";
import { getRatingStats } from "../../api/revenue";
import { Ionicons } from "@expo/vector-icons";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useFocusEffect } from "@react-navigation/native";

const RevenueScreen = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRevenue = async () => {
    try {
      const data = await getRatingStats();
      setRevenueData(data);
    } catch (error) {
      console.log("❌ Failed to load revenue:", error.message);
      Alert.alert("Error", "Could not load revenue data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadRevenue();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadRevenue();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (!revenueData || !revenueData.topRatedBooks || !revenueData.topFavoriteBooks) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16, color: "red" }}>No book data found.</Text>
      </View>
    );
  }

  // Dữ liệu biểu đồ từ backend
  const topRatedBooks = revenueData.topRatedBooks;
  const topFavoriteBooks = revenueData.topFavoriteBooks;

  const ratedTitles = topRatedBooks.map((book) => book.title);
  const ratedValues = topRatedBooks.map((book) => book.averageRating || 0);

  const favoriteTitles = topFavoriteBooks.map((book) => book.title);
  const favoriteValues = topFavoriteBooks.map((book) => book.totalFavorites || 0);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>📚 Book Statistics</Text>

      {/* Top Favorite Books */}
      <Text style={styles.subHeader}>💖 Top Favorite Books</Text>
      <BarChart
        data={{
          labels: favoriteTitles,
          datasets: [{ data: favoriteValues }],
        }}
        width={Dimensions.get("window").width - 32}
        height={250}
        fromZero
        showValuesOnTopOfBars
        chartConfig={chartConfig}
        verticalLabelRotation={45}
        style={styles.chart}
      />

      {/* Top Rated Books */}
      <Text style={styles.subHeader}>⭐ Top Rated Books</Text>
      <BarChart
        data={{
          labels: ratedTitles,
          datasets: [{ data: ratedValues }],
        }}
        width={Dimensions.get("window").width - 32}
        height={250}
        fromZero
        showValuesOnTopOfBars
        chartConfig={chartConfig}
        verticalLabelRotation={45}
        style={styles.chart}
      />
    </ScrollView>
  );
};

export default RevenueScreen;

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 12,
    color: "#444",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
