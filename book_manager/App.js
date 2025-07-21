import React from "react";
import { StyleSheet, SafeAreaView, Platform } from "react-native";
import CartScreen from "./screens/CartScreen"; // Điều chỉnh đường dẫn nếu cần

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <CartScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 25 : 0, // Điều chỉnh cho status bar trên Android
  },
});
