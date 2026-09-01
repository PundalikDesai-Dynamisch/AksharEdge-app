import React from 'react';

import { controlsByRole, renderComponent } from '@/testing/render';

import type { Step } from '../SteppingStones';

import { WizardHeader } from '../WizardHeader';

const WIZARD: Step[] = [
  { key: 'identity', label: 'Child' },
  { key: 'details', label: 'Details' },
  { key: 'location', label: 'Location' },
];

describe('WizardHeader', () => {
  it('renders no back control on the first step', () => {
    // design.md §8.10: absent, never present-but-disabled. An inert control that still looks
    // tappable is worse than no control.
    const view = renderComponent(<WizardHeader steps={WIZARD} currentIndex={0} completedKeys={[]} title="Who is playing?" />);

    expect(controlsByRole(view, 'button')).toHaveLength(0);
  });

  it('renders a back control on later steps', () => {
    const onBack = jest.fn();
    const view = renderComponent(
      <WizardHeader steps={WIZARD} currentIndex={2} completedKeys={['identity', 'details']} title="Where?" onBack={onBack} />,
    );
    const actions = controlsByRole(view, 'button');

    expect(actions).toHaveLength(1);
    actions[0]?.props.onPress();
    expect(onBack).toHaveBeenCalled();
  });

  it('keeps progress visible throughout', () => {
    const view = renderComponent(<WizardHeader steps={WIZARD} currentIndex={1} completedKeys={['identity']} />);
    expect(view.root.findAllByProps({ accessibilityRole: 'progressbar' }).length).toBeGreaterThan(0);
  });
});
