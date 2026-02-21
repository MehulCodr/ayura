import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert, Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import uuid from 'react-native-uuid';

// --- Data structure for a Harvest ---
type Harvest = {
  id: string; cropType: string; variety: string; quantity: string; harvestDate: string;
  fertilizers: string; pesticides: string; insecticides: string;
  isListed?: boolean; expectedPrice?: string; cropImageUri?: string;
};

// --- Corrected StatCard Component with Types ---
type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, note }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>{icon}</View>
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {note && <Text style={styles.statNote}>{note}</Text>}
    </View>
  </View>
);

// --- Main Dashboard Screen Component ---
const FarmerDashboardScreen: React.FC = () => {
  const farmerData = useLocalSearchParams();

  // --- State Management ---
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isSellModalVisible, setIsSellModalVisible] = useState(false);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState<Harvest | null>(null);
  const [expandedHarvestId, setExpandedHarvestId] = useState<string | null>(null);

  // --- Form State for 'Add Harvest' Modal ---
  const [cropType, setCropType] = useState('');
  const [variety, setVariety] = useState('');
  const [quantity, setQuantity] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [fertilizers, setFertilizers] = useState('');
  const [pesticides, setPesticides] = useState('');
  const [insecticides, setInsecticides] = useState('');
  
  // --- Form State for 'Sell Crop' Modal ---
  const [expectedPrice, setExpectedPrice] = useState('');
  const [cropImage, setCropImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  // --- Handler Functions ---
  const resetAddHarvestForm = () => {
    setCropType(''); setVariety(''); setQuantity(''); setHarvestDate('');
    setFertilizers(''); setPesticides(''); setInsecticides('');
  };

  const handleDateChange = (text: string) => {
    // Remove all non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');
    
    // Format as DD-MM-YYYY
    let formattedDate = '';
    if (numericText.length <= 2) {
      formattedDate = numericText;
    } else if (numericText.length <= 4) {
      formattedDate = numericText.slice(0, 2) + '-' + numericText.slice(2);
    } else {
      formattedDate = numericText.slice(0, 2) + '-' + numericText.slice(2, 4) + '-' + numericText.slice(4, 8);
    }
    
    setHarvestDate(formattedDate);
  };

  const handleCreateHarvest = () => {
    if (!cropType || !variety || !quantity || !harvestDate) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }
    
    // Validate date format (DD-MM-YYYY)
    const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
    const dateMatch = harvestDate.match(datePattern);
    if (!dateMatch) {
      Alert.alert("Invalid Date", "Please enter date in DD-MM-YYYY format.");
      return;
    }
    
    const [, day, month, year] = dateMatch;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    // Check if the date is valid
    if (date.getDate() !== parseInt(day) || 
        date.getMonth() !== parseInt(month) - 1 || 
        date.getFullYear() !== parseInt(year)) {
      Alert.alert("Invalid Date", "Please enter a valid date.");
      return;
    }
    
    // Check if the date is not in the future
    if (date > new Date()) {
      Alert.alert("Invalid Date", "Harvest date cannot be in the future.");
      return;
    }
    
    const newHarvest: Harvest = {
      id: uuid.v4() as string,
      cropType, variety, quantity, harvestDate,
      fertilizers, pesticides, insecticides,
    };
    setHarvests(prev => [newHarvest, ...prev]);
    setExpandedHarvestId(newHarvest.id); // Set the new harvest as expanded
    resetAddHarvestForm();
    setIsAddModalVisible(false);
  };
  
  const handleListForSale = () => {
    if (!expectedPrice || !cropImage) {
        Alert.alert("Validation Error", "Please provide a price and upload an image.");
        return;
    }
    if (!selectedHarvest) return;

    setHarvests(harvests.map(h => 
        h.id === selectedHarvest.id 
        ? { ...h, isListed: true, expectedPrice, cropImageUri: cropImage.uri } 
        : h
    ));
    setIsSellModalVisible(false);
    setExpectedPrice('');
    setCropImage(null);
    Alert.alert("Success", "Your crop has been listed for sale!");
  };

  const handlePickCropImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera roll permissions!');
        return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1,
    });
    if (!result.canceled) {
      setCropImage(result.assets[0]);
    }
  };

  // --- Render Functions for Modals ---
  const renderAddHarvestModal = () => (
    <Modal visible={isAddModalVisible} animationType="slide" onRequestClose={() => setIsAddModalVisible(false)}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>+ Add New Harvest</Text>
          <TouchableOpacity onPress={() => setIsAddModalVisible(false)}><Feather name="x" size={28} color="#1A202C" /></TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          <View style={styles.formRow}><TextInput style={styles.input} value={cropType} onChangeText={setCropType} placeholder="Crop Type (e.g., Basil, Mint)" /><TextInput style={styles.input} value={variety} onChangeText={setVariety} placeholder="Variety (e.g., Sweet Basil)" /></View>
          <View style={styles.formRow}><TextInput style={styles.input} value={quantity} onChangeText={setQuantity} placeholder="Quantity (e.g., 50kg)" keyboardType="numeric" /><TextInput style={styles.input} value={harvestDate} onChangeText={handleDateChange} placeholder="Harvest Date (DD-MM-YYYY)" keyboardType="numeric" maxLength={10} /></View>
          <Text style={styles.label}>Chemicals Used</Text>
          <TextInput style={styles.inputFull} value={fertilizers} onChangeText={setFertilizers} placeholder="Fertilizers (e.g., NPK, Urea)" />
          <TextInput style={styles.inputFull} value={pesticides} onChangeText={setPesticides} placeholder="Pesticides (e.g., Glysophate)" />
          <TextInput style={styles.inputFull} value={insecticides} onChangeText={setInsecticides} placeholder="Insecticides (e.g., Imidacloprid)" />
          <TouchableOpacity style={[styles.buttonPrimary, { marginHorizontal: 4 }]} onPress={handleCreateHarvest}><Text style={styles.buttonPrimaryText}>Create Harvest Record</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderSellModal = () => (
    <Modal visible={isSellModalVisible} transparent={true} animationType="fade" onRequestClose={() => setIsSellModalVisible(false)}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setIsSellModalVisible(false)}>
        <TouchableOpacity activeOpacity={1} style={styles.sellModalContent}>
          <Text style={styles.modalTitle}>List {selectedHarvest?.cropType} for Sale</Text>
          <Text style={styles.label}>Expected Price (per batch in ₹)</Text>
          <TextInput style={styles.inputFull} value={expectedPrice} onChangeText={setExpectedPrice} placeholder="e.g., 35000" keyboardType="numeric" />
          <TouchableOpacity style={styles.buttonSecondary} onPress={handlePickCropImage}><Feather name="camera" size={16} color="#2e7d32" /><Text style={styles.buttonSecondaryText}>Upload Crop Image</Text></TouchableOpacity>
          {cropImage && <Image source={{ uri: cropImage.uri }} style={styles.cropImagePreview} />}
          <TouchableOpacity style={[styles.buttonPrimary, { flex: 0 }]} onPress={handleListForSale}><Text style={styles.buttonPrimaryText}>List to Sell</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSellModalVisible(false)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  const renderQRModal = () => (
    <Modal visible={isQRModalVisible} transparent={true} animationType="fade" onRequestClose={() => setIsQRModalVisible(false)}>
      <View style={styles.modalBackdrop}>
        <View style={styles.qrModalContent}>
            <Text style={styles.modalTitle}>Batch QR Code</Text>
            {selectedHarvest && <QRCode value={JSON.stringify(selectedHarvest, null, 2)} size={250} />}
            <TouchableOpacity style={[styles.buttonPrimary, {marginTop: 20}]} onPress={() => setIsQRModalVisible(false)}><Text style={styles.buttonPrimaryText}>Done</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderAddHarvestModal()}
      {renderSellModal()}
      {renderQRModal()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <View><Text style={styles.headerTitle}>Dashboard</Text><Text style={styles.headerSubtitle}>Welcome, {farmerData.name || 'Farmer'}</Text></View>
            <TouchableOpacity style={styles.profileButton} onPress={() => router.push({ pathname: '/profile', params: farmerData })}><Feather name="user" size={24} color="#2D3748" /></TouchableOpacity>
        </View>
        <Text>
          <View style={styles.statsGrid}>
            <StatCard icon={<Feather name="bar-chart-2" size={20} color="#2e7d32" />} label="Total Harvests" value={harvests.length.toString()} />
            <StatCard icon={<MaterialCommunityIcons name="cube-outline" size={24} color="#2e7d32" />} label="Active Batches" value={harvests.filter(h => !h.isListed).length.toString()} note="Ready to list" />
            <StatCard icon={<Feather name="package" size={20} color="#2e7d32" />} label="Listed for Sale" value={harvests.filter(h => h.isListed).length.toString()} />
            <StatCard 
              icon={<Feather name="dollar-sign" size={20} color="#2e7d32" />} 
              label="Revenue" 
              value={`₹${farmerData.annualRevenue || '0'}`}
            />        
          </View>
        </Text>

        <TouchableOpacity style={styles.mainActionButton} onPress={() => setIsAddModalVisible(true)}><Text style={styles.buttonPrimaryText}>+ Add New Harvest</Text></TouchableOpacity>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Harvests</Text>
          {harvests.length === 0 ? (
            <View style={styles.emptyStateContainer}><Text style={styles.emptyStateText}>No recent harvests found.</Text></View>
          ) : (
            harvests.map(harvest => (
              <View key={harvest.id}>
                <TouchableOpacity style={styles.listItem} onPress={() => setExpandedHarvestId(expandedHarvestId === harvest.id ? null : harvest.id)}>
                  <Text style={styles.listItemTitle}>{harvest.cropType} - {harvest.variety}</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {harvest.isListed && <View style={styles.listedChip}><Text style={styles.listedChipText}>Listed</Text></View>}
                    <Feather name={expandedHarvestId === harvest.id ? "chevron-up" : "chevron-down"} size={24} color="#718096" />
                  </View>
                </TouchableOpacity>
                {expandedHarvestId === harvest.id && (
                  <View style={styles.expandedContent}>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Quantity:</Text> {harvest.quantity}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Harvest Date:</Text> {harvest.harvestDate}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Fertilizers:</Text> {harvest.fertilizers || 'N/A'}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Pesticides:</Text> {harvest.pesticides || 'N/A'}</Text>
                    <Text style={styles.detailText}><Text style={styles.detailLabel}>Insecticides:</Text> {harvest.insecticides || 'N/A'}</Text>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => { setSelectedHarvest(harvest); setIsSellModalVisible(true); }}
                        >
                            <Feather name="tag" size={16} color="#2e7d32" />
                            <Text style={styles.buttonSecondaryText}>{harvest.isListed ? 'Update Listing' : 'Sell Crop'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => { setSelectedHarvest(harvest); setIsQRModalVisible(true); }}
                        >
                            <MaterialCommunityIcons name="qrcode" size={16} color="#2e7d32" />
                            <Text style={styles.buttonSecondaryText}>Generate QR</Text>
                        </TouchableOpacity>
                    </View>
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
  scrollContent: { padding: 16, paddingBottom: 40, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontFamily: 'Lato-Bold', fontSize: 28, color: '#1A202C' },
  headerSubtitle: { fontFamily: 'Lato-Regular', fontSize: 16, color: '#718096', marginTop: 4, maxWidth: 250 },
  profileButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  statIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E6F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  statLabel: { fontFamily: 'Lato-Regular', fontSize: 14, color: '#718096' },
  statValue: { fontFamily: 'Lato-Bold', fontSize: 18, color: '#1A202C' },
  statNote: { fontFamily: 'Lato-Regular', fontSize: 12, color: '#A0AEC0' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontFamily: 'Lato-Bold', fontSize: 20, color: '#2D3748', marginBottom: 4, paddingTop: 10 },
  emptyStateContainer: { paddingVertical: 30, alignItems: 'center', marginTop: 15 },
  emptyStateText: { fontFamily: 'Lato-Regular', fontSize: 16, color: '#A0AEC0' },
  mainActionButton: { backgroundColor: '#4caf50', borderRadius: 8, height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  buttonPrimary: { flex: 1, backgroundColor: '#4caf50', borderRadius: 8, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 15 },
  buttonPrimaryText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 16 },
  buttonSecondary: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 8, height: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  buttonSecondaryText: { color: '#2e7d32', fontFamily: 'Lato-Bold', fontSize: 14, marginLeft: 8 },
  modalContainer: { flex: 1, backgroundColor: '#F8FBF8' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTitle: { fontFamily: 'Lato-Bold', fontSize: 22, color: '#1A202C' },
  modalContent: { padding: 16 },
  formRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  input: { flex: 1, marginHorizontal: 4, backgroundColor: '#FFFFFF', height: 48, borderColor: '#E2E8F0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontFamily: 'Lato-Regular', fontSize: 16, marginBottom: 16 },
  inputFull: { backgroundColor: '#FFFFFF', height: 48, borderColor: '#E2E8F0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontFamily: 'Lato-Regular', fontSize: 16, marginBottom: 16 },
  label: { fontFamily: 'Lato-Bold', fontSize: 14, color: '#4A5568', marginBottom: 8, marginTop: 10 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  listItemTitle: { fontFamily: 'Lato-Bold', fontSize: 16, color: '#333' },
  expandedContent: { padding: 15, backgroundColor: '#F7FAFC', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  detailLabel: { fontFamily: 'Lato-Bold', color: '#718096' },
  detailText: { fontFamily: 'Lato-Regular', fontSize: 14, color: '#4A5568', marginBottom: 8 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  sellModalContent: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, width: '100%' },
  qrModalContent: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, width: '90%', alignItems: 'center' },
  cropImagePreview: { width: '100%', height: 150, borderRadius: 8, marginTop: 10, marginBottom: 15, backgroundColor: '#F0F0F0' },
  cancelText: { textAlign: 'center', fontFamily: 'Lato-Regular', color: '#718096', marginTop: 15, padding: 10 },
  qrButton: { flex: 1, backgroundColor: '#2e7d32', borderRadius: 8, height: 50, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  listedChip: { backgroundColor: '#E6F5E9', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 10 },
  listedChipText: { color: '#2e7d32', fontFamily: 'Lato-Bold', fontSize: 12 },
  actionsContainer: { flexDirection: 'row', marginTop: 15, },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 15, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 10, },
});

export default FarmerDashboardScreen;