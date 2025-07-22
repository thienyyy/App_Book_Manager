import React, { useContext } from "react";
import { View, Text } from "react-native";
import { AuthContext } from "./context/AuthContext";

function MainTabs() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View>
        <Text>Đang tải thông tin người dùng...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View>
        <Text>Chưa đăng nhập hoặc không có thông tin user.</Text>
      </View>
    );
  }

  if (user.role === "seller") {
    return (
      // Hiển thị tab dành cho seller
      <SellerTabs />
    );
  }

  // Nếu không phải seller thì xem là user thường
  return (
    // Hiển thị tab dành cho user thường
    <UserTabs />
  );
}
