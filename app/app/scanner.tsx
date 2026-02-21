import { Feather } from '@expo/vector-icons'; // Import icons
import { BarcodeScanningResult, Camera, CameraView } from 'expo-camera';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QRScannerScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (scanningResult.data) {
        setScanned(true);
        console.log(`Scanned data: ${scanningResult.data}`);
        router.replace({
            pathname: '/displayHarvest',
            params: { 
              harvestDataString: scanningResult.data,
              returnTo: 'mediatorDashboard' // Add return context
            }
        });
    }
  };

  if (hasPermission === null) {
    return <View style={styles.permissionContainer}><Text>Requesting for camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.permissionContainer}><Text>No access to camera. Please enable it in your settings.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* --- UPDATED OVERLAY with Back Button --- */}
      <SafeAreaView style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.overlayText}>Scan a Harvest QR Code</Text>
        <View style={styles.corner} />
      </SafeAreaView>
      
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

// --- UPDATED STYLES ---
const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', justifyContent: 'center' },
    permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    overlay: { 
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50, // Adjust for status bar height
        left: 10,
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent background
    },
    overlayText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Lato-Bold',
        position: 'absolute',
        top: 100,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    corner: {
        width: 250,
        height: 250,
        borderWidth: 4,
        borderColor: 'white',
        borderRadius: 16,
    },
});

export default QRScannerScreen;