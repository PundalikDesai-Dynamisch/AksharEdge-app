import React from 'react';

import { controlsByRole, renderComponent } from '@/testing/render';

import { ConfirmDialog } from '../ConfirmDialog';

describe('ConfirmDialog', () => {
  it('renders confirm and cancel', () => {
    expect(
      renderComponent(
        <ConfirmDialog visible title="Sign out?" message="You will need to sign in again." onConfirm={jest.fn()} onCancel={jest.fn()} />,
      ).toJSON(),
    ).toMatchSnapshot();
  });

  it('calls back on confirm and on cancel', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const view = renderComponent(
      <ConfirmDialog
        visible
        title="Remove Aarav's profile?"
        message="This also deletes their assessment history."
        confirmLabel="Delete"
        cancelLabel="Keep"
        destructive
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    const actions = controlsByRole(view, 'button');
    actions.find(a => a.props.accessibilityLabel === 'Delete')?.props.onPress();
    actions.find(a => a.props.accessibilityLabel === 'Keep')?.props.onPress();

    expect(onConfirm).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });
});
