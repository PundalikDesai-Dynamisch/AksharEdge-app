import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, useWindowDimensions, View } from 'react-native';

import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { SharedValue } from 'react-native-reanimated';

import { colors, radii } from '@theme';

interface ConfettiProps {
  /** Starts the burst. Flipping it back to false stops and clears the animation. */
  active: boolean;
  particleCount?: number;
  durationMs?: number;
}

/**
 * Hand-rolled celebration confetti — no Lottie, no new dependency.
 *
 * Reanimated 4 and react-native-worklets are already installed and configured, so a burst of
 * transforms costs nothing extra; adding an animation library would mean a native dependency AND
 * an art order for every animation (CLAUDE.md §4).
 *
 * One shared `progress` value drives every particle, rather than one animation each: N particles
 * then cost N `useAnimatedStyle` derivations on the UI thread instead of N timing animations, and
 * cleanup is a single `cancelAnimation`.
 */
const PARTICLE = { width: 8, height: 14 } as const;
const PALETTE = [colors.accent, colors.accent, colors.primary, colors.secondary] as const;

interface Particle {
  readonly startX: number;
  readonly drift: number;
  readonly delay: number;
  readonly spin: number;
  readonly color: string;
}

/**
 * A deterministic hash, not `Math.random()`: the same index always produces the same particle, so
 * a snapshot test of this component is stable across runs.
 */
function seeded(index: number, salt: number): number {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function buildParticles(count: number, width: number): Particle[] {
  return Array.from({ length: count }, (_, index) => ({
    startX: seeded(index, 1) * width,
    drift: (seeded(index, 2) - 0.5) * width * 0.5,
    // Staggered starts turn a single sweep into a scatter.
    delay: seeded(index, 3) * 0.35,
    spin: 360 + seeded(index, 4) * 720,
    // design.md §8.8: accent yellow leads, coral and sky support. PALETTE is weighted for that.
    color: PALETTE[index % PALETTE.length] ?? colors.accent,
  }));
}

function ConfettiPiece({
  particle,
  progress,
  fallDistance,
  animate,
}: {
  particle: Particle;
  progress: SharedValue<number>;
  fallDistance: number;
  animate: boolean;
}): React.JSX.Element {
  const style = useAnimatedStyle(() => {
    // Each particle consumes the shared 0→1 sweep on its own delayed sub-range.
    const local = Math.min(Math.max((progress.value - particle.delay) / (1 - particle.delay), 0), 1);

    return {
      transform: [
        { translateY: local * fallDistance },
        { translateX: local * particle.drift },
        { rotate: `${local * particle.spin}deg` },
      ],
      // Fades only over the last third, so the burst reads as falling rather than dissolving.
      opacity: local > 0.66 ? 1 - (local - 0.66) / 0.34 : 1,
    };
  });

  // Reduce motion: a static scatter, no animated style attached at all.
  if (!animate) {
    return (
      <View
        style={[
          styles.piece,
          {
            left: particle.startX,
            backgroundColor: particle.color,
            transform: [{ translateY: fallDistance * 0.45 }, { rotate: '25deg' }],
          },
        ]}
      />
    );
  }

  return (
    <Animated.View
      style={[styles.piece, { left: particle.startX, backgroundColor: particle.color }, style]}
    />
  );
}

export function Confetti({
  active,
  particleCount = 36,
  durationMs = 2200,
}: ConfettiProps): React.JSX.Element {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  /**
   * A parent who has turned on reduce-motion has a reason, and this is a children's app — so the
   * reward still appears, it simply does not fly.
   */
  useEffect(() => {
    let cancelled = false;

    AccessibilityInfo.isReduceMotionEnabled()
      .then(enabled => {
        if (!cancelled) {
          setReduceMotion(enabled);
        }
      })
      .catch(() => {
        // A platform that cannot answer is treated as motion-allowed, matching its default.
      });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!active || reduceMotion) {
      progress.value = 0;
      return undefined;
    }

    progress.value = 0;
    progress.value = withTiming(1, { duration: durationMs, easing: Easing.out(Easing.quad) });

    // A leaked animation on a screen the user has left is a battery bug that only shows up in
    // the wild, so the animation is cancelled on unmount as well as when `active` goes false.
    return () => {
      cancelAnimation(progress);
    };
  }, [active, reduceMotion, durationMs, progress]);

  if (!active) {
    return <View style={styles.container} pointerEvents="none" />;
  }

  const particles = buildParticles(particleCount, width);

  return (
    // Never intercepts a tap — the CTA underneath must stay pressable while confetti falls.
    <View style={styles.container} pointerEvents="none" accessibilityElementsHidden>
      {particles.map((particle, index) => (
        <ConfettiPiece
          key={index}
          particle={particle}
          progress={progress}
          fallDistance={height}
          animate={!reduceMotion}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
    top: -PARTICLE.height,
    width: PARTICLE.width,
    height: PARTICLE.height,
    borderRadius: radii.sm / 3,
  },
});
