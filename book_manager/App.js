import "react-native-gesture-handler";
import React, { useState, useEffect, useContext } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { getHeaderTitle } from "@react-navigation/elements";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import VerifyOTPScreen from "./src/screens/auth/VerifyOTPScreen";
import HomeScreen from "./src/screens/auth/HomeScreen";
import UserManagerScreen from "./src/screens/seller/UserManagementScreen";
import MyProfileScreen from "./src/screens/profile/ProfileScreen";
import ChangePasswordScreen from "./src/screens/profile/ChangePasswordScreen";
import MyBooksScreen from "./src/screens/books/MyBooksScreen";
import AddBookScreen from "./src/screens/books/AddBookScreen";
import EditBookScreen from "./src/screens/books/EditBookScreen";
import BookDetailScreen from "./src/screens/Book/BookDetailList";
import BookListScreen from "./src/screens/Book/ScreenBookiList";
import TopRatedScreen from "./src/screens/seller/TopRatedScreen";
import FavoriteScreen from "./src/screens/Book/FavoriteScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Custom Header
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
        {canGoBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>
    </LinearGradient>
  );
}

// ✅ Auth Stack
function AuthStack({ onLoginSuccess }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: ({ navigation, route, options }) => {
          const title = getHeaderTitle(options, route.name);
          const canGoBack = navigation.canGoBack();
          return <CustomHeader title={title} canGoBack={canGoBack} />;
        },
      }}
    >
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
    </Stack.Navigator>
  );
}

// ✅ Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: ({ navigation, route, options }) => {
          const title = getHeaderTitle(options, route.name);
          const canGoBack = navigation.canGoBack();
          return <CustomHeader title={title} canGoBack={canGoBack} />;
        },
      }}
    >
      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{ title: "Hồ sơ của tôi" }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: "Đổi mật khẩu" }}
      />
    </Stack.Navigator>
  );
}

// ✅ Book Stack
function BookStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: ({ navigation, route, options }) => {
          const title = getHeaderTitle(options, route.name);
          const canGoBack = navigation.canGoBack();
          return <CustomHeader title={title} canGoBack={canGoBack} />;
        },
      }}
    >
      <Stack.Screen
        name="MyBooks"
        component={MyBooksScreen}
        options={{ title: "Sách của tôi" }}
      />
      <Stack.Screen
        name="AddBook"
        component={AddBookScreen}
        options={{ title: "Thêm sách" }}
      />
      <Stack.Screen
        name="EditBook"
        component={EditBookScreen}
        options={{ title: "Sửa sách" }}
      />
      <Stack.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={{ title: "Sách yêu thích" }}
      />
    </Stack.Navigator>
  );
}

// ✅ Revenue Stack
function RevenueStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: ({ navigation, route, options }) => {
          const title = getHeaderTitle(options, route.name);
          const canGoBack = navigation.canGoBack();
          return <CustomHeader title={title} canGoBack={canGoBack} />;
        },
      }}
    >
      <Stack.Screen
        name="TopRatedScreen"
        component={TopRatedScreen}
        options={{ title: "Doanh thu cao" }}
      />
    </Stack.Navigator>
  );
}

// ✅ Tabs cho user thường
function UserTabs({ onLogout }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "FavoriteScreen") iconName = "heart";
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <BookListScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={{ title: "Yêu thích" }}
      />
      <Tab.Screen
        name="Profile"
        children={(props) => <MyProfileScreen {...props} onLogout={onLogout} />}
      />
    </Tab.Navigator>
  );
}

// ✅ Tabs cho Seller
function SellerTabs({ onLogout }) {
  return (
    <Tab.Navigator
      initialRouteName="Users"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Users") iconName = "account-group";
          else if (route.name === "Profile") iconName = "account";
          else if (route.name === "Books") iconName = "book-open-page-variant";
          else if (route.name === "Revenue") iconName = "currency-usd";
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Users" component={UserManagerScreen} />
      <Tab.Screen
        name="Profile"
        children={(props) => <MyProfileScreen {...props} onLogout={onLogout} />}
      />
      <Tab.Screen name="Books" component={BookStack} />
      <Tab.Screen name="Revenue" component={RevenueStack} />
    </Tab.Navigator>
  );
}

// ✅ MainTabs hiển thị theo role
function MainTabs({ onLogout }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#f5576c" />
        <Text>Đang tải thông tin người dùng...</Text>
      </View>
    );
  }
  if (!user || !user.role) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không tìm thấy thông tin người dùng hoặc role!</Text>
      </View>
    );
  }
  return user.role === "seller" ? (
    <SellerTabs onLogout={onLogout} />
  ) : (
    <UserTabs onLogout={onLogout} />
  );
}

// ✅ App Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
      setCheckingAuth(false);
    };
    checkLogin();
  }, []);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Đang kiểm tra đăng nhập...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PaperProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator screenOptions={{ headerShown: true }}>
              {isLoggedIn ? (
                <Stack.Screen name="MainTabs">
                  {(props) => (
                    <MainTabs
                      {...props}
                      onLogout={() => setIsLoggedIn(false)}
                    />
                  )}
                </Stack.Screen>
              ) : (
                <Stack.Screen name="Auth">
                  {(props) => (
                    <AuthStack
                      {...props}
                      onLoginSuccess={() => setIsLoggedIn(true)}
                    />
                  )}
                </Stack.Screen>
              )}
              <Stack.Screen
                name="BookDetail"
                component={BookDetailScreen}
                options={{ title: "Chi tiết sách" }}
              />
              <Stack.Screen
                name="ChangePassword"
                component={ChangePasswordScreen}
                options={{ title: "Đổi mật khẩu" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
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
