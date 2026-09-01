import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DEFAULT_AVATAR_ID, MASCOTS } from '@assets/registry';
import {
  AppHeader,
  Avatar,
  AvatarPicker,
  BottomTabBar,
  Button,
  Card,
  Chip,
  Confetti,
  ConfirmDialog,
  Dialog,
  EmptyState,
  ErrorState,
  Icon,
  Loader,
  Mascot,
  MissionHeader,
  OfflineBanner,
  PermissionDeniedState,
  PermissionGate,
  RewardBadge,
  RewardOverlay,
  Screen,
  SearchBar,
  StatusPill,
  SteppingStones,
  TextField,
  Toast,
  WizardHeader,
} from '@components';
import { strings } from '@/constants/strings';
import { colors, IconName, radii, spacing, typography } from '@theme';

import type { Step, TabItem } from '@components';
import type { AvatarId, ChildStatus } from '@/types/models';
import type { MascotPose } from '@assets/registry';

/**
 * The dev-only component gallery — Phase 1's exit gate.
 *
 * Every component, in every state, on one scroll. Its value is entirely in what it makes
 * *checkable* rather than assertable: a disabled control sitting beside its enabled twin is the
 * only reliable way to notice they are indistinguishable in greyscale (design.md §18).
 *
 * ⚠️ Never shipped. `AppNavigator` registers this route behind `__DEV__`, and so does the entry
 * point that reaches it.
 *
 * Literal props only — no store, no navigation, no Firestore. The eslint presentation boundary
 * enforces the last of those; the first two are what keep the gallery honest as a *component*
 * harness rather than a second implementation of a screen.
 */

const noop = (): void => {};

const ROADMAP: Step[] = [
  { key: 'games', label: 'Play' },
  { key: 'writing', label: 'Writing' },
  { key: 'celebrate', label: 'Celebrate' },
];

const WIZARD: Step[] = [
  { key: 'identity', label: 'Child' },
  { key: 'details', label: 'Details' },
  { key: 'location', label: 'Location' },
  { key: 'camera', label: 'Camera' },
  { key: 'confirm', label: 'Confirm' },
];

const PARENT_TABS: TabItem[] = [
  { key: 'add', label: 'Add', icon: IconName.plus },
  { key: 'children', label: 'All Children', icon: IconName.users },
  { key: 'parent', label: 'Parent', icon: IconName.user },
  { key: 'support', label: 'Support', icon: IconName.helpCircle },
];

/** Ready to Play state A: Report is locked until the assessment is scored (spec §18). */
const CHILD_TABS_A: TabItem[] = [
  { key: 'play', label: 'Play', icon: IconName.gamepad },
  { key: 'report', label: 'Report', icon: IconName.barChart, disabled: true },
  { key: 'parent', label: 'Parent', icon: IconName.user },
  { key: 'support', label: 'Support', icon: IconName.helpCircle },
];

/** State B: the mirror image — Play locks, Report unlocks and carries the new dot (spec §27). */
const CHILD_TABS_B: TabItem[] = [
  { key: 'play', label: 'Play', icon: IconName.gamepad, disabled: true },
  { key: 'report', label: 'Report', icon: IconName.barChart, badge: true },
  { key: 'parent', label: 'Parent', icon: IconName.user },
  { key: 'support', label: 'Support', icon: IconName.helpCircle },
];

const STATUSES: ChildStatus[] = ['not_started', 'in_progress', 'report_ready'];
const POSES = Object.keys(MASCOTS) as MascotPose[];

function Section({ title, children }: { title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Label({ children }: { children: string }): React.JSX.Element {
  return <Text style={styles.label}>{children}</Text>;
}

/**
 * A fixed-height, relatively-positioned box.
 *
 * Eleven components cannot sit directly in a ScrollView: `PermissionGate`, `EmptyState`,
 * `ErrorState` and `Screen` are `flex: 1` and collapse to nothing, while `Confetti` and `Toast`
 * are absolutely positioned and need a containing block. This gives all of them one.
 */
function Stage({ height, children }: { height: number; children: React.ReactNode }): React.JSX.Element {
  return <View style={[styles.stage, { height }]}>{children}</View>;
}

export default function GalleryScreen(): React.JSX.Element {
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [avatarId, setAvatarId] = useState<AvatarId>(DEFAULT_AVATAR_ID);
  const [tab, setTab] = useState('play');
  const [dialog, setDialog] = useState<'none' | 'dialog' | 'confirm' | 'reward'>('none');
  const [confettiKey, setConfettiKey] = useState(0);

  const closeDialog = useCallback(() => setDialog('none'), []);
  const replayConfetti = useCallback(() => setConfettiKey(key => key + 1), []);

  return (
    <Screen scroll>
      <AppHeader
        title="Component gallery"
        subtitle="Every component, every state"
        action={{ icon: IconName.refresh, accessibilityLabel: 'Replay motion', onPress: replayConfetti }}
      />

      <Section title="Button — 4 variants">
        <Button label="Primary" onPress={noop} />
        <Button label="Secondary" onPress={noop} variant="secondary" />
        <Button label="Ghost" onPress={noop} variant="ghost" />
        <Button label="Destructive" onPress={noop} variant="destructive" />
        <Label>States — compare disabled against enabled in greyscale</Label>
        <Button label="Loading" onPress={noop} loading />
        <Button label="Disabled" onPress={noop} disabled />
        <Button label="Disabled destructive" onPress={noop} variant="destructive" disabled />
        <Button label="With icon" onPress={noop} icon={IconName.plus} />
        <Label>Sizes — lg is 56pt (design.md §2), md is 48pt</Label>
        <Button label="Large (default)" onPress={noop} size="lg" />
        <Button label="Medium" onPress={noop} size="md" variant="ghost" />
      </Section>

      <Section title="TextField">
        <TextField label="Default" value={text} onChangeText={setText} placeholder="Tap to focus" />
        <TextField label="Filled" value="Priya Sharma" onChangeText={noop} />
        <TextField label="Error" value="not-an-email" onChangeText={noop} error="Enter a valid email address." />
        <TextField label="Helper text" value="" onChangeText={noop} helperText="We never share this." />
        <TextField label="Disabled" value="Locked" onChangeText={noop} editable={false} />
        <TextField label="Password" value="secret" onChangeText={noop} secure />
        <TextField label="Multiline" value={text} onChangeText={setText} multiline />
      </Section>

      <Section title="SearchBar">
        <SearchBar value={search} onChangeText={setSearch} onClear={() => setSearch('')} />
      </Section>

      <Section title="Card — tones">
        <Card><Text style={styles.body}>Plain — soft shadow, ~20px radius, no border</Text></Card>
        <Card tone="sky"><Text style={styles.body}>Sky — design.md §17 guidance</Text></Card>
        <Card tone="accent"><Text style={styles.body}>Accent — rewards only</Text></Card>
        <Card onPress={noop} accessibilityLabel="Pressable card">
          <Text style={styles.body}>Pressable — hold to see the shadow deepen</Text>
        </Card>
      </Section>

      <Section title="Chip and StatusPill">
        <View style={styles.row}>
          <Chip label="Neutral" />
          <Chip label="Info" tone="info" />
          <Chip label="Success" tone="success" />
          <Chip label="Warning" tone="warning" />
          <Chip label="Danger" tone="danger" />
          <Chip label="Selected" selected onPress={noop} />
          <Chip label="With icon" tone="info" icon={IconName.clock} />
        </View>
        <Label>StatusPill — glyph as well as tone, never colour alone</Label>
        <View style={styles.row}>
          {STATUSES.map(status => <StatusPill key={status} status={status} />)}
        </View>
      </Section>

      <Section title="Avatar">
        <View style={styles.row}>
          <Avatar avatarId="avatar-01" size="sm" name="Small" />
          <Avatar avatarId="avatar-02" size="md" name="Medium" />
          <Avatar avatarId="avatar-03" size="lg" name="Large" />
          <Avatar avatarId="avatar-04" size="md" name="Selected" selected />
        </View>
        <Label>AvatarPicker — all 12, radiogroup semantics</Label>
        <AvatarPicker value={avatarId} onChange={setAvatarId} />
      </Section>

      <Section title="Mascot — 7 poses">
        <View style={styles.row}>
          {POSES.map(pose => <Mascot key={pose} pose={pose} size={72} />)}
        </View>
      </Section>

      <Section title="RewardBadge">
        <View style={styles.row}>
          <RewardBadge type="star" size={72} />
          <RewardBadge type="trophy" size={72} />
          <RewardBadge type="ribbon" size={72} />
        </View>
      </Section>

      <Section title="SteppingStones — 3 and 5">
        <SteppingStones steps={ROADMAP} currentIndex={1} completedKeys={['games']} />
        <SteppingStones steps={WIZARD} currentIndex={2} completedKeys={['identity', 'details']} />
      </Section>

      <Section title="WizardHeader">
        <Label>Step 1 — no back control at all, never a disabled one (§8.10)</Label>
        <WizardHeader steps={WIZARD} currentIndex={0} completedKeys={[]} title="Who is playing?" />
        <Label>Step 3 — back control present</Label>
        <WizardHeader
          steps={WIZARD}
          currentIndex={2}
          completedKeys={['identity', 'details']}
          title="Where are you?"
          onBack={noop}
        />
      </Section>

      <Section title="MissionHeader — no timer, no score (design.md §14)">
        <MissionHeader steps={ROADMAP} currentIndex={0} completedKeys={[]} onExit={noop} />
      </Section>

      <Section title="BottomTabBar — parent vs child">
        <Label>Parent — muted and adult</Label>
        <BottomTabBar variant="parent" items={PARENT_TABS} activeKey="children" onSelect={noop} />
        <Label>Child, state A — Report locked, padlock not just a dim</Label>
        <BottomTabBar variant="child" items={CHILD_TABS_A} activeKey={tab} onSelect={setTab} />
        <Label>Child, state B — Play locked, Report carries the new dot</Label>
        <BottomTabBar variant="child" items={CHILD_TABS_B} activeKey="report" onSelect={setTab} />
      </Section>

      <Section title="PermissionGate — one component, two permissions">
        <Stage height={380}>
          <PermissionGate
            mascotPose="mapPin"
            status="denied"
            title={strings.permissions.location.title}
            explanation={strings.permissions.location.explanation}
            ctaLabel={strings.permissions.location.cta}
            onRequest={noop}
          />
        </Stage>
        <Stage height={380}>
          <PermissionGate
            mascotPose="camera"
            status="requesting"
            title={strings.permissions.camera.title}
            explanation={strings.permissions.camera.explanation}
            ctaLabel={strings.permissions.camera.cta}
            onRequest={noop}
          />
        </Stage>
      </Section>

      <Section title="PermissionDeniedState — denied · blocked · unavailable">
        <Stage height={360}>
          <PermissionDeniedState
            mascotPose="mapPin"
            status="denied"
            title={strings.permissions.location.deniedTitle}
            explanation={strings.permissions.location.deniedExplanation}
            onRetry={noop}
            onOpenSettings={noop}
          />
        </Stage>
        <Stage height={360}>
          <PermissionDeniedState
            mascotPose="camera"
            status="blocked"
            title={strings.permissions.camera.deniedTitle}
            explanation={strings.permissions.camera.blockedExplanation}
            onRetry={noop}
            onOpenSettings={noop}
          />
        </Stage>
        <Stage height={340}>
          <PermissionDeniedState
            mascotPose="thinking"
            status="unavailable"
            title={strings.permissions.camera.deniedTitle}
            explanation={strings.permissions.camera.unavailableExplanation}
            onRetry={noop}
            onOpenSettings={noop}
          />
        </Stage>
      </Section>

      <Section title="EmptyState and ErrorState">
        <Stage height={320}>
          <EmptyState
            icon={IconName.users}
            title="No children yet"
            description="Add a profile to start a screening."
            actionLabel="Add Child Profile"
            onAction={noop}
          />
        </Stage>
        <Stage height={320}>
          <ErrorState description="We couldn't load this report. Check your connection." onRetry={noop} />
        </Stage>
      </Section>

      <Section title="Loader and OfflineBanner">
        <Loader label="Loading…" />
        <Loader size="small" />
        <OfflineBanner visible />
        <OfflineBanner visible pendingCount={3} />
      </Section>

      <Section title="Toast — 4 kinds">
        <Stage height={90}><Toast kind="success" message="Profile saved." /></Stage>
        <Stage height={90}><Toast kind="info" message="Syncing in the background." /></Stage>
        <Stage height={90}><Toast kind="warning" message="Your connection looks slow." /></Stage>
        <Stage height={90}><Toast kind="error" message="Upload failed." actionLabel="Retry" onAction={noop} /></Stage>
      </Section>

      <Section title="Confetti — tap the header refresh to replay">
        <Stage height={260}>
          <Confetti key={confettiKey} active particleCount={40} />
        </Stage>
      </Section>

      <Section title="Screen — playful variant">
        <Stage height={220}>
          <Screen variant="playful">
            <Text style={styles.body}>Organic accent shapes behind the content (design.md §5)</Text>
          </Screen>
        </Stage>
      </Section>

      <Section title="Modals — triggered, because a Modal cannot render inline">
        <Button label="Open Dialog" onPress={() => setDialog('dialog')} variant="ghost" />
        <Button label="Open ConfirmDialog (destructive)" onPress={() => setDialog('confirm')} variant="ghost" />
        <Button label="Open RewardOverlay" onPress={() => setDialog('reward')} variant="ghost" />
      </Section>

      <Section title="Icon vocabulary">
        <View style={styles.row}>
          {Object.values(IconName).map(glyph => (
            <View key={glyph} style={styles.iconCell}>
              <Icon name={glyph} size={20} />
            </View>
          ))}
        </View>
      </Section>

      <Dialog
        visible={dialog === 'dialog'}
        title="Single action"
        message="A Dialog with no secondary action and no dismiss is what a blocking decision needs."
        illustration={<Mascot pose="thinking" size="sm" />}
        primary={{ label: 'Got it', onPress: closeDialog }}
      />

      <ConfirmDialog
        visible={dialog === 'confirm'}
        destructive
        title="Remove Aarav's profile?"
        message="This will also delete their assessment history."
        confirmLabel="Delete"
        onConfirm={closeDialog}
        onCancel={closeDialog}
      />

      <RewardOverlay
        visible={dialog === 'reward'}
        mascotPose="cheering"
        title="You did it!"
        message="Great job! We've got Aarav's assessment submission."
        ctaLabel="Done"
        badge="trophy"
        onPress={closeDialog}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.primaryDeep,
    marginBottom: spacing.md,
  },
  sectionBody: {
    gap: spacing.md,
  },
  label: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  body: {
    ...typography.body,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stage: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  iconCell: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
  },
});
