import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Helper to safely get string value from params
const getParam = (param: string | string[] | undefined) => {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
};

// --- Reusable Component for displaying a single piece of info ---
type ProfileInfoRowProps = {
  label: string;
  value: string;
};
const ProfileInfoRow: React.FC<ProfileInfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    {/* TextInput is used for consistent styling, but is not editable */}
    <TextInput style={styles.infoValue} value={value} editable={false} multiline />
  </View>
);

const ManufacturerProfileScreen: React.FC = () => {
  const user = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {/* --- Header --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={28} color="#1A202C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manufacturer Profile</Text>
          {/* Empty view for spacing to keep title centered */}
          <View style={{ width: 40 }} />
        </View>

        {/* --- Profile Header --- */}
        <View style={styles.profileHeader}>
          <View style={styles.profileIcon}>
            <Feather name="tool" size={40} color="#2e7d32" />
          </View>
          <Text style={styles.profileName}>{getParam(user.companyName) || 'N/A'}</Text>
          <Text style={styles.profileRole}>{getParam(user.brandName) || 'Manufacturer'}</Text>
        </View>

        {/* --- Company Identity Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Company Identity</Text>
          <ProfileInfoRow label="Contact Person" value={getParam(user.contactPerson)} />
          <ProfileInfoRow label="Contact Email" value={getParam(user.email)} />
          <ProfileInfoRow label="Contact Phone" value={getParam(user.phone)} />
          <ProfileInfoRow label="Company Website" value={getParam(user.website)} />
        </View>

        {/* --- Operational Details Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Operational Details</Text>
          <ProfileInfoRow label="Registered State" value={getParam(user.state)} />
          <ProfileInfoRow label="City" value={getParam(user.city)} />
          <ProfileInfoRow label="GPS Location" value={getParam(user.location)} />
          <ProfileInfoRow label="Product Categories" value={getParam(user.categories)} />
        </View>

        {/* --- Legal & Compliance Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Legal & Compliance</Text>
          <ProfileInfoRow label="GST Number (GSTIN)" value={getParam(user.gstin)} />
          <ProfileInfoRow label="Primary Product Type" value={getParam(user.productType)} />
          {/* Conditionally render FSSAI license only if it exists */}
          {user.fssaiLicense && <ProfileInfoRow label="FSSAI License" value={getParam(user.fssaiLicense)} />}
          <ProfileInfoRow label="AYUSH License Number" value={getParam(user.ayushLicenseNum)} />
          <Text style={styles.imageLabel}>Uploaded AYUSH License</Text>
          {user.ayushLicenseImageUri ? (
            <Image source={{ uri: getParam(user.ayushLicenseImageUri) }} style={styles.idImage} />
          ) : (
            <Text style={styles.noIdText}>No license was uploaded during registration.</Text>
          )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBF8' },
  scrollContent: { padding: 16, paddingTop: 80, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
    marginTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: 22,
    color: '#1A202C',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontFamily: 'Lato-Bold',
    fontSize: 28,
    color: '#1A202C',
    marginTop: 12,
    textAlign: 'center',
  },
  profileRole: {
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    color: '#4caf50',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: 18,
    color: '#2D3748',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 6,
  },
  infoValue: {
    backgroundColor: '#F7FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    color: '#2D3748',
  },
  imageLabel: {
    fontFamily: 'Lato-Bold',
    fontSize: 14,
    color: '#4A5568',
    marginTop: 16,
  },
  idImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  noIdText: {
    fontFamily: 'Lato-Regular',
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ManufacturerProfileScreen;