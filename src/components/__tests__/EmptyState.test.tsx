import React from 'react';
import { Text } from 'react-native';

import { IconName } from '@theme';
import { controlsByRole, renderComponent } from '@/testing/render';

import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders with an icon', () => {
    expect(
      renderComponent(<EmptyState icon={IconName.users} title="No children yet" description="Add a profile." />).toJSON(),
    ).toMatchSnapshot();
  });

  it('renders an action when one is given', () => {
    const onAction = jest.fn();
    const view = renderComponent(
      <EmptyState icon={IconName.users} title="No children yet" actionLabel="Add Child" onAction={onAction} />,
    );

    const actions = controlsByRole(view, 'button');
    expect(actions).toHaveLength(1);
    actions[0]?.props.onPress();
    expect(onAction).toHaveBeenCalled();
  });

  it('prefers an illustration over the icon when both are given', () => {
    const view = renderComponent(
      <EmptyState icon={IconName.users} illustration={<Text>art</Text>} title="No children yet" />,
    );

    expect(JSON.stringify(view.toJSON())).toContain('art');
  });
});
