import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, Platform, StatusBar, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

const { width, height } = Dimensions.get('window');

interface VideoCallScreenParams {
  videoUrls: string[];
  callerName: string;
  callerImage?: string;
}

const VideoCallScreen: React.FC = () => {
  const route = useRoute();
  const { videoUrls, callerName, callerImage } = route.params as VideoCallScreenParams;

  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true); // Mute video voice by default
  const [isCameraOn, setIsCameraOn] = useState(false); // Reintroduce isCameraOn state
  const [isSpeakerOn, setIsSpeakerOn] = useState(true); // State for speaker

  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraDevice = useCameraDevice('front'); // Use front camera for user's video

  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    if (videoUrls && videoUrls.length > 0) {
      const randomIndex = Math.floor(Math.random() * videoUrls.length);
      const selectedVideo = videoUrls[randomIndex];
      setCurrentVideoUrl(selectedVideo);
    } else {
      setCurrentVideoUrl(null);
    }
    // Initialize isCameraOn based on current permission status
    const checkInitialCameraPermission = async () => {
      if (hasPermission) {
        setIsCameraOn(true); // Assume camera is on if permission is already granted
      }
    };
    checkInitialCameraPermission();
  }, [videoUrls, hasPermission]); // Add hasPermission to dependency array

  const navigation = useNavigation();

  const handleEndCall = () => {
    navigation.goBack();
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleCamera = async () => {
    if (!isCameraOn) { // If camera is currently off, try to turn it on
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert(
            "Camera Permission Required",
            "Please grant camera permission in your app settings to use your camera.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => { /* Implement open app settings if needed */ } }
            ]
          );
          return;
        }
      }
      setIsCameraOn(true); // Turn camera on
    } else { // If camera is currently on, turn it off
      setIsCameraOn(false);
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(prev => !prev);
  };

  // If camera device is not available, show a message
  if (cameraDevice == null) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        <Text className="text-white text-lg">No camera device found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black justify-center items-center">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      {currentVideoUrl ? (
        <>
          <Video
            source={{ uri: currentVideoUrl }}
            style={{ width: width, height: height }}
            resizeMode="cover"
            repeat={true}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch="obey"
            muted={isMuted}
            paused={false}
            controls={false}
            onLoad={(data) => console.log('VideoCallScreen: Video loaded:', data)}
            onError={(error) => console.error('VideoCallScreen: Video error:', error)}
          />
          {/* Caller's image when video is not playing */}
          {!currentVideoUrl && callerImage && (
            <Image source={{ uri: callerImage }} className="w-full h-full absolute" resizeMode="cover" />
          )}
          {/* User's small camera preview using VisionCamera */}
          {isCameraOn && (
            <View className="absolute top-16 right-5 w-24 h-40 bg-gray-600 rounded-lg overflow-hidden">
              {hasPermission ? (
                <Camera
                  ref={cameraRef}
                  style={StyleSheet.absoluteFill}
                  device={cameraDevice}
                  isActive={isCameraOn} // Camera is active when isCameraOn is true
                  video={true} // Enable video capture for live preview
                  audio={false} // Audio handled separately
                />
              ) : (
                <View style={StyleSheet.absoluteFill} className="justify-center items-center">
                  <Text className="text-white text-xs text-center">No Camera Access</Text>
                </View>
              )}
            </View>
          )}

          {/* Video Call Controls */}
          <View className="absolute bottom-8 flex-row justify-around w-full bg-black bg-opacity-60 rounded-full py-4 items-center">
            <TouchableOpacity className="items-center justify-center p-2" onPress={toggleMute}>
              <Icon name={isMuted ? "microphone-off" : "microphone"} size={30} color="white" />
              <Text className="text-white text-xs mt-1">{isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center justify-center p-2" onPress={toggleCamera}>
              <Icon name={isCameraOn ? "video" : "video-off"} size={30} color="white" />
              <Text className="text-white text-xs mt-1">{isCameraOn ? 'Camera Off' : 'Camera On'}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-500 rounded-full w-16 h-16 justify-center items-center mx-2" onPress={handleEndCall}>
              <Icon name="phone-hangup" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="items-center justify-center p-2" onPress={toggleSpeaker}>
              <Icon name={isSpeakerOn ? "volume-high" : "volume-off"} size={30} color="white" />
              <Text className="text-white text-xs mt-1">{isSpeakerOn ? 'Speaker Off' : 'Speaker On'}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center justify-center p-2">
              <Icon name="image-multiple" size={30} color="white" />
              <Text className="text-white text-xs mt-1">Gallery</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className="absolute top-1/2 -mt-5 self-center bg-black bg-opacity-50 p-2 rounded-md">
          <Text className="text-white text-lg">Video not available.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default VideoCallScreen;
