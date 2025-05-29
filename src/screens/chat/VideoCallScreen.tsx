import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, Platform, StatusBar, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { RootStackParamList } from '../../navigation/types';

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
    const checkInitialCameraPermission = async () => {
      if (hasPermission) {
        setIsCameraOn(true);
      }
    };
    checkInitialCameraPermission();

    const callTimeout = setTimeout(() => {
      handleEndCallAndNavigateToPremium();
    }, 10000);

    return () => clearTimeout(callTimeout);
  }, [videoUrls, hasPermission]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleEndCall = () => {
    navigation.goBack();
  };

  const handleEndCallAndNavigateToPremium = () => {
    navigation.goBack();
    navigation.navigate('Premium', { fromOnboarding: false });
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleCamera = async () => {
    if (!isCameraOn) {
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
      setIsCameraOn(true);
    } else {
      setIsCameraOn(false);
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(prev => !prev);
  };

  if (cameraDevice == null) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        <Text className="text-white text-lg">Waiting</Text>
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
          {!currentVideoUrl && callerImage && (
            <Image source={{ uri: callerImage }} className="w-full h-full absolute" resizeMode="cover" />
          )}
          {isCameraOn && (
            <View className="absolute top-16 right-5 w-24 h-40 bg-gray-600 rounded-lg overflow-hidden">
              {hasPermission ? (
                <Camera
                  ref={cameraRef}
                  style={StyleSheet.absoluteFill}
                  device={cameraDevice}
                  isActive={isCameraOn}
                  video={true}
                  audio={false}
                />
              ) : (
                <View style={StyleSheet.absoluteFill} className="justify-center items-center">
                  <Text className="text-white text-xs text-center">No Camera Access</Text>
                </View>
              )}
            </View>
          )}
          <View className="absolute bottom-8 flex-row justify-center w-full bg-black bg-opacity-60 rounded-full py-4 px-4 items-center">
            <TouchableOpacity className="items-center justify-center p-2 mx-2" onPress={toggleMute}>
              <View className="items-center">
                <Icon name={isMuted ? "microphone-off" : "microphone"} size={30} color="#FFD700" />
                <Text className="text-white text-xs mt-1">{isMuted ? 'Unmute' : 'Mute'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="items-center justify-center p-2 mx-2" onPress={toggleCamera}>
              <View className="items-center">
                <Icon name={isCameraOn ? "video" : "video-off"} size={30} color="#00BFFF" />
                <Text className="text-white text-xs mt-1">{isCameraOn ? 'Camera Off' : 'Camera On'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-500 rounded-full w-16 h-16 mx-2" onPress={handleEndCall}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="phone-hangup" size={30} color="white" />
               
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="items-center justify-center p-2 mx-2" onPress={toggleSpeaker}>
              <View className="items-center">
                <Icon name={isSpeakerOn ? "volume-high" : "volume-off"} size={30} color="#32CD32" />
                <Text className="text-white text-xs mt-1">{isSpeakerOn ? 'Speaker Off' : 'Speaker On'}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="items-center justify-center p-2 mx-2">
              <View className="items-center">
                <Icon name="sticker-emoji" size={30} color="#FF6347" />
                <Text className="text-white text-xs mt-1">Happy</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className="absolute top-1/2 -mt-5 self-center bg-black bg-opacity-50 p-2 rounded-md">
          <Text className="text-white text-lg">Uh ho. Something went wrong.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default VideoCallScreen;
