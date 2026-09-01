import React from 'react';

import { strings } from '@/constants/strings';
import { controlsByRole, renderComponent } from '@/testing/render';

import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('renders empty and filled', () => {
    expect(renderComponent(<SearchBar value="" onChangeText={jest.fn()} />).toJSON()).toMatchSnapshot();
    expect(renderComponent(<SearchBar value="aarav" onChangeText={jest.fn()} onClear={jest.fn()} />).toJSON()).toMatchSnapshot();
  });

  it('offers clear only when there is something to clear', () => {
    const empty = renderComponent(<SearchBar value="" onChangeText={jest.fn()} onClear={jest.fn()} />);
    expect(controlsByRole(empty, 'button')).toHaveLength(0);

    const onClear = jest.fn();
    const filled = renderComponent(<SearchBar value="aarav" onChangeText={jest.fn()} onClear={onClear} />);
    const actions = controlsByRole(filled, 'button');

    expect(actions).toHaveLength(1);
    expect(actions[0]?.props.accessibilityLabel).toBe(strings.accessibility.clearSearchField);
    actions[0]?.props.onPress();
    expect(onClear).toHaveBeenCalled();
  });
});
