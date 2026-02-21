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

type ProfileInfoRowProps = {
  label: string;
  value: string;
};

const ProfileInfoRow: React.FC<ProfileInfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <TextInput style={styles.infoValue} value={value} editable={false} />
  </View>
);

const MediatorProfileScreen: React.FC = () => {
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={28} color="#1A202C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mediator Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.profileIcon}>
            <Feather name="truck" size={40} color="#2e7d32" />
          </View>
          <Text style={styles.profileName}>{getParam(user.name) || 'N/A'}</Text>
          <Text style={styles.profileRole}>Mediator</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Business Details</Text>
          <ProfileInfoRow label="Age (Owner)" value={getParam(user.age) || "N/A"} />
          <ProfileInfoRow label="State / UT" value={getParam(user.state)} />
          <ProfileInfoRow label="Number of Vehicles" value={getParam(user.numVehicles)} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Official Permit</Text>
          {user.permitImageUri ? (
            <Image source={{ uri: getParam(user.permitImageUri) }} style={styles.idImage} />
          ) : (
            <Text style={styles.noIdText}>No permit was uploaded during registration.</Text>
          )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBF8' },
  scrollContent: { padding: 16, paddingTop: 80 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, marginTop: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Lato-Bold', fontSize: 22, color: '#1A202C' },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  profileIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E6F5E9', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFFFFF' },
  profileName: { fontFamily: 'Lato-Bold', fontSize: 28, color: '#1A202C', marginTop: 12 },
  profileRole: { fontFamily: 'Lato-Regular', fontSize: 16, color: '#4caf50', marginTop: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontFamily: 'Lato-Bold', fontSize: 18, color: '#2D3748', marginBottom: 16 },
  infoRow: { marginBottom: 12 },
  infoLabel: { fontFamily: 'Lato-Regular', fontSize: 14, color: '#A0AEC0', marginBottom: 4 },
  infoValue: { backgroundColor: '#F7FAFC', height: 48, borderColor: '#E2E8F0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontFamily: 'Lato-Regular', fontSize: 16, color: '#2D3748' },
  idImage: { width: '100%', height: 200, borderRadius: 8, resizeMode: 'contain' },
  noIdText: { fontFamily: 'Lato-Regular', color: '#A0AEC0', textAlign: 'center' },
});

export default MediatorProfileScreen;