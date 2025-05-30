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
      source={backgroundImage ? { uri: backgroundImage } : require('../../assets/glamour.png')} // Use backgroundImage prop or default
      style={styles.fullscreenContainer}
      resizeMode="cover"
    >
      {/* Overlay for better text readability, less opaque */}
      <View style={styles.overlay} />

      <View className="flex-1 w-full justify-between items-center p-8">
        {/* Top section for caller info - centered */}
        <View className="w-full items-center mt-16">
          {/* <Image
            source={callerImage ? { uri: callerImage } : require('../../assets/avatar.png')}
            className="w-32 h-32 rounded-full mb-4 border-4 border-pink-500 shadow-lg"
          /> */}
          <Text className="text-white text-4xl font-extrabold mb-1 tracking-wide">{callerName || 'Unknown Caller'}</Text>
          <Text className="text-gray-200 text-xl font-medium">Incoming Call</Text>
        </View>

        {/* Bottom section for call action buttons - centered at bottom */}
        <View className="flex-row justify-center w-full px-4 mb-16 gap-x-24">
          <View className="items-center">
            <TouchableOpacity className="w-20 h-20 rounded-full bg-red-500 items-center justify-center shadow-lg" onPress={handleDeclineCall}>
              <Icon name="phone-hangup" size={30} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-sm font-semibold mt-2">Decline</Text>
          </View>
          <Animated.View style={{ transform: [{ scale: acceptButtonScale }] }}>
            <View className="items-center">
              <TouchableOpacity className="w-20 h-20 rounded-full bg-green-500 items-center justify-center shadow-lg" onPress={handleAcceptCall}>
                <Icon name="phone" size={30} color="white" />
              </TouchableOpacity>
              <Text className="text-white text-sm font-semibold mt-2">Accept</Text>
            </View>
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
    backgroundColor: 'rgba(0,0,0,0.4)', // Less opaque overlay for more visible background
  },
});

export default IncomingCall;
