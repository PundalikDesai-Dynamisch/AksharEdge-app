import React from 'react';
import { Text } from 'react-native';

import { renderComponent } from '@/testing/render';

import { Card } from '../Card';

describe('Card', () => {
  it.each(['plain', 'sky', 'accent'] as const)('renders the %s tone', tone => {
    expect(
      renderComponent(<Card tone={tone}><Text>Body</Text></Card>).toJSON(),
    ).toMatchSnapshot();
  });

  it('is not a button unless it is pressable', () => {
    const plain = renderComponent(<Card><Text>Body</Text></Card>);
    expect(plain.root.findAllByProps({ accessibilityRole: 'button' })).toHaveLength(0);
  });

  it('exposes a button role and label when pressable', () => {
    const view = renderComponent(
      <Card onPress={jest.fn()} accessibilityLabel="Open Aarav"><Text>Body</Text></Card>,
    );

    expect(view.root.findByProps({ accessibilityRole: 'button' }).props.accessibilityLabel).toBe('Open Aarav');
  });
});
