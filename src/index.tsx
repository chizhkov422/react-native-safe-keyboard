import React, { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface IProps {
  duration?: number;
  children: React.ReactElement;
}

const isIos = Platform.OS === 'ios';

const App: React.FC<IProps> = ({ duration, children }) => {
  const animation = useSharedValue(0);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  const eventShowName = isIos ? 'keyboardWillShow' : 'keyboardDidShow';
  const eventHideName = isIos ? 'keyboardWillHide' : 'keyboardDidHide';

  const keyboardShow = (event: KeyboardEvent) => {
    setKeyboardHeight(event.endCoordinates.height);

    animation.value = withTiming(1, {
      duration: duration || (event && event.duration) || 200,
      easing: Easing.linear,
    });
  };

  const keyboardHide = (event: KeyboardEvent) => {
    animation.value = withTiming(0, {
      duration: duration || (event && event.duration) || 200,
      easing: Easing.ease,
    });
  };

  // -------------------------- Side effects ------------------------- //
  useEffect(() => {
    const showSubscription = Keyboard.addListener(eventShowName, keyboardShow);
    const hideSubscription = Keyboard.addListener(eventHideName, keyboardHide);

    return function cleanup() {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const keyboardAnimatedStyles = useAnimatedStyle(() => {
    return {
      paddingBottom: interpolate(animation.value, [0, 1], [0, keyboardHeight]),
    };
  });

  return (
    <Animated.View style={[{ flex: 1 }, keyboardAnimatedStyles]}>
      {children}
    </Animated.View>
  );
};

export default App;
