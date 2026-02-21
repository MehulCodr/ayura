import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- ⬇️ IMPORTANT: Make sure this is your correct Server URL ⬇️ ---
const API_URL = 'http://172.20.10.3:8000';

const roles = [
  { id: 'farmer', title: 'Farmer', icon: <Feather name="feather" size={28} color="#4caf50" />, description: 'Manage harvests, generate QR codes, track production' },
  { id: 'mediator', title: 'Mediator', icon: <Feather name="shuffle" size={28} color="#4caf50" />, description: 'Transport coordination, GPS tracking, logistics' },
  { id: 'manufacturer', title: 'Manufacturer', icon: <MaterialCommunityIcons name="beaker-outline" size={28} color="#4caf50" />, description: 'Product formulation, processing, quality control' },
  { id: 'lab', title: 'Lab', icon: <MaterialCommunityIcons name="clipboard-check-outline" size={28} color="#4caf50" />, description: 'Quality analysis, purity testing, and certificate generation' },
];

type RoleCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
  onButtonPress?: () => void;
  disabled?: boolean;
};

const RoleCard = ({ icon, title, description, isSelected, onPress, onButtonPress, disabled }: RoleCardProps) => (
    <TouchableOpacity onPress={onPress} style={[styles.card, isSelected && styles.selectedCard]} disabled={disabled}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
        <TouchableOpacity style={styles.cardButton} onPress={onButtonPress} disabled={disabled}>
            <Text style={styles.cardButtonText}>Create Account</Text>
        </TouchableOpacity>
    </TouchableOpacity>
);

const ChooseRoleScreen = () => {
  const [selectedRole, setSelectedRole] = useState<string>('farmer');
  const [loading, setLoading] = useState(false);
  const { uid } = useLocalSearchParams();

  const handleRoleSelection = async (roleId: string) => {
    // if (!uid) {
    //   Alert.alert("Error", "User ID not found. Please go back and sign up again.");
    //   return;
    // }
    
    setLoading(true);
    // try {
      // await axios.put(`${API_URL}/users/role`, {
      //   uid: uid,
      //   role: roleId,
      // });

      // Navigate to the correct onboarding screen, passing the UID along
      if (roleId === 'farmer') {
          router.replace({ pathname: '/farmerOnboarding', params: { uid } });
      } else if (roleId === 'mediator') {
          router.replace({ pathname: '/mediatorOnboarding', params: { uid } });
      } else if (roleId === 'manufacturer') {
          router.replace({ pathname: '/manufacturerOnboarding', params: { uid } });
      } else if (roleId === 'lab') {
          router.replace({ pathname: '/labOnboarding', params: { uid } });
      }

    // } catch (error) {
    //   if (axios.isAxiosError(error) && error.response) {
    //     Alert.alert("Error", error.response.data.detail || "Could not save your role.");
    //   } else {
    //     Alert.alert("Network Error", "Could not connect to the server. Please ensure it's running.");
    //   }
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <LinearGradient colors={['#E6F5E9', '#F7FDF8', '#FFFFFF']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4caf50" />
            <Text style={styles.loadingText}>Saving Profile...</Text>
          </View>
        )}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Your Role</Text>
            <Text style={styles.subtitle}>Select your role to complete your registration</Text>
          </View>
          <View style={styles.cardContainer}>
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                icon={role.icon}
                title={role.title}
                description={role.description}
                isSelected={selectedRole === role.id}
                onPress={() => setSelectedRole(role.id)}
                disabled={loading}
                onButtonPress={() => {
                  // Now handles all four roles
                  handleRoleSelection(role.id);
                }}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
    loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
    loadingText: { marginTop: 10, fontFamily: 'Lato-Bold', fontSize: 16, color: '#2e7d32' },
    container: { flex: 1 },
    scrollContent: { padding: 20, flexGrow: 1, justifyContent: 'center', paddingTop: 80 },
    header: { alignItems: 'center', marginBottom: 40 },
    title: { fontSize: 32, fontFamily: 'Lato-Bold', color: '#2e7d32' },
    subtitle: { fontSize: 16, fontFamily: 'Lato-Regular', color: '#4caf50', textAlign: 'center', marginTop: 10, maxWidth: '90%' },
    cardContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: { width: '48%', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20, borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    selectedCard: { borderColor: '#F3D179', backgroundColor: '#FFFBEF' },
    iconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4 },
    cardTitle: { fontSize: 18, fontFamily: 'Lato-Bold', color: '#333', marginBottom: 10 },
    cardDescription: { fontSize: 14, fontFamily: 'Lato-Regular', color: '#555', textAlign: 'center', minHeight: 60, marginBottom: 20 },
    cardButton: { width: '100%', paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#4caf50', backgroundColor: '#FFFFFF' },
    cardButtonText: { color: '#4caf50', fontFamily: 'Lato-Bold', textAlign: 'center', fontSize: 14 },
});

export default ChooseRoleScreen;