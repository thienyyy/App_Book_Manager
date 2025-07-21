import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// ✅ Quản lý người dùng
import UserManagerScreen from './src/screens/seller/UserManagementScreen';

// ✅ Hồ sơ người dùng
import MyProfileScreen from './src/screens/profile/ProfileScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';

// ✅ Quản lý sách
import MyBooksScreen from './src/screens/books/MyBooksScreen';
import AddBookScreen from './src/screens/books/AddBookScreen';
import EditBookScreen from './src/screens/books/EditBookScreen';
import BookDetailScreen from './src/screens/books/BookDetailScreen';

// ✅ Thống kê doanh thu mới
import SellerRevenueScreen from './src/screens/seller/SellerRevenueScreen';
import BookRevenueListScreen from './src/screens/seller/BookRevenueListScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Stack quản lý sách
function BookStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyBooks" component={MyBooksScreen} options={{ title: '📚 My Books' }} />
      <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: '➕ Add Book' }} />
      <Stack.Screen name="EditBook" component={EditBookScreen} options={{ title: '✏️ Edit Book' }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: '📖 Book Details' }} />
    </Stack.Navigator>
  );
}

// ✅ Stack hồ sơ
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyProfile" component={MyProfileScreen} options={{ title: 'My Profile' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
    </Stack.Navigator>
  );
}

// ✅ Stack thống kê doanh thu
function RevenueStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SellerRevenue" component={SellerRevenueScreen} options={{ title: '📈 Revenue Overview' }} />
      <Stack.Screen name="BookRevenueList" component={BookRevenueListScreen} options={{ title: '📚 Book Revenue' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: true,
            tabBarActiveTintColor: '#007bff',
            tabBarInactiveTintColor: 'gray',
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Users') iconName = 'account-group';
              if (route.name === 'Profile') iconName = 'account';
              if (route.name === 'Books') iconName = 'book-open-page-variant';
              if (route.name === 'Revenue') iconName = 'currency-usd';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Users" component={UserManagerScreen} options={{ title: 'User Management' }} />
          <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'My Profile' }} />
          <Tab.Screen name="Books" component={BookStack} options={{ title: 'Books' }} />
          <Tab.Screen name="Revenue" component={RevenueStack} options={{ title: 'Revenue' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
