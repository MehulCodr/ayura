import { Link } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

// --- SVG assets ---
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,10 C80,20 90,50 50,90 C10,50 20,20 50,10 Z" fill="#2e7d32"/><path d="M50,10 C50,40 70,50 50,90" fill="none" stroke="#4caf50" stroke-width="3"/></svg>`;

const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <SvgXml xml={logoSvg} width="100" height="100" />
          <Text style={styles.title}>Ayura</Text>
          <Text style={styles.subtitle}>Welcome to your herbal journey</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Link href="/signin" asChild>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login with Email</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/signup" asChild>
            <TouchableOpacity style={styles.signupButton}>
              <Text style={styles.signupButtonText}>Sign Up with Email</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FDF8' },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-around', paddingTop: 60 },
  header: { alignItems: 'center' },
  title: { fontFamily: 'Lato-Bold', fontSize: 32, color: '#2e7d32', marginTop: 20 },
  subtitle: { fontFamily: 'Lato-Regular', fontSize: 16, color: '#555', marginTop: 8 },
  buttonContainer: { width: '100%' },
  loginButton: { backgroundColor: '#4caf50', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  loginButtonText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Lato-Bold' },
  signupButton: { backgroundColor: '#FFFFFF', paddingVertical: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#4caf50', marginTop: 16 },
  signupButtonText: { color: '#4caf50', fontSize: 18, fontFamily: 'Lato-Bold' },
  footer: { alignItems: 'center' },
  footerText: { fontSize: 12, color: '#888', textAlign: 'center', fontFamily: 'Lato-Regular' },
});

export default LoginScreen;