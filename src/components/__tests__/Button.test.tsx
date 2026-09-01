import React from 'react';

import { IconName } from '@theme';
import { renderComponent } from '@/testing/render';

import { Button } from '../Button';

describe('Button', () => {
  it.each(['primary', 'secondary', 'ghost', 'destructive'] as const)('renders the %s variant', variant => {
    expect(renderComponent(<Button label="Continue" onPress={jest.fn()} variant={variant} />).toJSON()).toMatchSnapshot();
  });

  it.each(['md', 'lg'] as const)('renders at size %s', size => {
    expect(renderComponent(<Button label="Continue" onPress={jest.fn()} size={size} />).toJSON()).toMatchSnapshot();
  });

  it('renders loading and disabled states', () => {
    expect(renderComponent(<Button label="Saving" onPress={jest.fn()} loading />).toJSON()).toMatchSnapshot();
    expect(renderComponent(<Button label="Blocked" onPress={jest.fn()} disabled />).toJSON()).toMatchSnapshot();
  });

  it('refuses a press while disabled', () => {
    const onPress = jest.fn();
    const view = renderComponent(<Button label="Blocked" onPress={onPress} disabled />);
    const pressable = view.root.findByProps({ accessibilityRole: 'button' });

    expect(pressable.props.disabled).toBe(true);
    expect(pressable.props.accessibilityState).toEqual({ disabled: true, busy: false });
    expect(onPress).not.toHaveBeenCalled();
  });

  it('marks itself busy, not disabled-looking, while loading', () => {
    const view = renderComponent(<Button label="Saving" onPress={jest.fn()} loading />);
    const pressable = view.root.findByProps({ accessibilityRole: 'button' });

    expect(pressable.props.accessibilityState).toEqual({ disabled: true, busy: true });
  });

  it('renders a leading icon', () => {
    expect(
      renderComponent(<Button label="Add" onPress={jest.fn()} icon={IconName.plus} />).toJSON(),
    ).toMatchSnapshot();
  });
});
