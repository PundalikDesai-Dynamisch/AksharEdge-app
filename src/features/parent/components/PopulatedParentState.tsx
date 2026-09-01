import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@store/hooks';
import { BottomTabBar, Avatar, StatusPill } from '@components';
import { strings } from '@/constants/strings';
import { colors, spacing, typography, radii, shadows } from '@theme';
import type { Child } from '@/domain/entities/Child';
import type { ParentScreenProps } from '@/navigation/types';
import { IconName } from '@theme';

interface PopulatedParentStateProps {
  childrenData: Child[];
}

export function PopulatedParentState({ childrenData }: PopulatedParentStateProps): React.JSX.Element {
  const navigation = useNavigation<ParentScreenProps<'ParentHome'>['navigation']>();
  const parent = useAppSelector(state => state.auth.parent);

  const handleChildPress = () => {
    // In future phase, route to child's dashboard
  };

  const handleTabSelect = (key: string) => {
    switch (key) {
      case 'add':
        navigation.navigate('WizardPlaceholder', {});
        break;
      case 'all':
        navigation.navigate('AllChildren');
        break;
      case 'parent':
        navigation.navigate('ParentDetails');
        break;
      case 'support':
        navigation.navigate('Support', { origin: 'ParentHome' });
        break;
    }
  };

  const renderChildCard = ({ item }: { item: Child }) => {
    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => handleChildPress()}
        activeOpacity={0.7}
      >
        <Avatar avatarId={item.avatarId} size={48} />
        <View style={styles.cardContent}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardAge}>{item.ageYears} years old</Text>
        </View>
        <StatusPill status={item.status} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={childrenData}
        keyExtractor={(item) => item.childId}
        renderItem={renderChildCard}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.greeting}>
              {strings.app.welcomeSubtitle} {parent?.fullName || ''}!
            </Text>
          </View>
        }
      />
      <BottomTabBar
        activeKey="" // No "Home" tab to be active
        variant="parent"
        onSelect={handleTabSelect}
        items={[
          { key: 'add', label: 'Add', icon: IconName.plus },
          { key: 'all', label: 'All Children', icon: IconName.users },
          { key: 'parent', label: 'Parent', icon: IconName.user },
          { key: 'support', label: 'Support', icon: IconName.helpCircle },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.title,
    color: colors.primaryDeep,
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
  },
  cardName: {
    ...typography.button,
    color: colors.text,
  },
  cardAge: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
