import React from 'react';

import renderer, { act } from 'react-test-renderer';

import { Confetti } from '../Confetti';

const mounted: renderer.ReactTestRenderer[] = [];

async function render(element: React.ReactElement): Promise<renderer.ReactTestRenderer> {
  let tree: renderer.ReactTestRenderer | undefined;

  // `await act` also flushes the AccessibilityInfo.isReduceMotionEnabled() promise, so the
  // reduce-motion effect settles inside the test rather than after it is torn down.
  await act(async () => {
    tree = renderer.create(element);
  });

  mounted.push(tree as renderer.ReactTestRenderer);
  return tree as renderer.ReactTestRenderer;
}

/**
 * Unmounting is not tidiness — it exercises the `cancelAnimation` cleanup. Leave the trees
 * mounted and the timing animations keep running past the end of the run, which Jest reports as
 * a worker that "failed to exit gracefully". That warning is the same leak a user would get by
 * navigating away mid-celebration, so a green run here is also evidence the cleanup works.
 */
afterEach(() => {
  act(() => {
    mounted.splice(0).forEach(tree => tree.unmount());
  });
});

describe('Confetti', () => {
  it('renders no particles while inactive', async () => {
    const tree = await render(<Confetti active={false} />);
    const json = tree.toJSON() as { children: unknown[] | null } | null;

    expect(json?.children).toBeNull();
  });

  it('renders one view per particle when active', async () => {
    const tree = await render(<Confetti active particleCount={6} />);
    const json = tree.toJSON() as { children: unknown[] | null } | null;

    expect(json?.children).toHaveLength(6);
  });

  it('never intercepts touches, so the CTA beneath stays pressable', async () => {
    const tree = await render(<Confetti active particleCount={4} />);
    const json = tree.toJSON() as { props: Record<string, unknown> } | null;

    expect(json?.props.pointerEvents).toBe('none');
  });

  it('is deterministic, so snapshots do not churn between runs', async () => {
    const first = await render(<Confetti active particleCount={8} />);
    const second = await render(<Confetti active particleCount={8} />);

    expect(first.toJSON()).toEqual(second.toJSON());
  });
});
