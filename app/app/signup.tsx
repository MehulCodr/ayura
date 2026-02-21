import { Feather } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
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

const logoSvgCircular = `<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="30" fill="#4caf50"/><path d="M30 15 C 40 20, 45 30, 30 45 C 20 30, 25 20, 30 15 Z" fill="none" stroke="white" stroke-width="2"/></svg>`;

const SignUpScreen = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // Simple navigation, no validation or API call
  const handleNext = () => {
    router.push('/chooseRole');
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
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>Start your herbal journey with us</Text>
        </View>

        <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <TextInput style={styles.input} placeholder="Enter your username" placeholderTextColor="#aaa" />
            
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} placeholder="Enter your phone number" placeholderTextColor="#aaa" keyboardType="phone-pad" />
            
            <Text style={styles.label}>Email ID</Text>
            <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor="#aaa" keyboardType="email-address" autoCapitalize="none" />
            
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
                <TextInput style={styles.inputPassword} placeholder="Create a password" placeholderTextColor="#aaa" secureTextEntry={!isPasswordVisible} />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}><Feather name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#888" /></TouchableOpacity>
            </View>
            
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
                <TextInput style={styles.inputPassword} placeholder="Confirm your password" placeholderTextColor="#aaa" secureTextEntry={!isConfirmPasswordVisible} />
                <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}><Feather name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={20} color="#888" /></TouchableOpacity>
            </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
            <Text style={styles.loginText}>Already have an account?{' '}<Link href="/signin" style={styles.loginLink}>Login</Link></Text>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7FDF8' },
    scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 80, paddingVertical: 20, justifyContent: 'space-between' },
    header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
    title: { fontFamily: 'Lato-Bold', fontSize: 28, color: '#2e7d32', marginTop: 16 },
    subtitle: { fontFamily: 'Lato-Regular', fontSize: 16, color: '#4caf50', marginTop: 4 },
    form: { width: '100%' },
    label: { fontFamily: 'Lato-Bold', fontSize: 14, color: '#333', marginBottom: 8, marginTop: 16 },
    input: { backgroundColor: '#FFFFFF', height: 50, borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontFamily: 'Lato-Regular', fontSize: 16 },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15 },
    inputPassword: { flex: 1, height: 50, fontFamily: 'Lato-Regular', fontSize: 16 },
    buttonContainer: { width: '100%', marginTop: 30 },
    nextButton: { backgroundColor: '#4caf50', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
    nextButtonText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Lato-Bold' },
    footer: { alignItems: 'center', marginTop: 20 },
    loginText: { fontFamily: 'Lato-Regular', fontSize: 14, color: '#555' },
    loginLink: { color: '#4caf50', fontFamily: 'Lato-Bold' },
});

export default SignUpScreen;