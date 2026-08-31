import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import UnityView from '@azesmway/react-native-unity';
import { useNavigation, useRoute } from '@react-navigation/native';

import type { RouteProp } from '@react-navigation/native';

import type { AppStackParamList } from '@/navigation/types';

import { logger } from '@utils/logger';

/**
 * `@azesmway/react-native-unity` exports only a default — its `index.d.ts` re-exports
 * `UnityView` and nothing else. The event payload type is therefore declared here rather than
 * imported from the package's `specs/` path, which is an internal detail, not public surface.
 */
type UnityMessageEvent = { nativeEvent: { message: string } };

/** Sent by the Unity build's UnityMessageManager when the player quits from inside the game. */
const QUIT_MESSAGE = 'QUIT_GAME';

/**
 * Unity's native teardown has to finish before the screen is popped — popping while UnityView
 * is still mounted leaves a black surface or crashes the native side on Android. Unmounting
 * first and waiting this long before navigating is what makes re-entering the game work.
 * Arrived at empirically; see UNITY_INTEGRATION_SNAPSHOT.md §8.4.
 */
const TEARDOWN_MS = 150;

/** Letterbox fill behind the game viewport — not a themed app surface, so not a theme token. */
const GAME_BACKDROP = '#000000';

export function UnityGameScreen(): React.JSX.Element {
  const unityRef = useRef<UnityView>(null);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AppStackParamList, 'UnityGame'>>();
  const { gameId } = route.params;

  // Unmounting UnityView is a render-driven step, so leaving is two-phase rather than a
  // straight goBack().
  const [showUnity, setShowUnity] = useState(true);

  const leave = useCallback((): void => {
    setShowUnity(false);
    setTimeout(() => {
      navigation.goBack();
    }, TEARDOWN_MS);
  }, [navigation]);

  const onUnityMessage = useCallback(
    (event: UnityMessageEvent): void => {
      const payload = event.nativeEvent.message;
      logger.debug('Unity message received', { gameId, payload });

      if (payload === QUIT_MESSAGE) {
        leave();
      }
    },
    [gameId, leave],
  );

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      leave();
      // Prevents the default pop, which would race the teardown above.
      return true;
    });

    return () => subscription.remove();
  }, [leave]);

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GAME_BACKDROP,
  },
  unity: {
    flex: 1,
  },
});
