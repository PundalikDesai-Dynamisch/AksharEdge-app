import React from 'react';

import { renderComponent } from '@/testing/render';

import type { ToastKind } from '@/types/models';

import { Toast } from '../Toast';

const KINDS: ToastKind[] = ['success', 'info', 'warning', 'error'];

describe('Toast', () => {
  it.each(KINDS)('renders the %s kind', kind => {
    expect(renderComponent(<Toast kind={kind} message="Something happened." />).toJSON()).toMatchSnapshot();
  });

  it('announces itself as an alert', () => {
    const view = renderComponent(<Toast kind="error" message="Upload failed." />);
    expect(view.root.findAllByProps({ accessibilityRole: 'alert' }).length).toBeGreaterThan(0);
  });

  it('dismisses itself after its duration', () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();

    renderComponent(<Toast kind="success" message="Saved." duration={2000} onDismiss={onDismiss} />);
    jest.advanceTimersByTime(2000);

    expect(onDismiss).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
