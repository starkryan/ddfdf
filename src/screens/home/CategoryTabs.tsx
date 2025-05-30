import React from 'react';
import { ScrollView, TouchableOpacity, Text, Platform, View } from 'react-native';
import { Profile } from './ProfileCard'; // Assuming Profile interface is exported from ProfileCard

interface CategoryTabsProps {
  selectedTab: number;
  setSelectedTab: (index: number) => void;
  tabs: Array<{ key: string; title: string; data: Profile[] }>;
}

const CategoryTabs: React.FC<CategoryTabsProps> = React.memo(({ selectedTab, setSelectedTab, tabs }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 16 }}
    >
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => setSelectedTab(index)}
          className={`px-4 py-2 rounded-full mr-2 ${
            selectedTab === index
              ? 'bg-pink-500'
              : 'bg-white/10'
          }`}
        >
          <Text
            className={`font-medium ${
              selectedTab === index
                ? 'text-white'
                : 'text-white/70'
            }`}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

export default CategoryTabs;
