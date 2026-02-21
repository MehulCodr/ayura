import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
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

// --- List of all Indian States and UTs for the dropdown ---
const indianStatesAndUTs = [
  'Andaman and Nicobar Islands','Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

// --- TypeScript Types ---
type CustomModalProps = {
  visible: boolean;
  options: string[];
  onSelect: (option: string) => void;
  onClose: () => void;
};

// --- Reusable Modal Component ---
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

const MediatorOnboardingScreen: React.FC = () => {
  // State for all form fields
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('Select State/UT');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [numVehicles, setNumVehicles] = useState<string>('');
  const [permitImage, setPermitImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // State for modal visibility
  const [isStateModalVisible, setIsStateModalVisible] = useState<boolean>(false);

  // --- Handlers for special actions ---
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
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPermitImage(result.assets[0]);
    }
  };

  const handleSubmit = () => {
    if (!name || !age || selectedState === 'Select State/UT' || !location || !numVehicles || !permitImage) {
      Alert.alert('Incomplete', 'Please fill all fields and upload the permit.');
      return;
    }
    // Collect all data from the form's state
    const mediatorData = {
      name: name,
      age: age,
      state: selectedState,
      location: location ? `${location.coords.latitude},${location.coords.longitude}` : '',
      numVehicles: numVehicles,
      permitImageUri: permitImage ? permitImage.uri : null,
    };

    // Use router.replace to navigate, passing the data as params
    router.replace({
      pathname: '/mediatorDashboard',
      params: mediatorData,
    });
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
            <Text style={styles.title}>Mediator Registration</Text>
            <Text style={styles.subtitle}>Provide your business details to join the network</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name or Company Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />

            <Text style={styles.label}>Age (Owner)</Text>
            <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder="e.g., 35" keyboardType="numeric" />

            <Text style={styles.label}>State / Union Territory</Text>
            <TouchableOpacity style={styles.dropdownButtonFull} onPress={() => setIsStateModalVisible(true)}>
                <Text style={styles.dropdownText}>{selectedState}</Text>
                <Feather name="chevron-down" size={20} color="#555" />
            </TouchableOpacity>
            
            <Text style={styles.label}>Warehouse GPS Location</Text>
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
            
            <Text style={styles.label}>Number of Registered Vehicles</Text>
            <TextInput style={styles.input} value={numVehicles} onChangeText={setNumVehicles} placeholder="e.g., 4" keyboardType="numeric" />

            <Text style={styles.label}>ID Verification</Text>
            <Text style={styles.descriptionText}>Upload the official permit issued by the state/central government authorizing you to buy, store, and sell crops.</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
                <Feather name="upload" size={20} color="#4caf50" />
                <Text style={styles.uploadButtonText}>Upload Official Permit</Text>
            </TouchableOpacity>
            {permitImage?.uri && <Image source={{ uri: permitImage.uri }} style={styles.imagePreview} />}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Registration</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* --- Modal for State Selection --- */}
        <CustomModal 
            visible={isStateModalVisible}
            options={indianStatesAndUTs}
            onSelect={(option) => { setSelectedState(option); setIsStateModalVisible(false); }}
            onClose={() => setIsStateModalVisible(false)}
        />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 50, paddingTop: 80 },
    header: { alignItems: 'center', marginBottom: 30 },
    title: { fontSize: 28, fontFamily: 'Lato-Bold', color: '#2e7d32' },
    subtitle: { fontSize: 16, fontFamily: 'Lato-Regular', color: '#4caf50', marginTop: 8, textAlign: 'center' },
    form: { width: '100%' },
    label: { fontFamily: 'Lato-Bold', fontSize: 16, color: '#333', marginBottom: 8, marginTop: 20 },
    input: { backgroundColor: '#FFFFFF', height: 50, borderColor: '#DDD', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontFamily: 'Lato-Regular', fontSize: 16 },
    dropdownButtonFull: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', height: 50, borderColor: '#DDD', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, width: '100%' },
    dropdownText: { fontFamily: 'Lato-Regular', fontSize: 16, color: '#333' },
    locationButton: { flexDirection: 'row', backgroundColor: '#4caf50', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    locationButtonText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 16, marginLeft: 10 },
    locationText: { fontFamily: 'Lato-Regular', color: '#555', marginTop: 8, textAlign: 'center' },
    descriptionText: { fontFamily: 'Lato-Regular', fontSize: 14, color: '#666', marginBottom: 12, lineHeight: 20 },
    uploadButton: { flexDirection: 'row', backgroundColor: '#E6F5E9', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#4caf50' },
    uploadButtonText: { color: '#4caf50', fontFamily: 'Lato-Bold', fontSize: 16, marginLeft: 10 },
    imagePreview: { width: '100%', height: 200, borderRadius: 12, marginTop: 15, resizeMode: 'cover', borderWidth: 1, borderColor: '#DDD' },
    submitButton: { backgroundColor: '#2e7d32', height: 55, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
    submitButtonText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 18 },
    // Modal Styles
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: 'white', borderRadius: 10, padding: 10, width: '80%', maxHeight: '70%', elevation: 5 },
    modalOption: { paddingVertical: 15, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    modalOptionText: { fontFamily: 'Lato-Regular', fontSize: 18, color: '#333' },
});

export default MediatorOnboardingScreen;