import React from 'react';

import { strings } from '@/constants/strings';
import { controlsByRole, renderComponent } from '@/testing/render';

import { PermissionGate } from '../PermissionGate';

const LOCATION = {
  mascotPose: 'mapPin',
  title: strings.permissions.location.title,
  explanation: strings.permissions.location.explanation,
  ctaLabel: strings.permissions.location.cta,
} as const;

describe('PermissionGate', () => {
  it('renders the request state', () => {
    expect(
      renderComponent(<PermissionGate {...LOCATION} status="denied" onRequest={jest.fn()} />).toJSON(),
    ).toMatchSnapshot();
  });

  it('offers exactly one action — the hard gate has no bypass', () => {
    // CLAUDE.md §8 forbids Skip, Maybe later and Continue anyway. The guarantee is structural:
    // there is no prop that could produce a second control, and this asserts none appears.
    const view = renderComponent(<PermissionGate {...LOCATION} status="denied" onRequest={jest.fn()} />);

    expect(controlsByRole(view, 'button')).toHaveLength(1);
  });

  it('disables the CTA while the OS dialog is up', () => {
    // A double tap must not queue a second permission request.
    const view = renderComponent(<PermissionGate {...LOCATION} status="requesting" onRequest={jest.fn()} />);
    const cta = controlsByRole(view, 'button')[0];

    expect(cta?.props.accessibilityState).toEqual({ disabled: true, busy: true });
  });

  it('reads as allowed once granted, never as still-to-do', () => {
    const view = renderComponent(<PermissionGate {...LOCATION} status="granted" onRequest={jest.fn()} />);
    const cta = controlsByRole(view, 'button')[0];

    expect(cta?.props.accessibilityLabel).toBe(strings.permissions.granted);
    expect(cta?.props.disabled).toBe(true);
  });

  it('differs from the camera gate only in copy', () => {
    const camera = renderComponent(
      <PermissionGate
        mascotPose="camera"
        status="denied"
        title={strings.permissions.camera.title}
        explanation={strings.permissions.camera.explanation}
        ctaLabel={strings.permissions.camera.cta}
        onRequest={jest.fn()}
      />,
    );

    expect(controlsByRole(camera, 'button')).toHaveLength(1);
    expect(camera.toJSON()).toMatchSnapshot();
  });
});
