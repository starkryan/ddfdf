import React from 'react';
import { View, Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ParamListBase, RouteProp } from '@react-navigation/native'; // Import RouteProp and ParamListBase

import { HomeScreen } from '../screens/home/HomeScreen';
import InboxScreen from '../screens/inbox/InboxScreen';
import { FavoriteScreen } from '../screens/favorite/FavoriteScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { TabStackParamList, RootStackParamList } from './types';

export type TabScreenProps<T extends keyof TabStackParamList> = CompositeScreenProps<
  MaterialTopTabScreenProps<TabStackParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

const Tab = createMaterialTopTabNavigator<TabStackParamList>();

// Custom tab bar item to control the layout and appearance
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  // Calculate responsive height for the tab bar
  const tabBarHeight = Math.max(65, windowHeight * 0.08); // Minimum 65, or 8% of screen height

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'transparent',
        height: tabBarHeight + insets.bottom,
        paddingBottom: insets.bottom,
        borderTopColor: 'transparent',
        marginBottom: 5, // Added marginBottom for better view on some devices
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: windowHeight * 0.01, // Responsive padding
                transform: [{ scale: isFocused ? 1.05 : 1 }],
              }}
            >
              <View
                style={{
                  padding: windowHeight * 0.01, // Responsive padding
                  borderRadius: isFocused ? 16 : 12,
                  backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  borderWidth: 1,
                  borderColor: isFocused ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                }}
              >
                {options.tabBarIcon && options.tabBarIcon({
                  color: isFocused ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                  focused: isFocused,
                  size: windowHeight * 0.03 // Responsive icon size
                })}
              </View>
              <Text
                style={{
                  fontSize: windowHeight * 0.018, // Responsive font size
                  fontWeight: '500',
                  color: isFocused ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                  marginTop: windowHeight * 0.005, // Responsive margin
                }}
              >
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

interface TabNavigatorProps {
  triggerIncomingCall: () => Promise<void>;
}

export const TabNavigator = ({ triggerIncomingCall }: TabNavigatorProps) => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions(); // Re-added useWindowDimensions here

  return (
    <View style={{ flex: 1, backgroundColor: '#111827' }}>
      <Tab.Navigator
        style={{
          position: 'relative',
          minHeight: windowHeight - (48 + insets.bottom), // Use windowHeight
        }}
        tabBarPosition="bottom"
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          tabBarIndicatorStyle: {
            opacity: 0,
            height: 0,
          },
          swipeEnabled: true,
          animationEnabled: true,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Animated.View entering={FadeInDown}>
                <Icon name="home-outline" color={color} size={windowHeight * 0.03} />
              </Animated.View>
            ),
          }}
        >
          {props => <HomeScreen {...props} triggerIncomingCall={triggerIncomingCall} />}
        </Tab.Screen>
        <Tab.Screen
          name="Inbox"
          component={InboxScreen}
          options={{
            title: 'Inbox',
            tabBarIcon: ({ color }) => (
              <Animated.View entering={FadeInDown.delay(100)}>
                <Icon name="chatbubble-ellipses-outline" color={color} size={windowHeight * 0.03} />
              </Animated.View>
            ),
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoriteScreen}
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color }) => (
              <Animated.View entering={FadeInDown.delay(200)}>
                <Icon name="heart-outline" color={color} size={windowHeight * 0.03} />
              </Animated.View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <Animated.View entering={FadeInDown.delay(300)}>
                <Icon name="person-outline" color={color} size={windowHeight * 0.03} />
              </Animated.View>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};
