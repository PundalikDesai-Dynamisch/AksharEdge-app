import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen, RewardOverlay } from '@components';
import { colors } from '@theme';
import type { AppStackParamList } from '@/navigation/types';

export function WritingConfirmationScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const handleDone = () => {
    // Navigate back to the parent home or wherever appropriate
    // For now, let's pop back to the top of the stack, or to the ReadyToPlay screen
    navigation.popToTop();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <RewardOverlay
          visible={true}
          mascotPose="cheering"
          title="All Done!"
          message="You finished the writing activity! Great job."
          ctaLabel="Finish"
          onPress={handleDone}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
