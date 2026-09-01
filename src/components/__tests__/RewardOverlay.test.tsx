import React from 'react';

import { controlsByRole, renderComponentAsync } from '@/testing/render';

import { RewardOverlay } from '../RewardOverlay';

describe('RewardOverlay', () => {
  it('renders the celebration', async () => {
    const view = await renderComponentAsync(
      <RewardOverlay visible mascotPose="cheering" title="You did it!" ctaLabel="Done" badge="trophy" onPress={jest.fn()} />,
    );

    expect(view.toJSON()).toMatchSnapshot();
  });

  it('offers a single action, per design.md §16', async () => {
    // A child-facing celebration with two competing choices is a worse celebration.
    const onPress = jest.fn();
    const view = await renderComponentAsync(
      <RewardOverlay visible mascotPose="cheering" title="You did it!" ctaLabel="Done" onPress={onPress} />,
    );
    const actions = controlsByRole(view, 'button');

    expect(actions).toHaveLength(1);
    actions[0]?.props.onPress();
    expect(onPress).toHaveBeenCalled();
  });
});
