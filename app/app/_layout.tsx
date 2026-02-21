import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

// Keep the native splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
    'Lato-Italic': require('../assets/fonts/Lato-Italic.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signIn" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="chooseRole" options={{ headerShown: false }} />
        <Stack.Screen name="farmerOnboarding" options={{ headerShown: false }} />
        <Stack.Screen name="farmerDashboard" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="mediatorOnboarding" options={{ headerShown: false }} />
        <Stack.Screen name="mediatorDashboard" options={{ headerShown: false }} />
        <Stack.Screen name="mediatorProfile" options={{ headerShown: false }} />
        <Stack.Screen name="manufacturerOnboarding" options={{ headerShown: false }} />
        <Stack.Screen name="manufacturerDashboard" options={{ headerShown: false }} />
        <Stack.Screen name="manufacturerProfile" options={{ headerShown: false }} />
         <Stack.Screen name="scanner" options={{ headerShown: false }} />
    <Stack.Screen name="displayHarvest" options={{ headerShown: false }} />
     <Stack.Screen name="harvestPurchaseDetails" options={{ headerShown: false }} />
      <Stack.Screen name="labOnboarding" options={{ headerShown: false }} />
    <Stack.Screen name="labDashboard" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});