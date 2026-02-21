import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// --- ⬇️ IMPORTANT: Make sure this is your correct Server URL ⬇️ ---
const API_URL = 'http://172.20.10.3:8000';

type Listing = {
  listingId: string;
  farmerName: string;
  [key: string]: any;
};

// --- Reusable Components ---
type StatCardProps = { icon: React.ReactNode; label: string; value: string; note?: string; };
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, note }) => (
    <View style={styles.statCard}><View style={styles.statIconContainer}>{icon}</View><View><Text style={styles.statLabel}>{label}</Text><Text style={styles.statValue}>{value}</Text>{note && <Text style={styles.statNote}>{note}</Text>}</View></View>
);

// --- The Main Dashboard Screen ---
const MediatorDashboardScreen: React.FC = () => {
  const mediator = useLocalSearchParams();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get<Listing[]>(`${API_URL}/listings/`);
        setListings(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Backend Error:", error.response?.data);
            Alert.alert("Network Error", "Could not fetch farmer listings from the server.");
        } else {
            console.error('Unexpected Error:', error);
            Alert.alert("An Unexpected Error Occurred", "Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []); // Empty array means this runs only once on mount

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <View><Text style={styles.headerTitle}>Mediator Dashboard</Text><Text style={styles.headerSubtitle}>Welcome, {mediator.name || 'Mediator'}</Text></View>
            <TouchableOpacity style={styles.profileButton} onPress={() => router.push({ pathname: '/mediatorProfile', params: mediator })}><Feather name="user" size={24} color="#2D3748" /></TouchableOpacity>
        </View>
        <View style={styles.statsGrid}>
          <StatCard icon={<Feather name="truck" size={20} color="#2e7d32" />} label="Active Transports" value="0" note="Currently in transit" />
          <StatCard icon={<Feather name="users" size={20} color="#2e7d32" />} label="Connected Farmers" value={listings.length.toString()} note="Verified partners" />
          <StatCard icon={<MaterialCommunityIcons name="map-marker-distance" size={24} color="#2e7d32" />} label="Total Distance" value="0 km" note="This month" />
          <StatCard icon={<Feather name="check-circle" size={20} color="#2e7d32" />} label="On-Time Delivery" value="N/A" note="Success rate" />
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Farmer Network</Text>
          <Text style={styles.cardSubtitle}>Active listings from connected farmers</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#4caf50" style={{ marginVertical: 40 }}/>
          ) : listings.length === 0 ? (
            <View style={styles.emptyStateContainer}><Text style={styles.emptyStateText}>No farmers with active listings found.</Text></View>
          ) : (
            listings.map(listing => (
              <View key={listing.listingId} style={styles.listItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listItemTitle}>{listing.cropType} - {listing.quantity}</Text>
                  <Text style={styles.listItemSubtitle}>from {listing.farmerName}</Text>
                </View>
                {/* THIS BUTTON NOW NAVIGATES DIRECTLY */}
                <TouchableOpacity 
                    style={styles.buttonSecondary}
                    onPress={() => router.push({
                        pathname: '/displayHarvest',
                        params: { harvestDataString: JSON.stringify(listing) }
                    })}
                >
                  <Text style={styles.buttonSecondaryText}>Show Details</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLES ---
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
  cardTitle: { fontFamily: 'Lato-Bold', fontSize: 20, color: '#2D3748', marginBottom: 4 },
  cardSubtitle: { fontFamily: 'Lato-Regular', fontSize: 14, color: '#A0AEC0', marginBottom: 20 },
  emptyStateContainer: { paddingVertical: 40, alignItems: 'center' },
  emptyStateText: { fontFamily: 'Lato-Regular', fontSize: 16, color: '#A0AEC0' },
  listItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  listItemTitle: { fontFamily: 'Lato-Bold', fontSize: 16, color: '#333' },
  listItemSubtitle: { fontFamily: 'Lato-Regular', fontSize: 14, color: '#666', marginTop: 2 },
  buttonSecondary: { backgroundColor: '#FFFFFF', borderRadius: 8, height: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  buttonSecondaryText: { color: '#2e7d32', fontFamily: 'Lato-Bold', fontSize: 14 },
});

export default MediatorDashboardScreen;