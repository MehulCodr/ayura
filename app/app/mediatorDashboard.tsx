import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// --- UPDATED Mock Data with your specific details ---
// Removed farmer listings as requested

// --- Reusable Components ---
type StatCardProps = { icon: React.ReactNode; label: string; value: string; note?: string; };
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, note }) => (
    <View style={styles.statCard}><View style={styles.statIconContainer}>{icon}</View><View><Text style={styles.statLabel}>{label}</Text><Text style={styles.statValue}>{value}</Text>{note && <Text style={styles.statNote}>{note}</Text>}</View></View>
);

// Listing Item Component
type ListingItemProps = { listing: HarvestListing; };
const ListingItem: React.FC<ListingItemProps> = ({ listing }) => (
  <View style={styles.listingItem}>
    <View style={styles.listingHeader}>
      <Text style={styles.listingTitle}>{listing.cropType} - {listing.variety}</Text>
      <View style={[styles.statusBadge, listing.status === 'purchased' ? styles.purchasedBadge : styles.pendingBadge]}>
        <Text style={[styles.statusText, listing.status === 'purchased' ? styles.purchasedText : styles.pendingText]}>
          {listing.status === 'purchased' ? 'Purchased' : 'Pending'}
        </Text>
      </View>
    </View>
    <Text style={styles.listingFarmer}>Farmer: {listing.farmerName}</Text>
    <View style={styles.listingDetails}>
      <Text style={styles.listingDetail}>Qty: {listing.quantity}</Text>
      <Text style={styles.listingDetail}>Price: ₹{listing.expectedPrice}</Text>
      <Text style={styles.listingDetail}>Date: {listing.harvestDate}</Text>
    </View>
    <TouchableOpacity 
      style={styles.viewDetailsButton}
      onPress={() => router.push({
        pathname: '/displayHarvest',
        params: { 
          harvestDataString: JSON.stringify({
            farmerName: listing.farmerName,
            cropType: listing.cropType,
            variety: listing.variety,
            quantity: listing.quantity,
            expectedPrice: listing.expectedPrice,
            harvestDate: listing.harvestDate
          }),
          status: listing.status
        }
      })}
    >
      <Text style={styles.viewDetailsText}>View Details</Text>
    </TouchableOpacity>
  </View>
);

// --- The Main Dashboard Screen ---
// Listing type definition
type HarvestListing = {
  id: string;
  farmerName: string;
  cropType: string;
  variety: string;
  quantity: string;
  expectedPrice: string;
  harvestDate: string;
  status: 'purchased' | 'pending';
};

const MediatorDashboardScreen: React.FC = () => {
  const mediator = useLocalSearchParams();
  const params = useLocalSearchParams();

  const [connectedFarmers, setConnectedFarmers] = useState(5);
  const [activeTransports, setActiveTransports] = useState(2);
  const [listings, setListings] = useState<HarvestListing[]>([
    // Sample data - remove this once real scanning is implemented
    {
      id: 'sample-1',
      farmerName: 'John Farmer',
      cropType: 'Wheat',
      variety: 'Hard Red',
      quantity: '100 kg',
      expectedPrice: '2500',
      harvestDate: '2024-01-15',
      status: 'purchased'
    },
    {
      id: 'sample-2',
      farmerName: 'Sarah Green',
      cropType: 'Rice',
      variety: 'Basmati',
      quantity: '75 kg',
      expectedPrice: '1800',
      harvestDate: '2024-01-20',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    if (params.purchaseComplete === 'true') {
      setConnectedFarmers(prev => prev + 1);
      setActiveTransports(prev => prev + 1);
    }
  }, [params.purchaseComplete]);

  // Function to add a new listing (this would be called when QR is scanned)
  useEffect(() => {
    if (params.harvestData) {
      try {
        const harvestData = JSON.parse(params.harvestData as string);
        const newListing: HarvestListing = {
          id: Date.now().toString(),
          farmerName: harvestData.farmerName,
          cropType: harvestData.cropType,
          variety: harvestData.variety,
          quantity: harvestData.quantity,
          expectedPrice: harvestData.expectedPrice,
          harvestDate: harvestData.harvestDate,
          status: params.purchaseComplete === 'true' ? 'purchased' : 'pending'
        };
        setListings(prev => [...prev, newListing]);
      } catch (e) {
        console.error('Failed to parse harvest data:', e);
      }
    }
  }, [params.harvestData, params.purchaseComplete]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <View><Text style={styles.headerTitle}>Mediator Dashboard</Text><Text style={styles.headerSubtitle}>Welcome, {mediator.name || 'Mediator'}</Text></View>
            <TouchableOpacity style={styles.profileButton} onPress={() => router.push({ pathname: '/mediatorProfile', params: mediator })}><Feather name="user" size={24} color="#2D3748" /></TouchableOpacity>
        </View>
        <View style={styles.statsGrid}>
          <StatCard icon={<Feather name="truck" size={20} color="#2e7d32" />} label="Active Transports" value={activeTransports.toString()} />
          <StatCard icon={<Feather name="users" size={20} color="#2e7d32" />} label="Connected Farmers" value={connectedFarmers.toString()} />
          <StatCard icon={<Feather name="list" size={20} color="#2e7d32" />} label="Total Listings" value={listings.length.toString()} />
          <StatCard icon={<Feather name="check-circle" size={20} color="#2e7d32" />} label="Purchased" value={listings.filter(l => l.status === 'purchased').length.toString()} />
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>QR Code Scanner</Text>
          <Text style={styles.cardDescription}>Scan harvest QR codes to verify and purchase crops from farmers</Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => router.push('/scanner')}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>Scan QR Code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Listings ({listings.length})</Text>
          {listings.length === 0 ? (
            <Text style={styles.cardDescription}>No harvest listings scanned yet. Use the QR scanner to view available crops.</Text>
          ) : (
            <View>
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing={listing} />
              ))}
            </View>
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
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  statIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E6F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  statLabel: { fontFamily: 'Lato-Regular', fontSize: 14, color: '#718096' },
  statValue: { fontFamily: 'Lato-Bold', fontSize: 20, color: '#1A202C' },
  statNote: { fontFamily: 'Lato-Regular', fontSize: 12, color: '#A0AEC0' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontFamily: 'Lato-Bold', fontSize: 20, color: '#2D3748', marginBottom: 10 },
  cardDescription: { fontFamily: 'Lato-Regular', fontSize: 16, color: '#718096', marginBottom: 20, textAlign: 'center' },
  scanButton: { backgroundColor: '#4caf50', borderRadius: 12, height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  scanButtonText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 18, marginLeft: 8 },
  // Listing styles
  listingItem: { backgroundColor: '#F7FAFC', borderRadius: 8, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#4caf50' },
  listingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  listingTitle: { fontFamily: 'Lato-Bold', fontSize: 16, color: '#2D3748', flex: 1 },
  statusBadge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  purchasedBadge: { backgroundColor: '#C6F6D5' },
  pendingBadge: { backgroundColor: '#FED7D7' },
  statusText: { fontFamily: 'Lato-Bold', fontSize: 12 },
  purchasedText: { color: '#2F855A' },
  pendingText: { color: '#C53030' },
  listingFarmer: { fontFamily: 'Lato-Regular', fontSize: 14, color: '#4A5568', marginBottom: 8 },
  listingDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  listingDetail: { fontFamily: 'Lato-Regular', fontSize: 13, color: '#718096' },
  viewDetailsButton: { backgroundColor: '#4caf50', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12, alignSelf: 'flex-end', marginTop: 8 },
  viewDetailsText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 12 },
});

export default MediatorDashboardScreen;