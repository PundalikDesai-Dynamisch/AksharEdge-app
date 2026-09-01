import React from 'react';

import { controlsByRole, renderComponent } from '@/testing/render';

import { ErrorState } from '../ErrorState';

describe('ErrorState', () => {
  it('renders the default error', () => {
    expect(renderComponent(<ErrorState description="Check your connection." onRetry={jest.fn()} />).toJSON()).toMatchSnapshot();
  });

  it('always offers a retry path', () => {
    // CLAUDE.md §14: every external operation needs a failure path the user can act on.
    const onRetry = jest.fn();
    const view = renderComponent(<ErrorState description="Check your connection." onRetry={onRetry} />);
    const actions = controlsByRole(view, 'button');

    expect(actions).toHaveLength(1);
    actions[0]?.props.onPress();
    expect(onRetry).toHaveBeenCalled();
  });
});
