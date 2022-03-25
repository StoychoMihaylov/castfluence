
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import AudioRecorder from './components/audio_handler/AudioRecorder';
import Page from './components/audio_handler/Page';

export type RootStackParams = {
  Page: any;
  Home: any;
  Profile: any;
  AudioRecorder: any;
}

const Stack = createNativeStackNavigator<RootStackParams>();

export const CastfluenceContext = React.createContext({});

const App = () => {
  return (
    <NavigationContainer>
      <CastfluenceContext.Provider value={"Initial"}>
        <Stack.Navigator initialRouteName='Home' >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Home screen' }}
          />
          <Stack.Screen
            name="Page"
            component={Page}
            options={{ title: 'Page' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profile screen' }}
          />
            <Stack.Screen
            name="AudioRecorder"
            component={AudioRecorder}
            options={{ title: 'Audio recorder' }}
          />
        </Stack.Navigator>
      </CastfluenceContext.Provider>
    </NavigationContainer>
  );
};

export default App;
