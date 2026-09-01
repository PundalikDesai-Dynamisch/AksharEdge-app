import React from 'react';

import { strings } from '@/constants/strings';
import { controlsByRole, renderComponent } from '@/testing/render';

import type { Step } from '../SteppingStones';

import { MissionHeader } from '../MissionHeader';

const MISSIONS: Step[] = [
  { key: 'm1', label: 'One' },
  { key: 'm2', label: 'Two' },
];

describe('MissionHeader', () => {
  it('renders the mission path with a pause control', () => {
    expect(
      renderComponent(<MissionHeader steps={MISSIONS} currentIndex={0} completedKeys={[]} onExit={jest.fn()} />).toJSON(),
    ).toMatchSnapshot();
  });

  it('offers exactly one control, and it exits', () => {
    const onExit = jest.fn();
    const view = renderComponent(<MissionHeader steps={MISSIONS} currentIndex={0} completedKeys={[]} onExit={onExit} />);
    const actions = controlsByRole(view, 'button');

    expect(actions).toHaveLength(1);
    expect(actions[0]?.props.accessibilityLabel).toBe(strings.accessibility.pauseAndExit);

    actions[0]?.props.onPress();
    expect(onExit).toHaveBeenCalled();
  });
});
