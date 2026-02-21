import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen'; // Note: Different from our custom screen

import CustomSplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/loginScreen';

const Stack = createNativeStackNavigator();

// Keep the native splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Lato-Regular': require('./assets/fonts/Lato-Regular.ttf'),
    'Lato-Bold': require('./assets/fonts/Lato-Bold.ttf'),
    'Lato-Italic': require('./assets/fonts/Lato-Italic.ttf'),
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      // This hides the native splash screen once the app is ready to render
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Return null while fonts are loading
  }

  return (
    // Call onLayout to hide the splash screen
    <NavigationContainer onReady={onLayoutRootView}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Splash"
          component={CustomSplashScreen}
          options={{
            animation: 'fade', // Use fade animation for transition
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            animation: 'fade',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}