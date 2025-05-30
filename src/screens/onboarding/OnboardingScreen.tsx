import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Linking, StatusBar, ActivityIndicator, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/authContext';
import { MotiView } from 'moti';

import { toast } from "sonner-native"
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

// Onboarding steps
enum OnboardingStep {
  USER_ENTRY = 2
}

export const OnboardingScreen = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.USER_ENTRY);
  const insets = useSafeAreaInsets(); // Get safe area insets
  
  
  // Reference to track mounting state
  const isMountedRef = React.useRef(false);

  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(50)).current;

  // Run once on mount only
  React.useEffect(() => {
    isMountedRef.current = true;
    
    if (isMountedRef.current) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        })
      ]).start();
    }

    return () => {
      isMountedRef.current = false;
      // Explicitly stop animations on unmount
      fadeAnim.stopAnimation();
      translateY.stopAnimation();
    };
  }, []);

  // New animation effect for step changes only
  React.useEffect(() => {
    if (!isMountedRef.current) return;
    
    // Only animate when changing steps
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, [currentStep]);

  const handleCompleteOnboarding = async () => {
    if (isLoading) return; // Prevent multiple attempts
    
    try {
      setIsLoading(true);
      
      // Login and mark onboarding as completed
      await login();
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      
      // Navigate to the Home screen after successful onboarding
      navigation.navigate('Tabs', { screen: 'HomeTab' });
    } catch (error) {
      console.error('Error during login:', error);
      setIsLoading(false);
      toast.error('Login failed. Please try again.');
    }
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://www.luvsab.com/privacy-policy');
  };

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Render the User Entry screen
  const renderUserEntryScreen = () => (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 800 }}
      className="flex-1 justify-end items-center px-6 pb-16"
    >
      

     

      <MotiView
        from={{ translateY: 30, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 800, delay: 600 }}
        className="w-full items-center"
      >
        <TouchableOpacity
          onPress={handleCompleteOnboarding}
          className="bg-pink-500 px-6 py-4 rounded-full w-72 items-center border-2 border-pink-200 shadow-lg"
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">
              Continue
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePrivacyPolicy}
          activeOpacity={0.7}
          className="py-2 px-4 bg-white/20 rounded-full mt-4"
        >
          <Text className="text-white text-sm font-bold">
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </MotiView>

      {/* Banner Ad */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 800, delay: 900 }}
        style={{
          position: 'absolute',
          bottom: 10 + insets.bottom,
        }}
      >
       
      </MotiView>
    </MotiView>
  );

  // Render the appropriate content based on the current step
  const renderContent = () => {
    return renderUserEntryScreen();
  };

  return (
    <View className="flex-1">
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent
      />
      <View
        className="flex-1"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Dark overlay with gradient for better text visibility */}
        <View className="absolute inset-0 bg-pink-300" />
        <Image
          source={require('assets/glamour.png')}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />

        <View style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right
        }}>
          <Animated.View
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [{ translateY: translateY }]
            }}
          >
            {renderContent()}
          </Animated.View>
        </View>
      </View>
    </View>
  );
};
