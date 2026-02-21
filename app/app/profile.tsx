import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
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

const ProfileScreen: React.FC = () => {
    const user = useLocalSearchParams();
    const [profileImage, setProfileImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setProfileImage(result.assets[0]);
        }
      };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="on-drag"
                automaticallyAdjustKeyboardInsets={true}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Feather name="chevron-left" size={28} color="#1A202C" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Your Profile</Text>
                    <View style={{width: 40}} /> 
                </View>

                <View style={styles.profilePicContainer}>
                    <TouchableOpacity style={styles.profilePicTouchable} onPress={handlePickImage}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage.uri }} style={styles.profilePic} />
                        ) : user.idImageUri ? (
                            <Image source={{ uri: getParam(user.idImageUri) }} style={styles.profilePic} />
                        ) : (
                            <View style={styles.profilePicPlaceholder}>
                                <Feather name="camera" size={32} color="#A0AEC0" />
                            </View>
                        )}
                        <View style={styles.editIcon}>
                            <Feather name="edit-2" size={16} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.profileName}>{getParam(user.name) || 'N/A'}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Personal Details</Text>
                    <ProfileInfoRow label="Age" value={"Not Set"} />
                    <ProfileInfoRow label="State" value={getParam(user.state)} />
                    <ProfileInfoRow label="Village" value={getParam(user.village)} />
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Farm Details</Text>
                    <ProfileInfoRow label="Land Area" value={getParam(user.landArea)} />
                    <ProfileInfoRow label="Annual Revenue" value={`₹ ${getParam(user.annualRevenue) || '0'}`} />
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Verified ID</Text>
                    {user.idImageUri ? (
                        <Image source={{ uri: getParam(user.idImageUri) }} style={styles.idImage} />
                    ) : (
                        <Text style={styles.noIdText}>No ID was uploaded during registration.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    scrollContent: { padding: 16, paddingTop: 80 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, marginTop: 20 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontFamily: 'Lato-Bold', fontSize: 22, color: '#1A202C' },
    profilePicContainer: { alignItems: 'center', marginBottom: 24 },
    profilePicTouchable: { position: 'relative' },
    profilePic: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#FFFFFF' },
    profilePicPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFFFFF' },
    editIcon: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#4caf50', padding: 8, borderRadius: 15 },
    profileName: { fontFamily: 'Lato-Bold', fontSize: 28, color: '#1A202C', marginTop: 12 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
    cardTitle: { fontFamily: 'Lato-Bold', fontSize: 18, color: '#2D3748', marginBottom: 16 },
    infoRow: { marginBottom: 12 },
    infoLabel: { fontFamily: 'Lato-Regular', fontSize: 14, color: '#A0AEC0', marginBottom: 4 },
    infoValue: { backgroundColor: '#F7FAFC', height: 48, borderColor: '#E2E8F0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontFamily: 'Lato-Regular', fontSize: 16, color: '#2D3748' },
    idImage: { width: '100%', height: 200, borderRadius: 8, resizeMode: 'contain' },
    noIdText: { fontFamily: 'Lato-Regular', color: '#A0AEC0', textAlign: 'center' },
    title: { fontFamily: 'Lato-Bold', fontSize: 28, color: '#2e7d32', marginBottom: 24, textAlign: 'center' },
    profileCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 2 },
    label: { fontFamily: 'Lato-Bold', fontSize: 16, color: '#4A5568', marginTop: 16 },
    value: { fontFamily: 'Lato-Regular', fontSize: 16, color: '#333', marginTop: 4 },
    imagePreview: { width: '100%', height: 200, borderRadius: 12, marginTop: 15, resizeMode: 'cover' },
});

export default ProfileScreen;