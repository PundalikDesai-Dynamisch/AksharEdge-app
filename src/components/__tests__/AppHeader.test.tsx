import React from 'react';

import { IconName } from '@theme';
import { controlsByRole, renderComponent } from '@/testing/render';

import { AppHeader } from '../AppHeader';

describe('AppHeader', () => {
  it('renders title alone and with a subtitle', () => {
    expect(renderComponent(<AppHeader title="Welcome" />).toJSON()).toMatchSnapshot();
    expect(renderComponent(<AppHeader title="Welcome" subtitle="Priya" />).toJSON()).toMatchSnapshot();
  });

  it('renders an action when one is given', () => {
    const onPress = jest.fn();
    const view = renderComponent(
      <AppHeader title="Welcome" action={{ icon: IconName.plus, accessibilityLabel: 'Add child', onPress }} />,
    );
    const actions = controlsByRole(view, 'button');

    expect(actions).toHaveLength(1);
    actions[0]?.props.onPress();
    expect(onPress).toHaveBeenCalled();
  });
});
