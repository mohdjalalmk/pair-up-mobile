import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

interface SwipeCardProps<T> {
  data: T[];
  onSwipeLeft: (item: T) => void;
  onSwipeRight: (item: T) => void;
  onSwipeTop: (item: T) => void;
  renderCard: (item: T) => React.ReactNode;
  renderEmptyCardView?: () => React.ReactNode;
}

export const SwipeCard = <T extends object>({
  data,
  onSwipeLeft,
  onSwipeRight,
  onSwipeTop,
  renderCard,
  renderEmptyCardView,
}: SwipeCardProps<T>) => {
  const [position] = useState(new Animated.ValueXY());
  const [index, setIndex] = useState(0);
  const nextCardIndex = useRef(1);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (
        event: GestureResponderEvent,
        gesture: PanResponderGestureState,
      ) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (
        event: GestureResponderEvent,
        gesture: PanResponderGestureState,
      ) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else if (gesture.dy < -SWIPE_THRESHOLD) {
          forceSwipe('top');
        } else {
          resetPosition();
        }
      },
    }),
  ).current;

  const forceSwipe = (direction: 'right' | 'left' | 'top') => {
    let x = 0,
      y = 0;

    switch (direction) {
      case 'right':
        x = SCREEN_WIDTH;
        break;
      case 'left':
        x = -SCREEN_WIDTH;
        break;
      case 'top':
        y = -SCREEN_HEIGHT;
        break;
    }

    Animated.timing(position, {
      toValue: { x, y },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.25],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const likeScale = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.25],
    outputRange: [0.8, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.25, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const nopeScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.25, 0],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const onSwipeComplete = (direction: 'right' | 'left' | 'top') => {
    const item = data[index];
    switch (direction) {
      case 'right':
        onSwipeRight(item);
        break;
      case 'left':
        onSwipeLeft(item);
        break;
      case 'top':
        onSwipeTop(item);
        break;
    }
    position.setValue({ x: 0, y: 0 });
    setIndex(nextCardIndex.current++);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const renderCards = () => {
    if (!data?.length || index >= data?.length) {
      return renderEmptyCardView ? (
        renderEmptyCardView()
      ) : (
        <View style={styles.emptyCardContainer}>
          <Text>No more cards</Text>
        </View>
      );
    }

    const currentCard = (
      <Animated.View
        key={`card-${index}`}
        {...panResponder.panHandlers}
        style={[getCardStyle(), styles.card, { zIndex: 2 }]}
      >
        <>
          {/* Like Label */}
          <Animated.View
            style={[
              styles.likeLabel,
              { opacity: likeOpacity, transform: [{ scale: likeScale }] },
            ]}
          >
            <Text style={styles.likeText}>LIKE ❤️</Text>
          </Animated.View>

          {/* Nope Label */}
          <Animated.View
            style={[
              styles.nopeLabel,
              { opacity: nopeOpacity, transform: [{ scale: nopeScale }] },
            ]}
          >
            <Text style={styles.nopeText}>NOPE ❌</Text>
          </Animated.View>

          {renderCard(data[index])}
        </>
      </Animated.View>
    );

    const upcomingCard =
      index + 1 < data?.length ? (
        <View
          key={`card-${index + 1}`}
          style={[styles.card, { top: 20, zIndex: 1 }]}
        >
          {renderCard(data[index + 1])}
        </View>
      ) : null;

    return [upcomingCard, currentCard];
  };

  return <View>{renderCards()}</View>;
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  emptyCardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  likeLabel: {
    position: 'absolute',
    top: 40,
    left: 20, // <<< Fixed: stick to left for right swipe
    backgroundColor: 'rgba(0,255,0,0.15)',
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginLeft: 10,
    zIndex: 10,
  },
  likeText: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
  },

  nopeLabel: {
    position: 'absolute',
    top: 40,
    right: 20, // <<< Fixed: stick to right for left swipe
    backgroundColor: 'rgba(255,0,0,0.15)',
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
    zIndex: 10,
  },
  nopeText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
