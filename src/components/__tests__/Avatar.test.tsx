import React from 'react';

import { AVATAR_IDS } from '@assets/registry';
import { renderComponent } from '@/testing/render';

import { Avatar } from '../Avatar';

describe('Avatar', () => {
  it.each(['sm', 'md', 'lg'] as const)('renders at size %s', size => {
    expect(renderComponent(<Avatar avatarId="avatar-01" size={size} />).toJSON()).toMatchSnapshot();
  });

  it('renders all twelve illustrated avatars', () => {
    // Guards the registry seam: without jest/svgMock.js each of these renders `null` silently.
    AVATAR_IDS.forEach(avatarId => {
      expect(renderComponent(<Avatar avatarId={avatarId} />).toJSON()).not.toBeNull();
    });
  });

  it('shows a badge as well as a ring when selected', () => {
    const plain = renderComponent(<Avatar avatarId="avatar-01" />).toJSON() as { children: unknown[] };
    const selected = renderComponent(<Avatar avatarId="avatar-01" selected />).toJSON() as { children: unknown[] };

    // design.md §18: a coral ring alone would be colour-only state.
    expect(plain.children).toHaveLength(1);
    expect(selected.children).toHaveLength(2);
  });

  it('announces the child by name', () => {
    const view = renderComponent(<Avatar avatarId="avatar-01" name="Aarav" />);
    expect(view.root.findByProps({ accessibilityRole: 'image' }).props.accessibilityLabel).toBe('Aarav');
  });
});
