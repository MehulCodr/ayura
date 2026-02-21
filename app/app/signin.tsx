import { Feather } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SvgXml } from 'react-native-svg';

// SVG for the circular logo (reused from signup)
const logoSvgCircular = `
<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="30" cy="30" r="30" fill="#4caf50"/>
<path d="M30 15 C 40 20, 45 30, 30 45 C 20 30, 25 20, 30 15 Z" fill="none" stroke="white" stroke-width="2"/>
</svg>
`;

const SignInScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // In a real app, this would check credentials against a backend
  const handleLogin = () => {
    if (!username || !password) {
        Alert.alert('Error', 'Please enter both username and password.');
        return;
    }
    // Example: router.replace('/farmerDashboard'); 
    router.replace('/chooseRole'); // Adjust based on user role
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        enabled={true}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          contentInsetAdjustmentBehavior="automatic"
        >
        <View style={styles.header}>
            <SvgXml xml={logoSvgCircular} width="60" height="60" />
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Log in to continue your journey</Text>
        </View>

        <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <TextInput 
                style={styles.input} 
                value={username} 
                onChangeText={setUsername} 
                placeholder="Enter your username" 
                placeholderTextColor="#aaa"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
                <TextInput 
                    style={styles.inputPassword} 
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password" 
                    placeholderTextColor="#aaa" 
                    secureTextEntry={!isPasswordVisible} 
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#888" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
            <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Link href="/signup" style={styles.signupLink}>Sign Up</Link>
            </Text>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- STYLES (Similar to your existing UI) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FDF8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontFamily: 'Lato-Bold',
    fontSize: 28,
    color: '#2e7d32',
    marginTop: 20,
  },
  subtitle: {
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    color: '#4caf50',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  label: {
    fontFamily: 'Lato-Bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
  },
  forgotPasswordText: {
    textAlign: 'right',
    marginTop: 12,
    fontFamily: 'Lato-Regular',
    color: '#4caf50',
    fontSize: 14,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 40,
  },
  loginButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Lato-Bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingBottom: 20,
  },
  signupText: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: '#555',
  },
  signupLink: {
    color: '#4caf50',
    fontFamily: 'Lato-Bold',
  },
});

export default SignInScreen;