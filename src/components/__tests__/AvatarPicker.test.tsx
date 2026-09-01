import React from 'react';

import { AVATAR_IDS } from '@assets/registry';
import { controlsByRole, renderComponent } from '@/testing/render';

import { AvatarPicker } from '../AvatarPicker';

describe('AvatarPicker', () => {
  it('renders every option', () => {
    const view = renderComponent(<AvatarPicker value="avatar-01" onChange={jest.fn()} />);

    expect(controlsByRole(view, 'radio')).toHaveLength(AVATAR_IDS.length);
  });

  it('is a radiogroup with exactly one option selected', () => {
    const view = renderComponent(<AvatarPicker value="avatar-03" onChange={jest.fn()} />);
    const options = controlsByRole(view, 'radio');

    expect(view.root.findAllByProps({ accessibilityRole: 'radiogroup' }).length).toBeGreaterThan(0);
    expect(options.filter(option => option.props.accessibilityState.selected)).toHaveLength(1);
  });

  it('reports the chosen avatar', () => {
    const onChange = jest.fn();
    const view = renderComponent(<AvatarPicker value="avatar-01" onChange={onChange} />);

    controlsByRole(view, 'radio')[2]?.props.onPress();

    expect(onChange).toHaveBeenCalledWith('avatar-03');
  });
});
