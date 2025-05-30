import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

const { width, height } = Dimensions.get('window');

interface DiamondPurchaseModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPurchase: (amount: number, coins: number) => void;
}

const DiamondPurchaseModal: React.FC<DiamondPurchaseModalProps> = ({ isVisible, onClose, onPurchase }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleNavigateToPayment = (amount: number, coins: number) => {
    onClose(); // Close the modal before navigating
    navigation.navigate('Payment', { amount, coins }); // Assuming 'Payment' screen handles the actual transaction
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close-circle" size={30} color="#999" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Purchase Diamonds</Text>
          <Text style={styles.modalSubtitle}>Recharge to continue talking!</Text>

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
              <Icon name="diamond-stone" size={30} color={pack.tag === 'Best Value' ? '#FFD700' : '#00BFFF'} />
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

          <Text style={styles.noteText}>Your conversation will resume after successful recharge.</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.85,
    maxHeight: height * 0.7,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    position: 'relative', // For positioning the tag
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
  noteText: {
    fontSize: 12,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default DiamondPurchaseModal;
