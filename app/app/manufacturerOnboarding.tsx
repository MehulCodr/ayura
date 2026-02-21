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
} from 'react-native'; // --- Data for Dropdowns ---
const indianStatesAndUTs = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];
const primaryProductTypes = ['Ayurvedic/Herbal Products', 'Food Products', 'Cosmetics', 'Other'];
const productCategories = [
  'Herbal Powders (Churnas)', 'Tablets / Capsules (Vati)', 'Herbal Oils (Tailas)', 'Syrups / Decoctions (Asavas)',
  'Cosmetics & Personal Care', 'Raw Herb Processing', 'Herbal Teas / Infusions', 'Extracts / Tinctures',
  'Pastes / Lehyams', 'Nutraceuticals / Supplements'
];

// --- TypeScript Types for Modals ---
type CustomModalProps = {
  visible: boolean;
  options: string[];
  onSelect: (option: string) => void;
  onClose: () => void;
};
type MultiSelectModalProps = {
  visible: boolean;
  options: string[];
  selectedOptions: string[];
  onSelect: (option: string) => void;
  onClose: () => void;
};

// --- Reusable Modals ---
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

const MultiSelectModal: React.FC<MultiSelectModalProps> = ({ visible, options, selectedOptions, onSelect, onClose }) => (
  <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalContainer} onPress={onClose} activeOpacity={1}>
      <View style={styles.modalContent}>
        <ScrollView>
          {options.map((option) => {
            const isSelected = selectedOptions.includes(option);
            return (
              <TouchableOpacity key={option} style={styles.modalOption} onPress={() => onSelect(option)}>
                <Feather name={isSelected ? 'check-square' : 'square'} size={20} color={isSelected ? '#4caf50' : '#888'} />
                <Text style={styles.multiSelectOptionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <TouchableOpacity style={styles.doneButton} onPress={onClose}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

const ManufacturerOnboardingScreen: React.FC = () => {
  // --- State for all form fields ---
  const [companyName, setCompanyName] = useState<string>('');
  const [brandName, setBrandName] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [contactPerson, setContactPerson] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [gstin, setGstin] = useState<string>('');
  const [productType, setProductType] = useState<string>('Select Product Type');
  const [fssaiLicense, setFssaiLicense] = useState<string>('');
  const [ayushLicenseNum, setAyushLicenseNum] = useState<string>('');
  const [ayushLicenseImage, setAyushLicenseImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [selectedState, setSelectedState] = useState<string>('Select State/UT');
  const [city, setCity] = useState<string>('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  // --- State for modals ---
  const [isStateModalVisible, setIsStateModalVisible] = useState<boolean>(false);
  const [isProductTypeModalVisible, setIsProductTypeModalVisible] = useState<boolean>(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState<boolean>(false);

  // --- Handlers ---
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
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAyushLicenseImage(result.assets[0]);
    }
  };

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(item => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
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
            <Text style={styles.title}>Manufacturer Registration</Text>
            <Text style={styles.subtitle}>Enter your company details to join Ayura</Text>
          </View>

          <View style={styles.form}>
            {/* --- Company Identity Section --- */}
            <Text style={styles.sectionTitle}>Company Identity</Text>
            <Text style={styles.label}>Company Name</Text>
            <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} placeholder="e.g., Surya Herbal Wellness Pvt. Ltd." />
            <Text style={styles.label}>Brand Name (if different)</Text>
            <TextInput style={styles.input} value={brandName} onChangeText={setBrandName} placeholder="e.g., VedaPure Organics" />
            <Text style={styles.label}>Company Website</Text>
            <TextInput style={styles.input} value={website} onChangeText={setWebsite} placeholder="https://example.com" keyboardType="url" />
            <Text style={styles.label}>Contact Person</Text>
            <TextInput style={styles.input} value={contactPerson} onChangeText={setContactPerson} placeholder="Enter name of contact person" />
            <Text style={styles.label}>Contact Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter official email" keyboardType="email-address" />
            <Text style={styles.label}>Contact Phone</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Enter official phone number" keyboardType="phone-pad" />

            {/* --- Legal & Compliance Section --- */}
            <Text style={styles.sectionTitle}>Legal & Compliance</Text>
            <Text style={styles.label}>GST Number (GSTIN)</Text>
            <TextInput style={styles.input} value={gstin} onChangeText={setGstin} placeholder="Enter 15-digit GSTIN" autoCapitalize="characters" />

            <Text style={styles.label}>Primary Product Type</Text>
            <TouchableOpacity style={styles.dropdownButtonFull} onPress={() => setIsProductTypeModalVisible(true)}>
              <Text style={styles.dropdownText}>{productType}</Text>
              <Feather name="chevron-down" size={20} color="#555" />
            </TouchableOpacity>

            {productType === 'Food Products' && (
              <>
                <Text style={styles.label}>FSSAI License Number</Text>
                <TextInput style={styles.input} value={fssaiLicense} onChangeText={setFssaiLicense} placeholder="Enter your FSSAI license number" />
              </>
            )}

            <Text style={styles.label}>AYUSH Manufacturing License Number</Text>
            <TextInput style={styles.input} value={ayushLicenseNum} onChangeText={setAyushLicenseNum} placeholder="Enter official license number" />
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
              <Feather name="upload" size={20} color="#4caf50" />
              <Text style={styles.uploadButtonText}>Upload AYUSH License</Text>
            </TouchableOpacity>
            {ayushLicenseImage && <Image source={{ uri: ayushLicenseImage.uri }} style={styles.imagePreview} />}

            {/* --- Operational Details Section --- */}
            <Text style={styles.sectionTitle}>Operational Details</Text>
            <Text style={styles.label}>Registered State / Union Territory</Text>
            <TouchableOpacity style={styles.dropdownButtonFull} onPress={() => setIsStateModalVisible(true)}>
              <Text style={styles.dropdownText}>{selectedState}</Text>
              <Feather name="chevron-down" size={20} color="#555" />
            </TouchableOpacity>
            <Text style={styles.label}>City</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Enter city name" />
            <Text style={styles.label}>GPS Location of Registered Office</Text>
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
            {location && (
              <Text style={styles.locationText}>
                Lat: {location.coords.latitude.toFixed(4)}, Lon: {location.coords.longitude.toFixed(4)}
              </Text>
            )}

            {/* --- Product Specialization Section --- */}
            <Text style={styles.sectionTitle}>Product Specialization</Text>
            <Text style={styles.label}>Product Categories Manufactured</Text>
            <TouchableOpacity style={styles.dropdownButtonFull} onPress={() => setIsCategoryModalVisible(true)}>
              <Text style={styles.dropdownText} numberOfLines={1}>
                {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'Select Categories'}
              </Text>
              <Feather name="chevron-down" size={20} color="#555" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                // Collect all data from the form's state
                const manufacturerData = {
                  companyName: companyName,
                  brandName: brandName,
                  website: website,
                  contactPerson: contactPerson,
                  email: email,
                  phone: phone,
                  gstin: gstin,
                  productType: productType,
                  fssaiLicense: fssaiLicense,
                  ayushLicenseNum: ayushLicenseNum,
                  ayushLicenseImageUri: ayushLicenseImage ? ayushLicenseImage.uri : null,
                  state: selectedState,
                  city: city,
                  location: location ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` : 'Not Set',
                  categories: selectedCategories.join(', '),
                };

                // Navigate to the dashboard, passing all the data
                router.replace({
                  pathname: '/manufacturerDashboard',
                  params: manufacturerData,
                });
              }}
            >
              <Text style={styles.submitButtonText}>Submit for Verification</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* --- Modals --- */}
        <CustomModal
          visible={isStateModalVisible}
          options={indianStatesAndUTs}
          onSelect={(opt) => {
            setSelectedState(opt);
            setIsStateModalVisible(false);
          }}
          onClose={() => setIsStateModalVisible(false)}
        />
        <CustomModal
          visible={isProductTypeModalVisible}
          options={primaryProductTypes}
          onSelect={(opt) => {
            setProductType(opt);
            setIsProductTypeModalVisible(false);
          }}
          onClose={() => setIsProductTypeModalVisible(false)}
        />
        <MultiSelectModal
          visible={isCategoryModalVisible}
          options={productCategories}
          selectedOptions={selectedCategories}
          onSelect={handleCategorySelect}
          onClose={() => setIsCategoryModalVisible(false)}
        />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: 20,
    color: '#2e7d32',
    marginTop: 30,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E6F5E9',
    paddingBottom: 5,
  },
  multiSelectOptionText: {
    fontFamily: 'Lato-Regular',
    fontSize: 18,
    color: '#333',
    marginLeft: 15,
  },
  doneButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  doneButtonText: {
    color: 'white',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
  },
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 80, paddingBottom: 50 },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  title: { fontSize: 28, fontFamily: 'Lato-Bold', color: '#2e7d32' },
  subtitle: { fontSize: 16, fontFamily: 'Lato-Regular', color: '#4caf50', marginTop: 8, textAlign: 'center' },
  form: { width: '100%' },
  label: { fontFamily: 'Lato-Bold', fontSize: 16, color: '#333', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#FFFFFF', height: 50, borderColor: '#DDD', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontFamily: 'Lato-Regular', fontSize: 16 },
  dropdownButtonFull: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', height: 50, borderColor: '#DDD', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, width: '100%' },
  dropdownText: { flex: 1, fontFamily: 'Lato-Regular', fontSize: 16, color: '#555', paddingRight: 10 },
  locationButton: { flexDirection: 'row', backgroundColor: '#4caf50', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  locationButtonText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 16, marginLeft: 10 },
  locationText: { fontFamily: 'Lato-Regular', color: '#555', marginTop: 8, textAlign: 'center' },
  uploadButton: { flexDirection: 'row', backgroundColor: '#E6F5E9', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#4caf50', marginTop: 12 },
  uploadButtonText: { color: '#4caf50', fontFamily: 'Lato-Bold', fontSize: 16, marginLeft: 10 },
  imagePreview: { width: '100%', height: 200, borderRadius: 12, marginTop: 15, resizeMode: 'cover', borderWidth: 1, borderColor: '#DDD' },
  submitButton: { backgroundColor: '#2e7d32', height: 55, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  submitButtonText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 18 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderRadius: 10, padding: 10, width: '85%', maxHeight: '70%', elevation: 5 },
  modalOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalOptionText: { fontFamily: 'Lato-Regular', fontSize: 18, color: '#333' },
});

export default ManufacturerOnboardingScreen;