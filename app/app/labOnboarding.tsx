import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const LabOnboardingScreen: React.FC = () => {
  const [pocName, setPocName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [labCertificate, setLabCertificate] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleGetLocation = async () => {
    try {
      setLocationLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access location was denied.');
        setLocationLoading(false);
        return;
      }
      
      // Optimized location options for faster response
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Good balance between accuracy and speed
        timeInterval: 1000, // Minimum time interval between updates
        distanceInterval: 10, // Minimum distance for updates
      });
      setLocation(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Failed to get your location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };
  
  const handlePickCertificate = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setLabCertificate(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Could not open document picker.");
      console.error(error);
    }
  };

  const handleSubmit = () => {
    if (!pocName || !email || !phone || !location || !labCertificate) {
      Alert.alert("Validation Error", "Please fill in all fields and upload your lab certification.");
      return;
    }
    setLoading(true);

    const labData = {
      pocName, email, phone,
      location: `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`,
      certificateName: labCertificate.name,
    };
    
    // Simulate saving and navigate to the dashboard, passing the lab's name
    Alert.alert("Registration Submitted", "Your lab profile is now active.", [{
      text: "Go to Dashboard",
      onPress: () => router.replace({
        pathname: '/labDashboard',
        params: { labName: pocName } // Pass lab name for a personalized welcome
      })
    }]);
    setLoading(false);
  };

  return (
    <LinearGradient colors={['#F7FDF8', '#E6F5E9']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior="padding"
          keyboardVerticalOffset={0}
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
            <Text style={styles.title}>Lab Registration</Text>
            <Text style={styles.subtitle}>Enter your laboratory details to get started</Text>
          </View>
          <View style={styles.form}>
            <Text style={styles.label}>Point of Contact (POC) Name</Text>
            <TextInput style={styles.input} value={pocName} onChangeText={setPocName} placeholder="Enter the contact person's name" />
            <Text style={styles.label}>Official Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter lab's contact email" keyboardType="email-address"/>
            <Text style={styles.label}>Official Phone Number</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Enter lab's phone number" keyboardType="phone-pad"/>
            <Text style={styles.label}>Lab GPS Location</Text>
            <TouchableOpacity 
                style={styles.locationButton} 
                onPress={handleGetLocation}
                disabled={locationLoading}
            >
                {locationLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Feather name="map-pin" size={20} color="#FFFFFF" />
                )}
                <Text style={styles.locationButtonText}>
                    {locationLoading ? 'Getting Location...' : 'Get Current Location'}
                </Text>
            </TouchableOpacity>
            {location && <Text style={styles.locationText}>Lat: {location.coords.latitude.toFixed(4)}, Lon: {location.coords.longitude.toFixed(4)}</Text>}
            <Text style={styles.label}>Lab Certification (NABL, etc.)</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickCertificate}>
                <Feather name="upload" size={20} color="#4caf50" />
                <Text style={styles.uploadButtonText}>Upload Certificate (PDF)</Text>
            </TouchableOpacity>
            {labCertificate && <Text style={styles.fileUploadedText}>{labCertificate.name}</Text>}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit Registration</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// --- STYLES (Similar to other onboarding pages) ---
const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { 
        paddingHorizontal: 20,
        paddingTop: 80, 
        paddingBottom: 50
    },
    header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
    title: { fontSize: 28, fontFamily: 'Lato-Bold', color: '#2e7d32' },
    subtitle: { fontSize: 16, fontFamily: 'Lato-Regular', color: '#4caf50', marginTop: 8 },
    form: { width: '100%' },
    label: { fontFamily: 'Lato-Bold', fontSize: 16, color: '#333', marginBottom: 8, marginTop: 20 },
    input: { backgroundColor: '#FFFFFF', height: 50, borderColor: '#DDD', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontFamily: 'Lato-Regular', fontSize: 16 },
    locationButton: { flexDirection: 'row', backgroundColor: '#4caf50', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    locationButtonText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 16, marginLeft: 10 },
    locationText: { fontFamily: 'Lato-Regular', color: '#555', marginTop: 8, textAlign: 'center' },
    uploadButton: { flexDirection: 'row', backgroundColor: '#E6F5E9', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#4caf50', marginTop: 12 },
    uploadButtonText: { color: '#4caf50', fontFamily: 'Lato-Bold', fontSize: 16, marginLeft: 10 },
    fileUploadedText: { fontFamily: 'Lato-Italic', color: '#2e7d32', marginTop: 10, textAlign: 'center' },
    submitButton: { backgroundColor: '#2e7d32', height: 55, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
    submitButtonText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 18 },
});

export default LabOnboardingScreen;