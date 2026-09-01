import React from 'react';

import renderer, { act } from 'react-test-renderer';
import { SafeAreaFrameContext, SafeAreaInsetsContext } from 'react-native-safe-area-context';

import type { EdgeInsets, Rect } from 'react-native-safe-area-context';

/**
 * Fixed insets rather than the device's own: `Screen`, `Toast` and `BottomTabBar` all read
 * `useSafeAreaInsets()`, so without this a snapshot recorded on a notched phone would not match
 * one recorded anywhere else.
 */
const INSETS: EdgeInsets = { top: 47, left: 0, right: 0, bottom: 34 };
const FRAME: Rect = { x: 0, y: 0, width: 390, height: 844 };

const mounted: renderer.ReactTestRenderer[] = [];

function withProviders(ui: React.ReactElement): React.ReactElement {
  // The raw contexts rather than `SafeAreaProvider`: the provider renders a host View of its own,
  // which would make `toJSON()` return the wrapper instead of the component under test and put a
  // meaningless extra node at the top of every snapshot.
  return (
    <SafeAreaFrameContext.Provider value={FRAME}>
      <SafeAreaInsetsContext.Provider value={INSETS}>{ui}</SafeAreaInsetsContext.Provider>
    </SafeAreaFrameContext.Provider>
  );
}

/**
 * Renders a component with the context every screen has in the real app.
 *
 * ⚠️ The `act` wrapper is not optional. React 19's `react-test-renderer` returns `null` from
 * `toJSON()` when a render happens outside `act`, so an unwrapped test asserts on nothing and
 * still passes a loose assertion.
 *
 * This module lives outside `__tests__/` deliberately: Jest's default `testMatch` collects
 * everything under that directory, so a helper placed there fails the run with "your test suite
 * must contain at least one test".
 *
 * ℹ️ `@testing-library/react-native` would be the more capable choice and Phase 1's plan called
 * for it. It does not work on this stack: v14 requires the separate `test-renderer` package, and
 * on React 19.2 / RN 0.86 its `render()` returns an object with no own properties while
 * `screen.toJSON()` throws "`render` function has not been called" — with and without our custom
 * Jest resolver. Behaviour is asserted through `root.findAllByType` instead; revisit RTL when it
 * supports this pairing, rather than downgrading React to suit the tooling.
 */
export function renderComponent(ui: React.ReactElement): renderer.ReactTestRenderer {
  let tree: renderer.ReactTestRenderer | undefined;

  act(() => {
    tree = renderer.create(withProviders(ui));
  });

  const created = tree as renderer.ReactTestRenderer;
  mounted.push(created);
  return created;
}

/** For components whose effects settle on a promise — `Confetti` reads AccessibilityInfo. */
export async function renderComponentAsync(
  ui: React.ReactElement,
): Promise<renderer.ReactTestRenderer> {
  let tree: renderer.ReactTestRenderer | undefined;

  await act(async () => {
    tree = renderer.create(withProviders(ui));
  });

  const created = tree as renderer.ReactTestRenderer;
  mounted.push(created);
  return created;
}

/**
 * The controls carrying a given accessibility role, one node per control.
 *
 * `findAllByProps` matches three nodes for every Pressable — the composite Pressable, the
 * composite View it renders, and the host View underneath — so a naive query counts each control
 * three times. The composite Pressable is the only one holding the callback, so filtering on that
 * is both a correct count and the node a test can press.
 */
export function controlsByRole(
  view: renderer.ReactTestRenderer,
  role: string,
): renderer.ReactTestInstance[] {
  return view.root
    .findAllByProps({ accessibilityRole: role })
    .filter(node => typeof node.props.onPress === 'function');
}

/**
 * Registered here rather than in each test file, so importing the helper is enough.
 *
 * Unmounting is not tidiness: a tree left mounted keeps its timers and animations running past
 * the end of the run, which Jest reports as a worker that failed to exit gracefully.
 */
afterEach(() => {
  act(() => {
    mounted.splice(0).forEach(tree => tree.unmount());
  });
});
