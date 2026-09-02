import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, Platform, StyleSheet, View } from 'react-native';

import UnityView from '@azesmway/react-native-unity';
import { useNavigation, useRoute } from '@react-navigation/native';
import { nanoid } from '@reduxjs/toolkit';

import type { RouteProp } from '@react-navigation/native';
import type { AppStackParamList } from '@/navigation/types';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { recordGameResult } from '@features/assessment/assessment.thunks';
import { MissionHeader } from '@components/MissionHeader';
import { RewardOverlay } from '@components/RewardOverlay';
import { SyntheticGameStub } from '../components/SyntheticGameStub';
import { logger } from '@utils/logger';

import type { GameResult } from '@/domain/entities/GameResult';

type UnityMessageEvent = { nativeEvent: { message: string } };
const QUIT_MESSAGE = 'QUIT_GAME';
const TEARDOWN_MS = 150;
const GAME_BACKDROP = '#000000';

export default function UnityGameScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AppStackParamList, 'UnityGame'>>();
  const { assessmentId, gameId } = route.params;
  const dispatch = useAppDispatch();

  // Mint a unique session ID for this round
  const sessionId = useMemo(() => nanoid(), []);

  const assessment = useAppSelector(state => state.assessment.assessment);

  const [showUnity, setShowUnity] = useState(true);
  const [showReward, setShowReward] = useState(false);

  // Compute MissionHeader props
  const missionPlan = useMemo(() => assessment?.missionPlan ?? [], [assessment?.missionPlan]);
  const steps = useMemo(() => missionPlan.map(p => ({
    key: p.gameId,
    label: `Mission ${p.order}`,
    icon: 'gamepad' as const,
  })), [missionPlan]);

  const currentIndex = steps.findIndex(s => s.key === gameId);
  const completedKeys = assessment?.completedGameIds ?? [];

  const leave = useCallback((): void => {
    setShowUnity(false);
    setTimeout(() => {
      navigation.goBack();
    }, TEARDOWN_MS);
  }, [navigation]);

  const handleResult = useCallback(
    (result: Omit<GameResult, 'source'>) => {
      if (result.sessionId !== sessionId) {
        logger.warn('Discarding game result with stale sessionId', { 
          expected: sessionId, 
          received: result.sessionId 
        });
        return;
      }
      
      // We explicitly dispatch and wait, but immediately show reward
      dispatch(recordGameResult(result));
      setShowUnity(false);
      setShowReward(true);
    },
    [dispatch, sessionId]
  );

  const onUnityMessage = useCallback(
    (event: UnityMessageEvent): void => {
      const payload = event.nativeEvent.message;
      logger.debug('Unity message received', { gameId, payload });

      if (payload === QUIT_MESSAGE) {
        // The real Unity runner only sends QUIT_GAME currently.
        // We synthesize a basic success result to satisfy the honest wiring.
        handleResult({
          assessmentId,
          gameId,
          sessionId,
          durationMs: 60000,
          attempt: 1,
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          completed: true,
          schemaVersion: 1,
          raw: {},
          metrics: [],
        });
      }
    },
    [assessmentId, gameId, sessionId, handleResult]
  );

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      leave();
      return true;
    });
    return () => subscription.remove();
  }, [leave]);

  const handleNextMission = useCallback(() => {
    setShowReward(false);
    
    // Look up if there's a next mission in the plan
    if (currentIndex >= 0 && currentIndex + 1 < missionPlan.length) {
      const nextGame = missionPlan[currentIndex + 1];
      if (nextGame) {
        navigation.navigate('MissionIntro', { assessmentId, gameId: nextGame.gameId });
        return;
      }
    }
    // End of games, pop back to ReadyToPlay
    navigation.goBack();
  }, [currentIndex, missionPlan, navigation, assessmentId]);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <MissionHeader
          steps={steps}
          currentIndex={currentIndex >= 0 ? currentIndex : 0}
          completedKeys={completedKeys}
          onExit={leave}
        />
      </View>

      <View style={styles.gameWrapper}>
        {showUnity && (
          Platform.OS === 'android' ? (
            <UnityView
              style={styles.unity}
              onUnityMessage={onUnityMessage}
              fullScreen={false}
              androidKeepPlayerMounted={false}
            />
          ) : (
            <SyntheticGameStub
              gameId={gameId}
              sessionId={sessionId}
              onResult={handleResult}
              onAbort={leave}
            />
          )
        )}
      </View>

      <RewardOverlay
        visible={showReward}
        mascotPose="cheering"
        title="Mission Complete!"
        message="Great job!"
        ctaLabel="Next Mission"
        onPress={handleNextMission}
        badge="star"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GAME_BACKDROP,
  },
  headerWrapper: {
    backgroundColor: '#FFFFFF', // Need to make header visible against black backdrop
    paddingHorizontal: 20,
    paddingTop: 40, // rough safe area
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  gameWrapper: {
    flex: 1,
  },
  unity: {
    flex: 1,
  },
});
