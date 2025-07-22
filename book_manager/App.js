import "react-native-gesture-handler";
import React from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { getHeaderTitle } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/Ionicons";

import BookListScreen from "./src/screens/Book/ScreenBookiList";
import BookDetailScreen from "./src/screens/Book/BookDetailList";
import FavoriteScreen from "./src/screens/Book/FavoriteScreen";

const Stack = createStackNavigator();

// Custom Header Component
function CustomHeader({ title, canGoBack }) {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={["#f093fb", "#f5576c"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerContainer}
    >
      <View style={styles.headerContent}>
        {/* Nút quay lại nếu có thể */}
        {canGoBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} /> // placeholder để cân layout
        )}

        {/* Tiêu đề ở giữa */}
        <Text style={styles.headerTitle}>{title}</Text>

        {/* Chừa chỗ bên phải để căn giữa */}
        <View style={{ width: 40 }} />
      </View>
    </LinearGradient>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          header: ({ options }) => {
            const title = getHeaderTitle(options, route.name);
            const canGoBack = navigation.canGoBack();
            return <CustomHeader title={title} canGoBack={canGoBack} />;
          },
        })}
      >
        <Stack.Screen
          name="BookList"
          component={BookListScreen}
          options={{ title: "Danh sách sách" }}
        />
        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{ title: "Chi tiết sách" }}
        />
        <Stack.Screen
          name="FavoriteScreen"
          component={FavoriteScreen}
          options={{ title: "Sách yêu thích" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 90,
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
