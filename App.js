import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AddChatScreen from './screens/AddChatScreen';
import ChatScreen from './screens/ChatScreen';
import { StatusBar } from 'expo-status-bar';


const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#2C6BED" },
  headerTitleStyle: { color: 'white' },
  headerTintColor: 'white',
  gestureEnabled:true
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator /*initialRouteName="Home"*/ screenOptions={globalScreenOptions}>
        <Stack.Screen options={{title:'Login'}} name="Login" component={LoginScreen} />
        <Stack.Screen options={{title:'Register'}} name='Register' component={RegisterScreen} />
        <Stack.Screen options={{title:'Home'}} name='Home' component={HomeScreen} />
        <Stack.Screen options={{title:'AddChat'}} name='AddChat' component={AddChatScreen} />
        <Stack.Screen options={{title:'Chat'}} name='Chat' component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;