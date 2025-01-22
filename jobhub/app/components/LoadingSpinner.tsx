import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  useSharedValue,
  withSequence,
  withDelay
} from 'react-native-reanimated';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  type?: 'default' | 'work' | 'search';
}

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

export function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'large',
  color = '#4630EB',
  type = 'default'
}: LoadingSpinnerProps) {
  const rotation = useSharedValue(0);
  const bounce = useSharedValue(1);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1500 }), 
      -1, 
      false
    );

    bounce.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 750 }),
        withDelay(100, withTiming(1, { duration: 750 }))
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: bounce.value }
    ],
  }));

  const renderIcon = () => {
    switch (type) {
      case 'work':
        return (
          <AnimatedIcon 
            name="briefcase" 
            size={size === 'large' ? 40 : 24} 
            color={color}
            style={animatedStyle}
          />
        );
      case 'search':
        return (
          <AnimatedIcon 
            name="magnify" 
            size={size === 'large' ? 40 : 24} 
            color={color}
            style={animatedStyle}
          />
        );
      default:
        return <ActivityIndicator size={size} color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderIcon()}
      {message && <Text style={[styles.message, { color }]}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});
