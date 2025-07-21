import React, { useEffect, useState } from "react";
import { View, Text } from 'react-native';
import { AuthProvider } from "./context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Auth Screens
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import VerifyOTPScreen from "./src/screens/auth/VerifyOTPScreen";
import HomeScreen from "./src/screens/auth/HomeScreen";

// User Management
import UserManagerScreen from "./src/screens/seller/UserManagementScreen";

// Profile Screens
import MyProfileScreen from "./src/screens/profile/profileScreen";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import EditProfileScreen from "./src/screens/profile/EditProfileScreen";
import ChangePasswordScreen from "./src/screens/profile/ChangePasswordScreen";

// Book Screens
import MyBooksScreen from "./src/screens/books/MyBooksScreen";
import AddBookScreen from "./src/screens/books/AddBookScreen";
import EditBookScreen from "./src/screens/books/EditBookScreen";
import BookDetailScreen from "./src/screens/books/BookDetailScreen";

// Revenue Screens
import SellerRevenueScreen from "./src/screens/seller/SellerRevenueScreen";
import BookRevenueListScreen from "./src/screens/seller/BookRevenueListScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack (Login, Register)
function AuthStack({ onLoginSuccess }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}

// Book Stack
function BookStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyBooks" component={MyBooksScreen} />
      <Stack.Screen name="AddBook" component={AddBookScreen} />
      <Stack.Screen name="EditBook" component={EditBookScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
    </Stack.Navigator>
  );
}

// Revenue Stack
function RevenueStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SellerRevenue" component={SellerRevenueScreen} />
      <Stack.Screen name="BookRevenueList" component={BookRevenueListScreen} />
    </Stack.Navigator>
  );
}

// Tabs when logged in
function MainTabs() {
  const { user, isLoading } = useContext(AuthContext);
  console.log('[DEBUG] MainTabs user:', user);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Đang tải thông tin người dùng...</Text>
      </View>
    );
  }
  if (!user || !user.role) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không tìm thấy thông tin người dùng hoặc role!</Text>
      </View>
    );
  }
  if (user.role === 'seller') {
    return (
      <Tab.Navigator
        initialRouteName="Users"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#007bff",
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ color, size }) => {
            let iconName = "alert-circle";
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
        <Tab.Screen name="Profile" component={ProfileStack} />
        <Tab.Screen name="Books" component={BookStack} />
        <Tab.Screen name="Revenue" component={RevenueStack} />
      </Tab.Navigator>
    );
  }
  // user thường chỉ có tab Home
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
              <Stack.Screen name="MainTabs" component={MainTabs} />
            ) : (
              <Stack.Screen name="Auth">
                {(props) => (
                  <AuthStack {...props} onLoginSuccess={() => setIsLoggedIn(true)} />
                )}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}
