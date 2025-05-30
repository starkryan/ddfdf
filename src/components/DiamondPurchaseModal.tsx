import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
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
      <View className="flex-1 justify-center items-center bg-black/70">
        <View className="m-5 bg-white rounded-2xl p-8 items-center shadow-lg shadow-black/25 elevation-5 w-[85%] max-h-[70%]">
          <TouchableOpacity className="absolute top-2.5 right-2.5 z-10" onPress={onClose}>
            <Icon name="close-circle" size={30} color="#999" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold mb-2.5 text-gray-800">Purchase Diamonds</Text>
          <Text className="text-base text-gray-600 mb-5 text-center">Recharge to continue talking!</Text>

          {diamondPackages.map((pack) => (
            <TouchableOpacity
              key={pack.id}
              className={`
                flex-row items-center bg-gray-100 rounded-lg p-4 my-2.5 w-full shadow-sm shadow-black/20 elevation-2 relative
                ${pack.tag === 'Best Value' ? 'bg-yellow-50 border-2 border-yellow-400' : ''}
                ${pack.tag === 'Hot' ? 'bg-red-50 border-2 border-red-400' : ''}
              `}
              onPress={() => handleNavigateToPayment(pack.amount, pack.coins)}
            >
              <Icon name="diamond-stone" size={30} color={pack.tag === 'Best Value' ? '#FFD700' : '#00BFFF'} />
              <View className="ml-4">
                <Text className="text-lg font-bold text-gray-800">{pack.label}</Text>
                <Text className="text-base text-gray-700 mt-1.5">{pack.price}</Text>
              </View>
              {pack.tag && (
                <View className={`
                  absolute -top-2.5 -right-2.5 px-2 py-1 rounded-xl z-20
                  ${pack.tag === 'Best Value' ? 'bg-yellow-500' : ''}
                  ${pack.tag === 'Hot' ? 'bg-red-500' : ''}
                `}>
                  <Text className="text-white text-xs font-bold">{pack.tag}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          <Text className="text-xs text-gray-600 mt-5 text-center">Your conversation will resume after successful recharge.</Text>
        </View>
      </View>
    </Modal>
  );
};

export default DiamondPurchaseModal;
