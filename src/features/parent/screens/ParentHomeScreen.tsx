import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { startChildrenSubscription } from '@features/parent/children.slice';
import { Loader, ErrorState, Screen } from '@components';

import { EmptyParentState } from '@features/parent/components/EmptyParentState';
import { PopulatedParentState } from '@features/parent/components/PopulatedParentState';
import { colors } from '@theme';

/**
 * Phase 2: The center piece of the Parent flow.
 * Uses a single live subscription to Firestore to seamlessly scale between
 * the Empty State carousel and the Populated child list.
 */
export default function ParentHomeScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const parentId = useAppSelector(state => state.auth.parent?.parentId);
  const { data: children, loading, error } = useAppSelector(state => state.children);

  useEffect(() => {
    if (parentId) {
      dispatch(startChildrenSubscription(parentId));
    }
  }, [dispatch, parentId]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <Loader size="large" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <ErrorState 
            description="We couldn't load your child profiles."
            onRetry={() => {
              if (parentId) {
                dispatch(startChildrenSubscription(parentId));
              }
            }} 
          />
        </View>
      );
    }

    if (children.length === 0) {
      return <EmptyParentState />;
    }

    return <PopulatedParentState childrenData={children} />;
  };

  return (
    <Screen>
      {renderContent()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

