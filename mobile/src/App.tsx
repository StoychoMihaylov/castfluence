
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';

export type RootStackParams = {
  Home: any;
  Profile: any;
}

const Stack = createNativeStackNavigator<RootStackParams>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home screen' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile screen' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
