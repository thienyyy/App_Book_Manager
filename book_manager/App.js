import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// ✅ Hiện đang test UserManagerScreen
import UserManagerScreen from './src/screens/seller/UserManagementScreen';

// ✅ Màn hình hồ sơ người dùng
import MyProfileScreen from './src/screens/profile/ProfileScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
// 🚫 Tạm thời ẩn các màn hình khác
// import MyBooksScreen from './src/screens/books/MyBooksScreen';
// import AddBookScreen from './src/screens/books/AddBookScreen';
// import EditBookScreen from './src/screens/books/EditBookScreen';
// import BookDetailScreen from './src/screens/books/BookDetailScreen';
// import RevenueScreen from './src/screens/seller/RevenueScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/*
// 📦 Tab quản lý sách (ẩn tạm)
function BookStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyBooks"
        component={MyBooksScreen}
        options={{ title: '📚 My Books' }}
      />
      <Stack.Screen name="AddBook" component={AddBookScreen} />
      <Stack.Screen name="EditBook" component={EditBookScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
    </Stack.Navigator>
  );
}
*/

// ✅ Stack cho các màn hình hồ sơ (profile)
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyProfile" component={MyProfileScreen} options={{ title: 'My Profile' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
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

          {/* ✅ Tab quản lý người dùng (đang bật) */}
          <Tab.Screen
            name="Users"
            component={UserManagerScreen}
            options={{ title: 'User Management' }}
          />

          {/* ✅ Tab hồ sơ cá nhân */}
          <Tab.Screen
            name="Profile"
            component={ProfileStack}
            options={{ title: 'My Profile' }}
          />

          {/*
          // 🚫 Tab quản lý sách (ẩn tạm thời để test)
          <Tab.Screen
            name="Books"
            component={BookStack}
            options={{ title: 'Books' }}
          />
          
          // 🚫 Tab doanh thu (ẩn tạm thời để test)
          <Tab.Screen
            name="Revenue"
            component={RevenueScreen}
            options={{ title: 'Revenue' }}
          />
          */}
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
