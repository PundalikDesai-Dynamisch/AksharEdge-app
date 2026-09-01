import React from 'react';

import { IconName } from '@theme';
import { renderComponent } from '@/testing/render';

import { Icon } from '../Icon';

describe('Icon', () => {
  it('renders a glyph', () => {
    expect(renderComponent(<Icon name={IconName.check} />).toJSON()).toMatchSnapshot();
  });

  it('renders every glyph the vocabulary declares', () => {
    // Guards the one file allowed to name an icon string: a glyph the icon set does not actually
    // ship would otherwise surface only as a blank square on a device.
    Object.values(IconName).forEach(glyph => {
      expect(renderComponent(<Icon name={glyph} />).toJSON()).not.toBeNull();
    });
  });
});
