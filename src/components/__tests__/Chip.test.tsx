import React from 'react';

import { IconName } from '@theme';
import { renderComponent } from '@/testing/render';

import { Chip } from '../Chip';

describe('Chip', () => {
  it.each(['neutral', 'info', 'success', 'warning', 'danger'] as const)('renders the %s tone', tone => {
    expect(renderComponent(<Chip label="Status" tone={tone} />).toJSON()).toMatchSnapshot();
  });

  it('renders selected and with an icon', () => {
    expect(renderComponent(<Chip label="Chosen" selected onPress={jest.fn()} />).toJSON()).toMatchSnapshot();
    expect(renderComponent(<Chip label="Waiting" tone="info" icon={IconName.clock} />).toJSON()).toMatchSnapshot();
  });

  it('reports its selected state to assistive tech', () => {
    const view = renderComponent(<Chip label="Chosen" selected onPress={jest.fn()} />);
    expect(view.root.findByProps({ accessibilityRole: 'button' }).props.accessibilityState).toEqual({ selected: true });
  });
});
