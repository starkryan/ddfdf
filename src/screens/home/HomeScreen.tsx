import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StatusBar, RefreshControl, Platform, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getCharacters } from '../../api/services';
import { toast } from 'sonner-native';
import { TabScreenProps } from '../../navigation/types';
import BannerAdComponent from '../../components/ads/BannerAdComponent';
import NativeAdComponent from '../../components/ads/NativeAdComponent';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import { useFocusEffect } from '@react-navigation/native';

// Import new components and Profile interface
import ProfileCard, { Profile } from './ProfileCard';
import ProfileSkeletonLoader from './ProfileSkeletonLoader';
import CategoryTabs from './CategoryTabs';

// Fallback data in case API fails
const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Eleanor',
    age: 24,
    occupation: 'Polish historian and lecturer at a prestigious university',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    isNew: true,
    style: 'Academic',
  },
  {
    id: '2',
    name: 'Louna',
    age: 26,
    occupation: 'Professional model and fashion designer',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    isNew: true,
    style: 'Elegant',
  },
  {
    id: '3',
    name: 'Lila',
    age: 21,
    occupation: 'Gothic-punk College Student',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    style: 'Gothic',
  },
  {
    id: '4',
    name: 'Savannah',
    age: 19,
    occupation: 'Freshman athlete, volleyball team captain',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    style: 'Athletic',
  },
  {
    id: '5',
    name: 'Victoria',
    age: 23,
    occupation: 'Art gallery curator and painter',
    image: 'https://images.unsplash.com/photo-1524638431109-93d95c968f03',
    style: 'Artistic',
  },
  {
    id: '6',
    name: 'Luna',
    age: 22,
    occupation: 'Alternative model and makeup artist',
    image: 'https://images.unsplash.com/photo-1526080652727-5b77f74eacd2',
    style: 'Gothic',
  },
];

// Define types for grid items
type GridItem = 
  | { type: 'profile'; data: Profile; id: string }
  | { type: 'nativeAd'; id: string }
  | { type: 'dummy'; id: string; data: Profile };

const ProfileGrid = ({ profiles, onProfilePress, loading, onRefresh, selectedTab, setSelectedTab, tabs }: { 
  profiles: Profile[]; 
  onProfilePress: (profile: Profile) => void;
  loading: boolean;
  onRefresh: () => void;
  selectedTab: number;
  setSelectedTab: (index: number) => void;
  tabs: Array<{ key: string; title: string; data: Profile[] }>;
}) => {
  const insets = useSafeAreaInsets();

  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  // Create a modified data array that includes profiles and ad items at specific positions
  const processedData: GridItem[] = useMemo(() => {
    const data: GridItem[] = [];
    profiles.forEach((profile, index) => {
      data.push({ type: 'profile', data: profile, id: profile.id });
      
      // Show ad after every 6th profile for less intrusive experience
      if ((index + 1) % 6 === 0 && index > 0) {
        data.push({ 
          type: 'nativeAd', 
          id: `native-ad-${Math.floor(index/6)}` 
        });
      }
    });

    // Ensure grid alignment with dummy items if needed
    if (data.length % 2 !== 0) {
      data.push({ 
        type: 'dummy', 
        id: 'dummy-spacer',
        data: {} as Profile
      } as any);
    }
    return data;
  }, [profiles]);

  // Define the column wrapper style
  const columnWrapperStyle: ViewStyle = useMemo(() => ({
    justifyContent: 'space-between',
    paddingHorizontal: 8
  }), []);

  if (loading && profiles.length === 0) {
    return <ProfileSkeletonLoader />;
  }

  return (
    <FlatList
      data={processedData}
      renderItem={({ item, index }) => {
        // Handle different item types
        if (item.type === 'nativeAd') {
          return (
            <View style={{ 
              width: '100%', 
              marginVertical: 16,
              paddingHorizontal: 16
            }}>
              <View style={{
                width: '100%',
                borderRadius: 20,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: 'rgba(236, 72, 153, 0.2)', // Pink border to match theme
                backgroundColor: 'rgba(17, 24, 39, 0.8)', // Darker background
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
              }}>
                <Animated.View
                  entering={FadeInDown.duration(400).springify()}
                >
                  <NativeAdComponent 
                    onAdLoaded={() => console.log('Native ad loaded in HomeScreen')}
                    onAdFailedToLoad={(error) => console.error('Native ad failed to load:', error)}
                  />
                </Animated.View>
              </View>
            </View>
          );
        }
        
        // Skip rendering for dummy items
        if (item.type === 'dummy') {
          return <View style={{ width: (Platform.OS === 'ios' ? 0 : 0) }} />; // Use 0 width for dummy to not affect layout
        }
        
        // Regular profile cards
        return (
          <ProfileCard profile={item.data} onPress={onProfilePress} index={index} />
        );
      }}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={columnWrapperStyle}
      contentContainerStyle={{ 
        paddingHorizontal: 12,
        paddingBottom: Platform.OS === 'ios' ?
          insets.bottom + 120 :
          120 + Math.min(insets.bottom, 15),
        paddingTop: 4
      }}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading} // Use the loading prop directly
          onRefresh={handleRefresh}
          tintColor="#EC4899"
        />
      }
      ListHeaderComponent={() => (
        <>
          <CategoryTabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabs={tabs}
          />
           
          {/* Banner ad below the tabs - small and unobtrusive */}
          {Platform.OS === 'android' && (
            <BannerAdComponent
              size={BannerAdSize.BANNER}
              containerStyle={{ marginBottom: 10 }}
              onAdLoaded={() => console.log('Home banner ad loaded')}
              onAdFailedToLoad={(error) => console.log('Home banner ad failed to load:', error)}
            />
          )}
        </>
      )}
      ListEmptyComponent={() => (
        <View className="flex-1 justify-center items-center py-10">
          <Icon name="emoticon-sad-outline" size={48} color="#6B7280" />
          <Text className="text-gray-400 mt-4 text-lg">No characters found</Text>
        </View>
      )}
    />
  );
};

interface HomeScreenProps extends TabScreenProps<'HomeTab'> {
  triggerIncomingCall: () => Promise<void>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, triggerIncomingCall }) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [characters, setCharacters] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigationStatus, setNavigationStatus] = useState<string | null>(null);

  const fetchCharacters = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCharacters();
      const withNewFlag = data.map((char: Profile, index: number) => ({
        ...char,
        isNew: index < 2
      }));
      setCharacters(withNewFlag);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
      setLoading(false);
      toast.error("Network Error");
      setCharacters(mockProfiles.map((profile, index) => ({
        ...profile,
        isNew: index < 2
      })));
    }
  }, []);
  
  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  // Trigger incoming call when HomeScreen is focused
  useFocusEffect(
    useCallback(() => {
      const randomDelay = Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000; // 10 to 20 seconds
      const timer = setTimeout(() => {
        triggerIncomingCall();
      }, randomDelay);

      return () => {
        clearTimeout(timer);
      };
    }, [triggerIncomingCall])
  );

  // Handle any navigation events to clear status messages
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (navigationStatus) {
        setNavigationStatus(null);
      }
    });
    return unsubscribe;
  }, [navigation, navigationStatus]);

  const memoizedTabs = useMemo(() => [
    { key: 'all', title: 'All', data: characters },
    { key: 'new', title: 'New', data: characters.filter(p => p.isNew) },
    { key: 'trending', title: 'Trending', data: characters.slice(0, 3) },
    { key: 'popular', title: 'Popular', data: characters.slice(2) },
    { key: 'recommended', title: 'Recommended', data: characters.slice(1, 4) },
    { key: 'featured', title: 'Featured', data: characters.slice(3) },
  ], [characters]);

  const handleProfilePress = useCallback((profile: Profile) => {
    navigation.navigate('Character', { profile });
  }, [navigation]);

  return (
    <View className="flex-1 bg-[#111827]">
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent
      />
      
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Modern Header */}
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-2">
              <Image 
                source={require('../../../assets/logo.png')} 
                style={{ width: 120, height: 40 }}
                resizeMode="contain"
              />
            </View>
            <View className="flex-row items-center space-x-3">
              <TouchableOpacity 
                onPress={() => navigation.navigate('Search')} 
                className="bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-2xl"
              >
                <Icon name="search" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ProfileGrid 
          profiles={memoizedTabs[selectedTab].data} 
          onProfilePress={handleProfilePress}
          loading={loading}
          onRefresh={fetchCharacters}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          tabs={memoizedTabs}
        />
        
       
      </SafeAreaView>
    </View>
  );
};
