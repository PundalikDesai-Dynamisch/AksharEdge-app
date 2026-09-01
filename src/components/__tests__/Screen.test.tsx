import React from 'react';
import { Text } from 'react-native';

import { renderComponent } from '@/testing/render';

import { Screen } from '../Screen';

describe('Screen', () => {
  it('renders plain, scrolling, loading and playful variants', () => {
    expect(renderComponent(<Screen><Text>Body</Text></Screen>).toJSON()).toMatchSnapshot();
    expect(renderComponent(<Screen scroll><Text>Body</Text></Screen>).toJSON()).toMatchSnapshot();
    expect(renderComponent(<Screen loading />).toJSON()).toMatchSnapshot();
    expect(renderComponent(<Screen variant="playful"><Text>Body</Text></Screen>).toJSON()).toMatchSnapshot();
  });

  it('never lets the decorative backdrop swallow a tap', () => {
    const view = renderComponent(<Screen variant="playful"><Text>Body</Text></Screen>);
    const backdrops = view.root.findAllByProps({ pointerEvents: 'none' });

    expect(backdrops.length).toBeGreaterThan(0);
  });
});
