import React from 'react';

import renderer, { act } from 'react-test-renderer';

import type { BadgeType } from '@assets/registry';

import { RewardBadge } from '../RewardBadge';

const TYPES: BadgeType[] = ['star', 'trophy', 'ribbon'];

describe('RewardBadge', () => {
  it.each(TYPES)('renders the %s badge', type => {
    let tree: renderer.ReactTestRenderer | undefined;

    act(() => {
      tree = renderer.create(<RewardBadge type={type} />);
    });

    // Guards against the silent failure mode: without jest/svgMock.js the artwork resolves to an
    // asset stub and this renders `null` while still "passing" a looser assertion.
    expect(tree?.toJSON()).not.toBeNull();
  });

  it('hides a decorative badge from screen readers', () => {
    let tree: renderer.ReactTestRenderer | undefined;

    act(() => {
      tree = renderer.create(<RewardBadge type="star" />);
    });

    const json = tree?.toJSON() as { props: Record<string, unknown> } | null;
    expect(json?.props.accessibilityElementsHidden).toBe(true);
  });
});
