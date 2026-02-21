import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

// Your SVG XML content for the logo
const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M50,10 C80,20 90,50 50,90 C10,50 20,20 50,10 Z" fill="#2e7d32"/>
  <path d="M50,10 C50,40 70,50 50,90" fill="none" stroke="#4caf50" stroke-width="3"/>
</svg>
`;

const SplashScreen = () => {
  useEffect(() => {
    // Wait for 5 seconds then navigate to the login screen
    const timer = setTimeout(() => {
      // 'replace' ensures the user can't go back to the splash screen
      router.replace('/login');
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <View style={styles.container}>
      <SvgXml xml={logoSvg} width="150" height="150" />
      <Text style={styles.title}>Ayura</Text>
      <Text style={styles.slogan}>“Trace the Journey, Trust the Herb”</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Lato-Bold',
    fontSize: 40,
    color: '#2e7d32', // Dark green
    marginTop: 24,
  },
  slogan: {
    fontFamily: 'Lato-Italic',
    fontSize: 18,
    color: '#4caf50', // Lighter green
    marginTop: 12,
  },
});

export default SplashScreen;