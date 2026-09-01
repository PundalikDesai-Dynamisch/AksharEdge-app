import React from 'react';

import { MASCOTS } from '@assets/registry';
import { renderComponent } from '@/testing/render';

import type { MascotPose } from '@assets/registry';

import { Mascot } from '../Mascot';

const POSES = Object.keys(MASCOTS) as MascotPose[];

describe('Mascot', () => {
  it.each(POSES)('renders the %s pose', pose => {
    expect(renderComponent(<Mascot pose={pose} size="sm" />).toJSON()).toMatchSnapshot();
  });

  it('hides a decorative mascot from screen readers', () => {
    // Announcing "cartoon fox waving" before every heading is noise, not accessibility.
    const view = renderComponent(<Mascot pose="waving" />);
    const art = view.root.findByProps({ accessibilityRole: 'image' });

    expect(art.props.accessibilityElementsHidden).toBe(true);
    expect(art.props.importantForAccessibility).toBe('no-hide-descendants');
  });

  it('exposes a mascot that carries meaning', () => {
    const view = renderComponent(<Mascot pose="mapPin" accessibilityLabel="Map pin" />);
    const art = view.root.findByProps({ accessibilityRole: 'image' });

    expect(art.props.accessibilityElementsHidden).toBe(false);
    expect(art.props.accessibilityLabel).toBe('Map pin');
  });
});
