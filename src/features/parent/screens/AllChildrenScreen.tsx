import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { Avatar, Button, ConfirmDialog, Icon, Screen, StatusPill } from '@components';
import { softDeleteChildThunk } from '@features/parent/parent.thunks';
import { colors, spacing, typography, radii, shadows, IconName } from '@theme';
import type { Child } from '@/domain/entities/Child';
import type { ParentScreenProps } from '@/navigation/types';

export default function AllChildrenScreen(): React.JSX.Element {
  const navigation = useNavigation<ParentScreenProps<'AllChildren'>['navigation']>();
  const dispatch = useAppDispatch();
  const children = useAppSelector(state => state.children.data);
  
  const [deleteCandidate, setDeleteCandidate] = useState<Child | null>(null);
  
  const handleEdit = (childId: string) => {
    navigation.navigate('WizardPlaceholder', { childId });
  };

  const handleRequestDelete = (child: Child) => {
    setDeleteCandidate(child);
  };

  const handleCancelDelete = () => {
    setDeleteCandidate(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteCandidate) {
      await dispatch(softDeleteChildThunk(deleteCandidate.childId));
      setDeleteCandidate(null);
    }
  };

  const handleAddChild = () => {
    navigation.navigate('WizardPlaceholder', {});
  };

  const renderChildCard = ({ item }: { item: Child }) => {
    return (
      <View style={styles.card}>
        <Avatar avatarId={item.avatarId} size={48} />
        <View style={styles.cardContent}>
          <Text style={styles.cardName}>{item.name}</Text>
          <StatusPill status={item.status} />
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(item.childId)}
            accessibilityLabel={`Edit ${item.name}`}
          >
            <Icon name={IconName.edit} size={20} color="primary" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleRequestDelete(item)}
            accessibilityLabel={`Delete ${item.name}`}
          >
            <Icon name={IconName.trash} size={20} color="danger" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <FlatList
          data={children}
          keyExtractor={(item) => item.childId}
          renderItem={renderChildCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name={IconName.users} size={64} color="border" />
              <Text style={styles.emptyText}>You haven't added any child profiles yet.</Text>
            </View>
          }
        />
        
        <View style={styles.fabContainer}>
          <Button
            label="Add Child"
            onPress={handleAddChild}
            icon={IconName.plus}
            style={styles.fab}
          />
        </View>

        <ConfirmDialog
          visible={deleteCandidate !== null}
          title="Hide Profile?"
          message={`Hide ${deleteCandidate?.name}'s profile? This will remove them from your active view.`}
          confirmLabel="Hide"
          cancelLabel="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          destructive
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
  listContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl * 3, // space for FAB
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardContent: {
    flex: 1,
    marginLeft: spacing.md,
    gap: spacing.xs,
  },
  cardName: {
    ...typography.button,
    color: colors.text,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.sm,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    left: spacing.xl,
    alignItems: 'center',
  },
  fab: {
    ...shadows.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
