import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

// Reusable component to display a row of information
type InfoRowProps = { label: string; value: string | undefined; };
const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
);

const HarvestPurchaseDetailsScreen: React.FC = () => {
  const { harvestDataString } = useLocalSearchParams();
  
  // State to manage the UI flow
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  let harvestData: any = null;
  try {
    if (typeof harvestDataString === 'string' && harvestDataString) {
      harvestData = JSON.parse(harvestDataString);
    }
  } catch (e) { console.error("Failed to parse QR code data", e); }

  const handleSimulateScan = () => {
    setIsScanning(true);
    // Simulate a 3-second scan and verification process
    setTimeout(() => {
      setIsScanning(false);
      setIsVerified(true); // Mark as verified to show the "Buy Crop" button
    }, 3000);
  };

  const handlePurchase = () => {
    Alert.alert(
      "Confirm Purchase",
      `Are you sure you want to initiate transport for this batch of ${harvestData.cropType}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => router.push({
            pathname: '/mediatorDashboard',
            params: { purchaseComplete: 'true' }
          }),
        },
      ]
    );
  };

  if (!harvestData) { /* ... error handling ... */ }

  return (
    <SafeAreaView style={styles.container}>
      {/* Scanning Animation Modal */}
      <Modal visible={isScanning} transparent={true} animationType="fade">
        <View style={styles.scanModalBackdrop}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.scanStatusText}>Verifying Harvest Data...</Text>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}><Feather name="chevron-left" size={28} color="#1A202C" /></TouchableOpacity>
            <Text style={styles.title}>Verify & Purchase</Text>
            <View style={{width: 40}} />
        </View>

        {/* --- QR Code Display --- */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Harvest QR Code</Text>
            <View style={styles.qrContainer}>
                <QRCode value={JSON.stringify(harvestData)} size={200} />
            </View>
        </View>

        {/* --- Full Details --- */}
        <View style={styles.card}>
            <InfoRow label="Harvest ID" value={harvestData.id} />
            <InfoRow label="Farmer" value={harvestData.farmerName} />
            <InfoRow label="Crop" value={`${harvestData.cropType} - ${harvestData.variety}`} />
            <InfoRow label="Quantity" value={harvestData.quantity} />
            <InfoRow label="Harvest Date" value={harvestData.harvestDate} />
            <InfoRow label="Expected Price" value={`₹${harvestData.expectedPrice}`} />
        </View>
        
        {/* --- Action Button Area --- */}
        <View style={styles.actionContainer}>
            {!isVerified ? (
                <TouchableOpacity style={styles.buttonPrimary} onPress={handleSimulateScan}>
                    <Feather name="maximize" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonPrimaryText}>Simulate Scan & Verify</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.buttonSuccess} onPress={handlePurchase}>
                    <Feather name="check-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonPrimaryText}>Buy Crop</Text>
                </TouchableOpacity>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBF8' },
  scrollContent: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { padding: 8 },
  title: { fontFamily: 'Lato-Bold', fontSize: 22, color: '#1A202C', flex: 1, textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontFamily: 'Lato-Bold', fontSize: 18, color: '#2D3748', marginBottom: 12 },
  infoRow: { marginVertical: 8 },
  label: { fontFamily: 'Lato-Regular', fontSize: 14, color: '#718096', marginBottom: 4 },
  value: { fontFamily: 'Lato-Bold', fontSize: 16, color: '#2D3748' },
  errorText: { textAlign: 'center', fontFamily: 'Lato-Bold', fontSize: 18, color: 'red', margin: 20 },
  actionContainer: { marginTop: 15 },
  buttonPrimary: { flexDirection: 'row', backgroundColor: '#2e7d32', borderRadius: 8, height: 55, alignItems: 'center', justifyContent: 'center' },
  buttonSuccess: { flexDirection: 'row', backgroundColor: '#4caf50', borderRadius: 8, height: 55, alignItems: 'center', justifyContent: 'center' },
  buttonPrimaryText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 16, marginLeft: 10 },
  qrContainer: { alignItems: 'center', paddingVertical: 10 },
  scanModalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  scanStatusText: { color: 'white', fontFamily: 'Lato-Bold', fontSize: 18, marginTop: 20 },
});

export default HarvestPurchaseDetailsScreen;