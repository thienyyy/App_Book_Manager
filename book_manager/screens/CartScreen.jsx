import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  TouchableOpacity, // Dùng cho các button
  Image, // Dùng cho hình ảnh sản phẩm
  RefreshControl, // Dùng cho chức năng kéo xuống làm mới
  Alert, // Dùng cho thông báo xác nhận xóa
} from "react-native";

// Import icons từ react-native-vector-icons
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CartScreen = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State cho chức năng kéo xuống làm mới

  // THAY THẾ 'YOUR_LOCAL_IP_ADDRESS' BẰNG ĐỊA CHỈ IP CỤ THỂ CỦA MÁY TÍNH BẠN
  // Đã có sẵn địa chỉ IP trong code của bạn: http://192.168.75.1:3000/api/cart
  const API_URL = "http://192.168.75.1:3000/api/cart";

  // TOKEN CỦA BẠN - LƯU Ý: TRONG ỨNG DỤNG THỰC TẾ, TOKEN NÀY PHẢI ĐƯỢC LƯU TRỮ AN TOÀN (ví dụ: AsyncStorage)
  // VÀ LẤY RA KHI CẦN, KHÔNG NÊN HARDCODE NHƯ THẾ NÀY.
  const AUTH_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4N2UwNDI0MzBhNmQ3OWNmODllNGI3NSIsImlhdCI6MTc1MzEwOTU1MywiZXhwIjoxNzUzMTEwNzUzfQ.19Nx6oV0-pYwvUNnWABc0SWyRmpSdpgoeCuU-zxZBSM";

  const fetchCartData = async () => {
    try {
      setLoading(true); // Đặt lại loading khi bắt đầu fetch
      setError(null); // Xóa lỗi cũ
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}. Message: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      setCartData(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch Cart Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false); // Dừng refreshing sau khi fetch xong
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []); // Chạy một lần khi component mount

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const updateQuantity = async (
    itemId,
    productId,
    currentQuantity,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    // Tối ưu: Nếu số lượng không đổi, không làm gì
    if (newQuantity === currentQuantity) return;

    // Cập nhật giao diện ngay lập tức để có phản hồi nhanh (Optimistic Update)
    const prevCartData = cartData; // Lưu trạng thái trước đó để rollback nếu có lỗi
    setCartData((prevData) => ({
      ...prevData,
      items: prevData.items.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      ),
    }));

    try {
      // Gọi API để cập nhật số lượng trên backend
      const response = await fetch(`${API_URL}/update/${productId}`, {
        // Giả sử có endpoint này
        method: "PUT", // Hoặc 'PUT'
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update quantity: ${response.status}. Message: ${
            errorData.message || "Unknown error"
          }`
        );
      }
      // Nếu thành công, không làm gì (vì đã cập nhật optimistic)
    } catch (err) {
      Alert.alert("Lỗi", `Không thể cập nhật số lượng: ${err.message}`);
      // Hoàn tác lại trạng thái cũ nếu có lỗi
      setCartData(prevCartData);
      console.error("Error updating quantity:", err);
    }
  };

  const removeItem = (productId) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: async () => {
            // Optimistic update
            const prevCartData = cartData;
            setCartData((prevData) => ({
              ...prevData,
              items: prevData.items.filter((item) => item._id !== productId),
            }));

            try {
              // Gọi API để xóa sản phẩm trên backend
              const response = await fetch(`${API_URL}/remove/${productId}`, {
                // Giả sử có endpoint này
                method: "DELETE", // Hoặc 'DELETE'
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${AUTH_TOKEN}`,
                },
                body: JSON.stringify({ productId }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  `Failed to remove item: ${response.status}. Message: ${
                    errorData.message || "Unknown error"
                  }`
                );
              }
              // Nếu thành công, không làm gì (vì đã cập nhật optimistic)
            } catch (err) {
              Alert.alert("Lỗi", `Không thể xóa sản phẩm: ${err.message}`);
              // Hoàn tác lại trạng thái cũ nếu có lỗi
              setCartData(prevCartData);
              console.error("Error removing item:", err);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const calculateTotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    Alert.alert(
      "Thanh toán",
      `Tổng tiền: ${formatPrice(calculateTotal())}\nTiến hành thanh toán!`
      // Ở đây bạn sẽ điều hướng đến màn hình thanh toán hoặc gọi API thanh toán
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCartData(); // Gọi lại hàm fetch data
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Feather
            name="loader"
            size={48}
            color="#FF6347"
            style={styles.loadingIcon}
          />
          <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => Alert.alert("Thông báo", "Quay lại màn hình trước")}
        >
          <Feather name="arrow-left" size={24} color="#4A4A4A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        <View style={styles.cartCountBadge}>
          <Text style={styles.cartCountText}>
            {cartData?.items?.length || 0}
          </Text>
        </View>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartData?.items}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6347"]}
            tintColor="#FF6347"
          />
        }
        ListHeaderComponent={() => (
          <View style={styles.refreshHintContainer}>
            <Text style={styles.refreshHintText}>Kéo xuống để làm mới</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemImageWrapper}>
              {item.productId.image ? (
                <Image
                  source={{
                    uri: `http://192.168.75.1:3000/${item.productId.image.replace(
                      /\\/g,
                      "/"
                    )}`,
                  }} // Cần điều chỉnh base URL cho hình ảnh
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.noImagePlaceholder}>
                  <Text style={styles.noImageIcon}>📚</Text>
                  <Text style={styles.noImageText}>Không ảnh</Text>
                </View>
              )}
            </View>

            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.productId.title}
              </Text>
              <Text style={styles.itemAuthor}>
                Tác giả: {item.productId.author}
              </Text>
              <Text style={styles.itemCategory}>{item.productId.category}</Text>
              <Text style={styles.itemPrice}>
                {formatPrice(item.productId.price)}
              </Text>
            </View>

            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  updateQuantity(
                    item._id,
                    item.productId._id,
                    item.quantity,
                    item.quantity + 1
                  )
                }
              >
                <Feather name="plus" size={20} color="#FF6347" />
              </TouchableOpacity>
              <Text style={styles.itemQuantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  updateQuantity(
                    item._id,
                    item.productId._id,
                    item.quantity,
                    item.quantity - 1
                  )
                }
              >
                <Feather name="minus" size={20} color="#FF6347" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(item._id)}
              >
                <Feather name="trash-2" size={20} color="#E53935" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyCartContainer}>
            <MaterialCommunityIcons name="cart-off" size={80} color="#CCC" />
            <Text style={styles.emptyCartTitle}>Giỏ hàng trống</Text>
            <Text style={styles.emptyCartText}>
              Hãy thêm sản phẩm vào giỏ hàng
            </Text>
          </View>
        )}
      />

      {/* Footer (Tổng cộng và Thanh toán) */}
      {cartData?.items?.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalAmount}>
              {formatPrice(calculateTotal())}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Thanh toán</Text>
            <Feather name="arrow-right" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8", // bg-gray-50
    paddingTop:
      Platform.OS === "android" ? (Platform.Version >= 21 ? 0 : 25) : 0, // Điều chỉnh cho status bar
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingIcon: {
    // animate-spin không có trong StyleSheet, cần animation riêng hoặc CSS-like properties
    // Chúng ta sẽ bỏ qua animation cho icon trong StyleSheet và dựa vào ActivityIndicator
  },
  loadingText: {
    color: "#6B7280", // text-gray-600
    fontSize: 18, // text-lg
    marginTop: 10,
  },

  // Header Styles
  header: {
    backgroundColor: "#FFF", // bg-white
    paddingHorizontal: 20, // px-5
    paddingVertical: 15, // py-4
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000", // shadow-sm
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2, // for Android shadow
    borderBottomWidth: 1,
    borderColor: "#E5E7EB", // border-b border-gray-200
  },
  headerButton: {
    padding: 5, // p-1
  },
  headerTitle: {
    fontSize: 20, // text-xl
    fontWeight: "600", // font-semibold
    color: "#1F2937", // text-gray-800
    flex: 1,
    textAlign: "center",
  },
  cartCountBadge: {
    backgroundColor: "#EF4444", // bg-pink-500, thay bằng màu hồng đậm hơn cho dễ nhìn
    borderRadius: 9999, // rounded-full
    minWidth: 24, // min-w-6
    height: 24, // h-6
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6, // px-2
  },
  cartCountText: {
    color: "#FFF", // text-white
    fontSize: 12, // text-xs
    fontWeight: "600", // font-semibold
  },

  // Cart Items List Styles
  listContentContainer: {
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
  },
  refreshHintContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    paddingTop: 8,
  },
  refreshHintText: {
    fontSize: 12,
    color: "#6B7280",
  },
  itemContainer: {
    backgroundColor: "#FFF", // bg-white
    borderRadius: 12, // rounded-xl
    padding: 16, // p-4
    marginBottom: 16, // mb-4
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000", // shadow-sm
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  itemImageWrapper: {
    width: 80, // w-20
    height: 96, // h-24
    backgroundColor: "#E5E7EB", // bg-gray-200
    borderRadius: 8, // rounded-lg
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16, // mr-4
    overflow: "hidden", // Để đảm bảo ảnh bo góc
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  noImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  noImageIcon: {
    fontSize: 24, // text-xs tương đương font size nhỏ, tăng lên cho icon to hơn
    color: "#9CA3AF", // text-gray-400
  },
  noImageText: {
    fontSize: 10, // text-xs
    color: "#9CA3AF",
  },
  itemDetails: {
    flex: 1, // flex-1
    marginRight: 8, // mr-2
  },
  itemTitle: {
    fontWeight: "600", // font-semibold
    color: "#1F2937", // text-gray-800
    fontSize: 16, // text-base
    marginBottom: 4, // mb-1
  },
  itemAuthor: {
    color: "#4B5563", // text-gray-600
    fontSize: 14, // text-sm
    marginBottom: 4, // mb-1
  },
  itemCategory: {
    backgroundColor: "#F3F4F6", // bg-gray-100
    color: "#4B5563", // text-gray-600
    fontSize: 12, // text-xs
    paddingHorizontal: 8, // px-2
    paddingVertical: 4, // py-1
    borderRadius: 4, // rounded
    alignSelf: "flex-start", // inline-block
    marginBottom: 8, // mb-2
  },
  itemPrice: {
    color: "#EF4444", // text-pink-500
    fontWeight: "bold",
    fontSize: 16, // text-base
  },
  quantityControls: {
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#FFEBEE", // bg-pink-50
    borderColor: "#FF6347", // border border-pink-500
    borderWidth: 1,
    borderRadius: 9999, // rounded-full
    width: 36, // w-9
    height: 36, // h-9
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4, // mb-1
  },
  itemQuantityText: {
    color: "#1F2937", // text-gray-800
    fontWeight: "600", // font-semibold
    fontSize: 16, // text-base
    marginVertical: 8, // my-2
    minWidth: 24, // min-w-6
    textAlign: "center",
  },
  removeButton: {
    backgroundColor: "#FFEBEB", // bg-red-50
    borderRadius: 9999, // rounded-full
    width: 36, // w-9
    height: 36, // h-9
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8, // Thêm chút khoảng cách
  },

  // Empty Cart Styles
  emptyCartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80, // py-20
  },
  emptyCartTitle: {
    fontSize: 18, // text-lg
    fontWeight: "600", // font-semibold
    color: "#4B5563", // text-gray-600
    marginBottom: 8, // mb-2
  },
  emptyCartText: {
    color: "#6B7280", // text-gray-500
  },

  // Footer Styles
  footer: {
    backgroundColor: "#FFF", // bg-white
    paddingHorizontal: 20, // px-5
    paddingVertical: 15, // py-4
    borderTopWidth: 1,
    borderColor: "#E5E7EB", // border-t border-gray-200
    shadowColor: "#000", // shadow-lg (lớn hơn shadow-sm)
    shadowOffset: { width: 0, height: -2 }, // Shadow hướng lên
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5, // for Android shadow
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16, // mb-4
  },
  totalLabel: {
    color: "#4B5563", // text-gray-600
    fontSize: 16, // text-base
  },
  totalAmount: {
    color: "#EF4444", // text-pink-500
    fontWeight: "bold",
    fontSize: 20, // text-xl
  },
  checkoutButton: {
    width: "100%", // w-full
    backgroundColor: "#EF4444", // bg-pink-500
    paddingVertical: 16, // py-4
    borderRadius: 12, // rounded-xl
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EF4444", // shadow-md
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  checkoutButtonText: {
    color: "#FFF", // text-white
    fontWeight: "600", // font-semibold
    fontSize: 18, // text-lg
    marginRight: 8, // mr-2
  },
});

export default CartScreen;
