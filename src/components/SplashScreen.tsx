import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, G } from 'react-native-svg';

interface SplashScreenProps {
  onAnimationFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationFinish }) => {
  const opacity = useSharedValue(1);
  const backgroundOpacity = useSharedValue(0);
  const heartScale = useSharedValue(0);
  const heartTranslateX = useSharedValue(0);
  const heartTranslateY = useSharedValue(0);
  const heartOpacity = useSharedValue(0);
  const silhouetteOpacity = useSharedValue(0);

  // Handle animation completion
  const handleAnimationComplete = () => {
    opacity.value = withTiming(0, {
      duration: 800,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }, (finished) => {
      if (finished) {
        runOnJS(onAnimationFinish)();
      }
    });
  };

  useEffect(() => {
    // Initial animations
    backgroundOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    // Silhouette animation (fade in)
    silhouetteOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });

    // Heart animation
    heartOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    heartScale.value = withDelay(800, withSpring(1.5, { // Increased scale
      damping: 12,
      stiffness: 100,
    }));
    heartTranslateX.value = withDelay(800, withTiming(20, { duration: 800, easing: Easing.out(Easing.cubic) })); // Moved more to the left
    heartTranslateY.value = withDelay(800, withTiming(50, { duration: 800, easing: Easing.out(Easing.cubic) })); // Moved slightly below center

    // Complete splash screen
    const timeout = setTimeout(handleAnimationComplete, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const gradientStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  // Apply animated styles directly to Svg components
  const heartTransformStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: heartScale.value },
      { translateX: heartTranslateX.value },
      { translateY: heartTranslateY.value },
    ],
  }));

  const silhouetteStyle = useAnimatedStyle(() => ({
    opacity: silhouetteOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.fullSize, gradientStyle]}>
        <LinearGradient
          colors={['#F02A6B', '#F02A6B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fullSize}
        />
      </Animated.View>

      <View style={styles.contentContainer}>
        <Animated.View style={[styles.logoContainer]}>
          <Svg height={splashSize} width={splashSize} viewBox="0 0 100 100">
            {/* Woman's Silhouette PNG */}


            {/* Heart SVG */}
            <G style={heartTransformStyle}>
              <Path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="#EB487EFF"
              />
            </G>
          </Svg>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const { width, height } = Dimensions.get('window');
const splashSize = Math.min(width, height) * 0.6;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F02A6B', // Updated background color
  },
  fullSize: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: splashSize,
    height: splashSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
