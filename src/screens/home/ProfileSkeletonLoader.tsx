import React from 'react';
import { View, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

const ProfileSkeletonLoader: React.FC = () => {
  const skeletonCards = Array(6).fill(null); // Show 6 skeleton cards

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {skeletonCards.map((_, index) => (
          <View
            key={index}
            style={{
              width: CARD_WIDTH,
              marginBottom: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            <SkeletonPlaceholder
              backgroundColor="#2A2A2A"
              highlightColor="#3D3D3D"
              speed={1200}
            >
              <SkeletonPlaceholder.Item
                width={CARD_WIDTH}
                height={CARD_WIDTH * 1.4}
                borderRadius={16}
              >
                <SkeletonPlaceholder.Item
                  position="absolute"
                  bottom={12}
                  left={12}
                  right={12}
                >
                  {/* Name and Age */}
                  <SkeletonPlaceholder.Item
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom={8}
                  >
                    <SkeletonPlaceholder.Item width={80} height={20} borderRadius={4} />
                    <SkeletonPlaceholder.Item width={30} height={20} borderRadius={4} />
                  </SkeletonPlaceholder.Item>

                  {/* Tags */}
                  <SkeletonPlaceholder.Item
                    flexDirection="row"
                    alignItems="center"
                    gap={8}
                  >
                    <SkeletonPlaceholder.Item width={70} height={24} borderRadius={12} />
                    <SkeletonPlaceholder.Item width={60} height={24} borderRadius={12} />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ProfileSkeletonLoader;
