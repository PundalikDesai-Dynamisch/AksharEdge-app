import React from 'react';

import { strings } from '@/constants/strings';
import { controlsByRole, renderComponent } from '@/testing/render';

import { PermissionDeniedState } from '../PermissionDeniedState';

const BASE = {
  mascotPose: 'mapPin',
  title: strings.permissions.location.deniedTitle,
  explanation: strings.permissions.location.deniedExplanation,
} as const;

describe('PermissionDeniedState', () => {
  it('offers Try Again when denied, because re-requesting can still succeed', () => {
    const onRetry = jest.fn();
    const view = renderComponent(
      <PermissionDeniedState {...BASE} status="denied" onRetry={onRetry} onOpenSettings={jest.fn()} />,
    );
    const actions = controlsByRole(view, 'button');

    expect(actions).toHaveLength(1);
    expect(actions[0]?.props.accessibilityLabel).toBe(strings.permissions.tryAgain);

    actions[0]?.props.onPress();
    expect(onRetry).toHaveBeenCalled();
  });

  it('offers Open Settings when blocked, because Try Again would be a lie', () => {
    // A blocked permission silently no-ops when re-requested; the OS never surfaces it.
    const onOpenSettings = jest.fn();
    const view = renderComponent(
      <PermissionDeniedState {...BASE} status="blocked" onRetry={jest.fn()} onOpenSettings={onOpenSettings} />,
    );
    const actions = controlsByRole(view, 'button');

    expect(actions).toHaveLength(1);
    expect(actions[0]?.props.accessibilityLabel).toBe(strings.permissions.openSettings);

    actions[0]?.props.onPress();
    expect(onOpenSettings).toHaveBeenCalled();
  });

  it('offers no action when the device simply cannot do it', () => {
    // Neither button would help, so inventing one would imply a way forward that does not exist.
    const view = renderComponent(
      <PermissionDeniedState {...BASE} status="unavailable" onRetry={jest.fn()} onOpenSettings={jest.fn()} />,
    );

    expect(controlsByRole(view, 'button')).toHaveLength(0);
  });

  it.each(['denied', 'blocked', 'unavailable'] as const)('renders the %s state', status => {
    expect(
      renderComponent(
        <PermissionDeniedState {...BASE} status={status} onRetry={jest.fn()} onOpenSettings={jest.fn()} />,
      ).toJSON(),
    ).toMatchSnapshot();
  });
});
