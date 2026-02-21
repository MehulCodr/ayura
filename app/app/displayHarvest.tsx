import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Reusable component to display a row of information
type InfoRowProps = { label: string; value: string | undefined; };
const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
);

const DisplayHarvestScreen: React.FC = () => {
  const { harvestDataString, returnTo, status } = useLocalSearchParams();
  
  let harvestData: any = null;
  try {
    if (typeof harvestDataString === 'string' && harvestDataString) {
      harvestData = JSON.parse(harvestDataString);
    }
  } catch (e) { console.error("Failed to parse QR code data", e); }

  // Check if the crop is already purchased
  const isPurchased = status === 'purchased' || harvestData?.status === 'purchased';

  const handlePurchase = () => {
    Alert.alert(
      "Confirm Purchase",
      `Are you sure you want to initiate transport for this batch of ${harvestData.cropType}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            if (returnTo === 'mediatorDashboard') {
              router.push({
                pathname: '/mediatorDashboard',
                params: { 
                  purchaseComplete: 'true',
                  harvestData: harvestDataString
                }
              });
            } else {
              router.push({
                pathname: '/mediatorDashboard',
                params: { purchaseComplete: 'true' }
              });
            }
          },
        },
      ]
    );
  };

  if (!harvestData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Could not load harvest details.</Text>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.linkText}>Go Back</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}><Feather name="chevron-left" size={28} color="#1A202C" /></TouchableOpacity>
            <Text style={styles.title}>Harvest Details</Text>
            <View style={{width: 40}} />
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Listing Details</Text>
            <InfoRow label="Farmer" value={harvestData.farmerName} />
            <InfoRow label="Crop" value={`${harvestData.cropType} - ${harvestData.variety}`} />
            <InfoRow label="Quantity" value={harvestData.quantity} />
            <InfoRow label="Expected Price" value={`₹${harvestData.expectedPrice}`} />
            {isPurchased && (
              <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Status:</Text>
                <View style={styles.purchasedBadge}>
                  <Text style={styles.purchasedText}>Purchased</Text>
                </View>
              </View>
            )}
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Traceability Information</Text>
            <InfoRow label="Harvest Date" value={harvestData.harvestDate} />
            <InfoRow label="Fertilizers Used" value={harvestData.fertilizers} />
            <InfoRow label="Pesticides Used" value={harvestData.pesticides} />
            <InfoRow label="Insecticides Used" value={harvestData.insecticides} />
        </View>
        
        {!isPurchased && (
          <TouchableOpacity style={styles.buttonPrimary} onPress={handlePurchase}>
              <Text style={styles.buttonPrimaryText}>Buy Crop</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- COMPLETE STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBF8' },
  scrollContent: { padding: 16, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { padding: 8 },
  title: { fontFamily: 'Lato-Bold', fontSize: 22, color: '#1A202C', flex: 1, textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontFamily: 'Lato-Bold', fontSize: 18, color: '#2D3748', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 8 },
  infoRow: { marginVertical: 8 },
  label: { fontFamily: 'Lato-Bold', fontSize: 14, color: '#718096', marginBottom: 4 },
  value: { fontFamily: 'Lato-Regular', fontSize: 16, color: '#2D3748' },
  errorText: { textAlign: 'center', fontFamily: 'Lato-Bold', fontSize: 18, color: 'red', margin: 20 },
  linkText: { textAlign: 'center', color: '#4caf50', fontSize: 16 },
  buttonPrimary: { backgroundColor: '#4caf50', borderRadius: 8, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 15 },
  buttonPrimaryText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 16 },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  statusLabel: { fontFamily: 'Lato-Bold', fontSize: 14, color: '#718096', marginRight: 8 },
  purchasedBadge: { backgroundColor: '#C6F6D5', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  purchasedText: { color: '#2F855A', fontFamily: 'Lato-Bold', fontSize: 12 },
});

export default DisplayHarvestScreen;