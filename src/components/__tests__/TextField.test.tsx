import React from 'react';

import type { ReactTestInstance } from 'react-test-renderer';

import { renderComponent } from '@/testing/render';

import { TextField } from '../TextField';

function inputOf(
  view: ReturnType<typeof renderComponent>,
  label: string,
): ReactTestInstance | undefined {
  return view.root
    .findAllByProps({ accessibilityLabel: label })
    .filter(node => typeof node.props.onChangeText === 'function')[0];
}

describe('TextField', () => {
  it('renders default, filled, error and disabled states', () => {
    expect(renderComponent(<TextField label="Email" value="" onChangeText={jest.fn()} />).toJSON()).toMatchSnapshot();
    expect(renderComponent(<TextField label="Email" value="a@b.com" onChangeText={jest.fn()} />).toJSON()).toMatchSnapshot();
    expect(
      renderComponent(<TextField label="Email" value="nope" onChangeText={jest.fn()} error="Enter a valid email." />).toJSON(),
    ).toMatchSnapshot();
    expect(
      renderComponent(<TextField label="Email" value="locked" onChangeText={jest.fn()} editable={false} />).toJSON(),
    ).toMatchSnapshot();
  });

  it('forwards the caller onBlur as well as clearing focus', () => {
    // Screens hang validation off onBlur; swallowing it would silently disable every
    // validate-on-blur form in the app.
    const onBlur = jest.fn();
    const view = renderComponent(<TextField label="Email" value="" onChangeText={jest.fn()} onBlur={onBlur} />);
    const input = inputOf(view, 'Email');

    input?.props.onFocus();
    input?.props.onBlur();

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('marks a disabled field to assistive tech', () => {
    const view = renderComponent(<TextField label="Email" value="x" onChangeText={jest.fn()} editable={false} />);

    expect(inputOf(view, 'Email')?.props.accessibilityState).toEqual({ disabled: true });
  });
});
