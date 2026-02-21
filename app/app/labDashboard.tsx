import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// Define the shape of a listing that the lab will see
type HarvestListing = {
  id: string;
  farmerName: string;
  cropType: string;
  quantity: string;
  certificateUri?: string | null; // This will hold the path to the uploaded PDF
  // Add other fields from the original harvest for the QR code
  [key: string]: any; 
};

// Mock Data: A sample listing waiting for lab results
const mockListings: HarvestListing[] = [
  { id: 'GV-2025-001', farmerName: 'Krish Sehgal', cropType: 'Ashwagandha', variety: 'Herb', quantity: '100 kg', certificateUri: null, harvestDate: '15 Jan 2025', fertilizers: 'Urea', pesticides: 'Glysophate', insecticides: 'Lamidacloprid', expectedPrice: '25000' },
  { id: 'HV-2025-007', farmerName: 'Sunrise Herbs', cropType: 'Turmeric', variety: 'Salem', quantity: '500 kg', certificateUri: null, harvestDate: '12-10-2025', fertilizers: 'Vermicompost', pesticides: 'None', insecticides: 'None', expectedPrice: '35000' },
];

const LabDashboardScreen: React.FC = () => {
  const { labName } = useLocalSearchParams();
  const [listings, setListings] = useState<HarvestListing[]>(mockListings);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [selectedListing, setSelectedListing] = useState<HarvestListing | null>(null);

  const handlePickCertificate = async (listingId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const certificate = result.assets[0];
        // In a real app, you would upload this PDF to a server/cloud storage.
        // Here, we just simulate success by updating the local state.
        setListings(prevListings =>
          prevListings.map(listing =>
            listing.id === listingId ? { ...listing, certificateUri: certificate.uri } : listing
          )
        );
        Alert.alert("Success", `Certificate "${certificate.name}" has been attached to the listing.`);
      }
    } catch (error) {
      Alert.alert("Error", "Could not open document picker.");
      console.error(error)
    }
  };

  const renderQRModal = () => (
    <Modal visible={isQRModalVisible} transparent={true} animationType="fade" onRequestClose={() => setIsQRModalVisible(false)}>
        <View style={styles.modalBackdrop}>
            <View style={styles.qrModalContent}>
                <Text style={styles.modalTitle}>Certified Harvest QR Code</Text>
                {/* Now, the QR code includes the certificate URI */}
                {selectedListing && <QRCode value={JSON.stringify(selectedListing, null, 2)} size={250} />}
                <TouchableOpacity style={[styles.buttonPrimary, {marginTop: 20}]} onPress={() => setIsQRModalVisible(false)}>
                    <Text style={styles.buttonPrimaryText}>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderQRModal()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>Lab Dashboard</Text>
                <Text style={styles.headerSubtitle}>Welcome, {labName || 'Lab User'}</Text>
            </View>
            <TouchableOpacity style={styles.profileButton} onPress={() => { /* Navigate to lab profile */ }}>
                <Feather name="user" size={24} color="#2D3748" />
            </TouchableOpacity>
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Awaiting Certification</Text>
            {listings.length === 0 ? (
                <View style={styles.emptyStateContainer}><Text style={styles.emptyStateText}>No batches awaiting certification.</Text></View>
            ) : (
                listings.map(listing => (
                    <View key={listing.id} style={styles.listingCard}>
                        <Text style={styles.listingCropText}>{listing.cropType} from {listing.farmerName}</Text>
                        <Text style={styles.listingDetailText}>Batch ID: {listing.id}</Text>
                        
                        {!listing.certificateUri ? (
                            <TouchableOpacity 
                                style={styles.uploadButton}
                                onPress={() => handlePickCertificate(listing.id)}
                            >
                                <Feather name="upload" size={16} color="#2e7d32" />
                                <Text style={styles.buttonSecondaryText}>Upload Certificate (PDF)</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.verifiedContainer}>
                                <Text style={styles.verifiedText}>
                                    <Feather name="check-circle" size={16} color="#4caf50" /> Certificate Attached
                                </Text>
                                <TouchableOpacity 
                                    style={styles.buttonSecondary}
                                    onPress={() => { setSelectedListing(listing); setIsQRModalVisible(true); }}
                                >
                                    <MaterialCommunityIcons name="qrcode" size={16} color="#2e7d32" />
                                    <Text style={styles.buttonSecondaryText}>Generate QR</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- COMPLETE STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBF8' },
  scrollContent: { padding: 16, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontFamily: 'Lato-Bold', fontSize: 28, color: '#1A202C' },
  headerSubtitle: { fontFamily: 'Lato-Regular', fontSize: 16, color: '#718096', marginTop: 4 },
  profileButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontFamily: 'Lato-Bold', fontSize: 20, color: '#2D3748', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 10 },
  listingCard: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 15, marginTop: 15 },
  listingCropText: { fontFamily: 'Lato-Bold', fontSize: 18, color: '#1A202C' },
  listingDetailText: { fontFamily: 'Lato-Regular', fontSize: 14, color: '#4A5568', marginTop: 4, marginBottom: 15 },
  uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E6F5E9', borderRadius: 8, paddingVertical: 12, borderWidth: 1, borderColor: '#cde4d3' },
  buttonSecondaryText: { color: '#2e7d32', fontFamily: 'Lato-Bold', fontSize: 14, marginLeft: 8 },
  verifiedContainer: { alignItems: 'center', backgroundColor: '#F0FFF4', borderRadius: 8, padding: 15 },
  verifiedText: { fontFamily: 'Lato-Bold', fontSize: 16, color: '#4caf50', marginBottom: 15 },
  buttonSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 8, paddingVertical: 12, borderWidth: 1, borderColor: '#DDD', width: '100%' },
  emptyStateContainer: { paddingVertical: 30, alignItems: 'center' },
  emptyStateText: { fontFamily: 'Lato-Regular', fontSize: 16, color: '#A0AEC0' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  qrModalContent: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, width: '90%', alignItems: 'center' },
  modalTitle: { fontFamily: 'Lato-Bold', fontSize: 22, color: '#1A202C', marginBottom: 20 },
  buttonPrimary: { backgroundColor: '#4caf50', borderRadius: 8, height: 50, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  buttonPrimaryText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 16 },
});

export default LabDashboardScreen;