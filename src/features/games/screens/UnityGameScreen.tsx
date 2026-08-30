import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler, Text } from 'react-native';
import UnityView, { UnityMessage } from '@azesmway/react-native-unity';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { AppStackParamList } from '@/navigation/types';

export const UnityGameScreen = () => {
  const unityRef = useRef<UnityView>(null);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AppStackParamList, 'UnityGame'>>();
  
  // Use state to unmount Unity BEFORE navigating back
  const [showUnity, setShowUnity] = useState(true);

  // Handle Unity -> RN messages
  const onUnityMessage = (event: UnityMessage) => {
    const payload = event.nativeEvent.message;
    console.log('Unity message:', payload);
    
    if (payload === 'QUIT_GAME') {
      // 1. Hide and unmount UnityView from React Native cleanly
      setShowUnity(false);
      // 2. Wait for native Android teardown to finish, then pop the screen
      setTimeout(() => {
        navigation.goBack();
      }, 150);
    }
  };

  // Back handling - pause/unload Unity when leaving
  useEffect(() => {
    const onBack = () => {
      setShowUnity(false);
      setTimeout(() => {
        navigation.goBack();
      }, 150);
      return true; // prevent default back
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      {showUnity && (
        <UnityView
          ref={unityRef}
          style={styles.unity}
          onUnityMessage={onUnityMessage}
          fullScreen={false}
          androidKeepPlayerMounted={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  unity: { flex: 1 },
});
