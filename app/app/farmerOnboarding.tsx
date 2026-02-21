import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// --- TYPED CustomModal Component ---
type CustomModalProps = {
  visible: boolean;
  options: string[];
  onSelect: (option: string) => void;
  onClose: () => void;
};

const CustomModal: React.FC<CustomModalProps> = ({ visible, options, onSelect, onClose }) => (
  <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalContainer} onPress={onClose} activeOpacity={1}>
      <View style={styles.modalContent}>
        <ScrollView>
            {options.map((option) => (
            <TouchableOpacity key={option} style={styles.modalOption} onPress={() => onSelect(option)}>
                <Text style={styles.modalOptionText}>{option}</Text>
            </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  </Modal>
);


// --- TYPED Main Component ---
const FarmerOnboardingScreen: React.FC = () => {
  const { uid } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [village, setVillage] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [landArea, setLandArea] = useState('');
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [idImage, setIdImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [landAreaUnit, setLandAreaUnit] = useState('acres');
  const [isUnitModalVisible, setIsUnitModalVisible] = useState(false);

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

  const handlePickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setIdImage(result.assets[0]);
    }
  };

  const handleSubmit = () => {
    if (!name || !state || !village || !location || !landArea || !annualRevenue || !idImage) {
        Alert.alert("Validation Error", "Please fill in all fields and upload an ID image.");
        return;
    }

    const farmerData = {
        uid: uid || `mock-user-${Date.now()}`,
        name: name,
        state: state,
        village: village,
        landArea: `${landArea} ${landAreaUnit}`,
        annualRevenue: annualRevenue,
        idImageUri: idImage.uri,
    };
    
    router.replace({ pathname: '/farmerDashboard', params: farmerData });
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
            <Text style={styles.title}>Farmer Registration</Text>
            <Text style={styles.subtitle}>Please provide your details to get started</Text>
          </View>
          <View style={styles.form}>
            <Text style={styles.label}>Name of Farmer</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your full name" />
            <Text style={styles.label}>State</Text>
            <TextInput style={styles.input} value={state} onChangeText={setState} placeholder="e.g., Maharashtra" />
            <Text style={styles.label}>Village</Text>
            <TextInput style={styles.input} value={village} onChangeText={setVillage} placeholder="e.g., Anjanvel" />
            <Text style={styles.label}>GPS Location</Text>
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
            <Text style={styles.label}>Land Area</Text>
            <View style={styles.splitInputContainer}>
                <TextInput style={styles.splitInput} value={landArea} onChangeText={setLandArea} placeholder="e.g., 5" keyboardType="numeric" />
                <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsUnitModalVisible(true)}>
                    <Text style={styles.dropdownText}>{landAreaUnit}</Text>
                    <Feather name="chevron-down" size={20} color="#555" />
                </TouchableOpacity>
            </View>
            <Text style={styles.label}>Annual Revenue (in INR)</Text>
            <TextInput style={styles.input} value={annualRevenue} onChangeText={setAnnualRevenue} placeholder="e.g., 500000" keyboardType="numeric" />
            <Text style={styles.label}>Identity Verification</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
                <Feather name="upload" size={20} color="#4caf50" />
                <Text style={styles.uploadButtonText}>Upload ID Document</Text>
            </TouchableOpacity>
            {idImage && <Image source={{ uri: idImage.uri }} style={styles.imagePreview} />}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit Registration</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
        <CustomModal 
            visible={isUnitModalVisible}
            options={['acres', 'hectare', 'meter sq', 'sq feet']}
            onSelect={(option) => { setLandAreaUnit(option); setIsUnitModalVisible(false); }}
            onClose={() => setIsUnitModalVisible(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

// --- STYLES ---
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
  splitInputContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  splitInput: { flex: 1, marginRight: 10, backgroundColor: '#FFFFFF', height: 50, borderColor: '#DDD', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontFamily: 'Lato-Regular', fontSize: 16 },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', height: 50, borderColor: '#DDD', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, minWidth: 120 },
  dropdownText: { fontFamily: 'Lato-Regular', fontSize: 16, color: '#333' },
  uploadButton: { flexDirection: 'row', backgroundColor: '#E6F5E9', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#4caf50', marginTop: 12 },
  uploadButtonText: { color: '#4caf50', fontFamily: 'Lato-Bold', fontSize: 16, marginLeft: 10 },
  imagePreview: { width: '100%', height: 200, borderRadius: 12, marginTop: 15, resizeMode: 'cover' },
  submitButton: { backgroundColor: '#2e7d32', height: 55, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  submitButtonText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 18 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderRadius: 10, padding: 10, width: '80%', elevation: 5 },
  modalOption: { paddingVertical: 15, alignItems: 'center' },
  modalOptionText: { fontFamily: 'Lato-Regular', fontSize: 18, color: '#333' },
});

export default FarmerOnboardingScreen;