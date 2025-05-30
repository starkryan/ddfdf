
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import BottomSheet, { BottomSheetView, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Required for BottomSheet

const { width, height } = Dimensions.get('window');

interface DiamondPurchaseModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPurchase: (amount: number, coins: number) => void;
}

const DiamondPurchaseModal: React.FC<DiamondPurchaseModalProps> = ({ isVisible, onClose, onPurchase }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  // Effect to open/close the bottom sheet based on isVisible prop
  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  // Callback for when the sheet changes state
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) { // -1 means the sheet is fully closed
      onClose();
    }
  }, [onClose]);

  const handleNavigateToPayment = (amount: number, coins: number) => {
    bottomSheetModalRef.current?.dismiss(); // Dismiss the modal before navigating
    // Introduce a small delay to ensure the modal is fully dismissed before navigating
    setTimeout(() => {
      navigation.navigate('Payment', { amount, coins }); // Assuming 'Payment' screen handles the actual transaction
    }, 300); // 300ms delay, adjust if needed
  };

  const diamondPackages = [
    { id: 'pack1', amount: 100, coins: 120, label: '120 Coins', price: '₹100' },
    { id: 'pack2', amount: 200, coins: 250, label: '250 Coins', price: '₹200' },
    { id: 'pack3', amount: 400, coins: 500, label: '500 Coins', price: '₹400' },
    { id: 'pack4', amount: 500, coins: 650, label: '650 Coins', price: '₹500', tag: 'Hot' },
    { id: 'pack5', amount: 1000, coins: 1300, label: '1300 Coins', price: '₹1000' },
    { id: 'pack6', amount: 1500, coins: 2000, label: '2000 Coins', price: '₹1500' },
    { id: 'pack7', amount: 2000, coins: 2700, label: '2700 Coins', price: '₹2000' },
    { id: 'pack8', amount: 3000, coins: 4500, label: '4500 Coins', price: '₹3000', tag: 'Best Value' },
  ];

  return (
    // BottomSheetModalProvider should ideally wrap the root of your app.
    // For this component, we'll wrap it here for demonstration, but consider moving it higher up.
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1} // Initial snap point (e.g., '50%')
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={({ style }) => (
          <View style={[style, styles.backdrop]} />
        )}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.contentContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close-circle" size={30} color="#999" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Purchase Diamonds</Text>
          <Text style={styles.modalSubtitle}>Recharge to continue talking!</Text>

          <View style={styles.packagesContainer}>
            {diamondPackages.map((pack) => (
              <TouchableOpacity
                key={pack.id}
                style={[
                  styles.packageCard,
                  pack.tag === 'Best Value' && styles.premiumPackage,
                  pack.tag === 'Hot' && styles.hotPackage,
                ]}
                onPress={() => handleNavigateToPayment(pack.amount, pack.coins)}
              >
                <Icon name="diamond-stone" size={30} color={pack.tag === 'Best Value' ? '#FF69B4' : '#FF1493'} />
                <View style={styles.packageDetails}>
                  <Text style={styles.packageCoins}>{pack.label}</Text>
                  <Text style={styles.packagePrice}>{pack.price}</Text>
                </View>
                {pack.tag && (
                  <View style={[styles.tagContainer, pack.tag === 'Best Value' ? styles.bestValueTag : styles.hotTag]}>
                    <Text style={styles.tagText}>{pack.tag}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.noteText}>Your conversation will resume after successful recharge.</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  handleIndicator: {
    backgroundColor: '#ccc',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20, // Increased padding for better aesthetics
  },
  modalTitle: {
    fontSize: 26, // Slightly larger title
    fontWeight: 'bold',
    marginBottom: 8, // Reduced margin
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25, // Increased margin
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  premiumPackage: {
    backgroundColor: '#FFFACD', // Light gold for premium
    borderWidth: 2,
    borderColor: '#FFD700', // Gold border
  },
  hotPackage: {
    backgroundColor: '#FFEBEE', // Light red for hot
    borderWidth: 2,
    borderColor: '#FF6347', // Orange-red border
  },
  packageDetails: {
    marginLeft: 15,
  },
  packageCoins: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  packagePrice: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  tagContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 2,
  },
  bestValueTag: {
    backgroundColor: '#FFD700', // Gold
  },
  hotTag: {
    backgroundColor: '#FF6347', // Orange-red
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    width: '48%', // Approximately half width for two items per row
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    position: 'relative', // For positioning the tag
  },
  noteText: {
    fontSize: 12,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default DiamondPurchaseModal;
