import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ViewStyle, StyleProp } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export interface Profile {
  id: string;
  name: string;
  age: number | string;
  occupation: string;
  image: { uri: string } | string;
  backgroundImage?: { uri: string } | string;
  isNew?: boolean;
  style?: StyleType;
  traits?: string[];
  interests?: string[];
  accentColor?: string;
  textColor?: string;
  description?: string;
  personality?: string;
  location?: string;
  responseTime?: string;
  email?: string;
  isPremium?: boolean;
}

const countryFlags: Record<string, string> = {
  'India': '🇮🇳',
  'USA': '🇺🇸',
  'UK': '🇬🇧',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
  'New Zealand': '🇳🇿',
  'South Africa': '🇿🇦',
  'Brazil': '🇧🇷',
  'Argentina': '🇦🇷',
  'Chile': '🇨🇱',
  'Mexico': '🇲🇽',
  'Colombia': '🇨🇴',
  'Peru': '🇵🇪',
};

export type StyleType = 'Academic' | 'Elegant' | 'Gothic' | 'Athletic' | 'Artistic';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

const STYLE_COLORS: Record<StyleType, [string, string]> = {
  Academic: ['#6366F1', '#4F46E5'], // Indigo
  Elegant: ['#EC4899', '#DB2777'], // Pink
  Gothic: ['#6B7280', '#374151'], // Gray
  Athletic: ['#10B981', '#059669'], // Emerald
  Artistic: ['#F59E0B', '#B45309'], // Amber
};

const getStyleColors = (style: StyleType | undefined): [string, string] => {
  return style ? STYLE_COLORS[style] : STYLE_COLORS.Academic;
};

interface ProfileCardProps {
  profile: Profile;
  onPress: (profile: Profile) => void;
  index: number; // For animation delay
}

const ProfileCard: React.FC<ProfileCardProps> = React.memo(({ profile, onPress, index }) => {
  let style = profile.style as StyleType;
  if (!style && profile.traits && profile.traits.length > 0) {
    const trait = profile.traits[0];
    if (trait.includes('academic') || trait.includes('smart')) {style = 'Academic';}
    else if (trait.includes('elegant') || trait.includes('fashion')) {style = 'Elegant';}
    else if (trait.includes('gothic') || trait.includes('dark')) {style = 'Gothic';}
    else if (trait.includes('athletic') || trait.includes('sports')) {style = 'Athletic';}
    else if (trait.includes('artistic') || trait.includes('creative')) {style = 'Artistic';}
    else {style = 'Academic';}
  }

  const [primaryColor, secondaryColor] = getStyleColors(style);
  const imageUri = typeof profile.backgroundImage === 'string' ? profile.backgroundImage : profile.backgroundImage?.uri;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(300)}
      className="mb-4"
      style={{ width: CARD_WIDTH }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        className="mb-4"
        style={{ width: CARD_WIDTH }}
        onPress={() => onPress(profile)}
      >
        <View className="relative overflow-hidden rounded-2xl border border-white/10">
          {/* Main Image */}
          <Image
            source={{ uri: imageUri }}
            className="w-full"
            style={{ height: CARD_WIDTH * 1.4, resizeMode: 'cover' }}
          />

          {/* Gradient Overlays */}
          <View className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
          <View className="absolute inset-0 bg-black/10" />

          {/* New Badge */}
          {profile.isNew && (
            <View className="absolute top-3 left-3 flex-row items-center bg-pink-500/90 rounded-full px-2.5 py-1">
              <Icon name="sparkles" size={12} color="#fff" />
              <Text className="text-white text-xs font-medium ml-1">New</Text>
            </View>
          )}

          {/* Bottom Content */}
          <View className="absolute bottom-0 left-0 right-0 p-3">
            {/* Name and Age */}
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Text className="text-white text-base font-bold mr-1">
                  {profile.name}
                </Text>
                <Ionicons name="verified" size={16} color="#60A5FA" />
              </View>
              <Text className="text-white/90 text-sm font-medium">
                {profile.age}
              </Text>
            </View>

            {/* Location and Style Tags */}
            <View className="flex-row items-center flex-wrap gap-2">
              {profile.location && (
                <View className="flex-row items-center bg-black/40 rounded-full px-2 py-1">
                  <Icon name="location" size={12} color="#fff" />
                  <Text className="text-white/90 text-xs ml-1">
                    {profile.location.split(' ')[0]} {countryFlags[profile.location]}
                  </Text>
                </View>
              )}
              {profile.style && (
                <View
                  className="bg-black/40 rounded-full px-2 py-1"
                  style={{ borderColor: primaryColor, borderWidth: 1 }}
                >
                  <Text className="text-white/90 text-xs">{profile.style}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default ProfileCard;
