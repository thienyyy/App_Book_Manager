import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import VerifyOTPScreen from './screens/auth/VerifyOTPScreen';
import EditProfileScreen from './screens/profile/EditProfileScreen';
import ChangePasswordScreen from './screens/profile/ChangePasswordScreen';
import HomeScreen from './screens/auth/HomeScreen';
 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}
