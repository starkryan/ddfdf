import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, Platform, Animated, Easing, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Keep for potential future use or if specific safe area handling is needed elsewhere
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { width, height } = Dimensions.get('window');

interface IncomingCallProps {
  videoUrls: string[]; // Still passed, but will be forwarded to VideoCallScreen
  callerName: string;
  callerImage?: string;
  onAccept: () => void; // Callback to dismiss and navigate
  onDecline: () => void; // Callback to dismiss
  backgroundImage?: string; // New prop for background image
}

const IncomingCall: React.FC<IncomingCallProps> = ({ videoUrls, callerName, callerImage, onAccept, onDecline, backgroundImage }) => {

  useEffect(() => {
    // Hide the status bar for a true fullscreen experience
    StatusBar.setHidden(true, 'fade');
    return () => {
      // Show the status bar when the component unmounts
      StatusBar.setHidden(false, 'fade');
    };
  }, []);

  const requestCameraPermission = async () => {
    let permission;
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA;
    } else if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.CAMERA;
    }

    if (permission) {
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        console.log('Camera permission granted');
        return true;
      } else {
        console.log('Camera permission denied');
        return false;
      }
    }
    return false;
  };

  const handleAcceptCall = async () => {
    const cameraGranted = await requestCameraPermission();
    // Call onAccept to dismiss this component and trigger navigation to VideoCallScreen
    onAccept();
  };

  const handleDeclineCall = () => {
    onDecline(); // Call the prop to dismiss the component from App.tsx
  };

  const acceptButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(acceptButtonScale, {
          toValue: 1.05,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(acceptButtonScale, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <ImageBackground
      source={backgroundImage ? { uri: backgroundImage } : require('../../assets/bg.jpeg')} // Use backgroundImage prop or default
      style={styles.fullscreenContainer}
      resizeMode="cover"
    >
      {/* Overlay for better text readability */}
      <View style={styles.overlay} />

      <View className="flex-1 justify-center items-center w-full px-4">
        <Image
          source={callerImage ? { uri: callerImage } : require('../../assets/avatar.png')}
          className="w-32 h-32 rounded-full mb-5 border-2 border-white"
        />
        <Text className="text-white text-3xl font-bold mb-2 text-center">{callerName || 'Unknown Caller'}</Text>
        <Text className="text-gray-400 text-lg mb-12 text-center">Incoming Call</Text>

        <View className="flex-row justify-around w-full px-4">
          <TouchableOpacity className="flex-1 p-3 rounded-full bg-red-600 items-center justify-center mx-2" onPress={handleDeclineCall}>
            <View className="items-center">
              <Icon name="phone-hangup" size={24} color="white" />
              <Text className="text-white text-base font-bold mt-1">Decline</Text>
            </View>
          </TouchableOpacity>
          <Animated.View style={{ transform: [{ scale: acceptButtonScale }], flex: 1, marginHorizontal: 8 }}>
            <TouchableOpacity className="p-3 rounded-full bg-green-600 items-center justify-center" onPress={handleAcceptCall}>
              <View className="items-center">
                <Icon name="phone" size={24} color="white" />
                <Text className="text-white text-base font-bold mt-1">Accept</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent black overlay
  },
});

export default IncomingCall;
