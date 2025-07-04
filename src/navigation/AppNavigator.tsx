import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/authContext';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { TabNavigator } from './TabNavigator';
import CharacterScreen from '../screens/character/CharacterScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import { RootStackParamList } from './types';
import SearchScreen from '../screens/search/SearchScreen';
import PremiumScreen from '../screens/subscription/PremiumScreen';
import VideoCallScreen from '../screens/chat/VideoCallScreen'; // Import VideoCallScreen
import PaymentScreen from '../screens/payment/PaymentScreen'; // Import PaymentScreen
const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  triggerIncomingCall: () => Promise<void>;
}

export const AppNavigator = ({ triggerIncomingCall }: AppNavigatorProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading indicator
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName={isAuthenticated ? 'Tabs' : 'Onboarding'}
    >

      {/* Common screens - available in both authenticated and unauthenticated states */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Premium" component={PremiumScreen} />

      {!isAuthenticated ? (
        <>
        </>
      ) : (
        <>
          <Stack.Screen name="Tabs">
            {props => <TabNavigator {...props} triggerIncomingCall={triggerIncomingCall} />}
          </Stack.Screen>
          <Stack.Screen name="Character" component={CharacterScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
