import React from 'react';

import { renderComponent } from '@/testing/render';

import type { Step } from '../SteppingStones';

import { SteppingStones } from '../SteppingStones';

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

describe('SteppingStones', () => {
  it('renders a 3-stone roadmap', () => {
    expect(renderComponent(<SteppingStones steps={ROADMAP} currentIndex={1} completedKeys={['games']} />).toJSON()).toMatchSnapshot();
  });

  it('renders a 5-step wizard', () => {
    expect(
      renderComponent(<SteppingStones steps={WIZARD} currentIndex={2} completedKeys={['identity', 'details']} />).toJSON(),
    ).toMatchSnapshot();
  });

  it('announces progress rather than only drawing it', () => {
    const view = renderComponent(<SteppingStones steps={WIZARD} currentIndex={2} completedKeys={['identity', 'details']} />);
    const bar = view.root.findByProps({ accessibilityRole: 'progressbar' });

    expect(bar.props.accessibilityValue).toEqual({ min: 0, max: 5, now: 2 });
  });
});
