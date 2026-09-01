import React from 'react';

import { controlsByRole, renderComponent } from '@/testing/render';

import { Dialog } from '../Dialog';

describe('Dialog', () => {
  it('renders a single-action dialog', () => {
    expect(
      renderComponent(
        <Dialog visible title="Done" message="All set." primary={{ label: 'OK', onPress: jest.fn() }} />,
      ).toJSON(),
    ).toMatchSnapshot();
  });

  it('renders a two-action dialog', () => {
    expect(
      renderComponent(
        <Dialog
          visible
          title="Remove profile?"
          message="This also deletes their assessment history."
          destructive
          primary={{ label: 'Delete', onPress: jest.fn() }}
          secondary={{ label: 'Cancel', onPress: jest.fn() }}
        />,
      ).toJSON(),
    ).toMatchSnapshot();
  });

  it('does not advertise a backdrop control when it cannot be dismissed', () => {
    // A non-dismissible dialog's backdrop is not a control, so it must not claim to be one.
    const view = renderComponent(
      <Dialog visible title="Blocked" message="No way out." primary={{ label: 'OK', onPress: jest.fn() }} />,
    );

    expect(controlsByRole(view, 'button')).toHaveLength(1);
  });

  it('exposes the backdrop as a control when dismissible', () => {
    const onDismiss = jest.fn();
    const view = renderComponent(
      <Dialog
        visible
        title="Optional"
        message="Tap outside to close."
        onDismiss={onDismiss}
        primary={{ label: 'OK', onPress: jest.fn() }}
      />,
    );

    expect(controlsByRole(view, 'button').length).toBeGreaterThan(1);
  });
});
