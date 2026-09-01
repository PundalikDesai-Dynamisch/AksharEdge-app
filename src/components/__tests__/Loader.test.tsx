import React from 'react';

import { renderComponent } from '@/testing/render';

import { Loader } from '../Loader';

describe('Loader', () => {
  it('renders with and without a label', () => {
    expect(renderComponent(<Loader />).toJSON()).toMatchSnapshot();
    expect(renderComponent(<Loader size="small" label="Loading…" />).toJSON()).toMatchSnapshot();
  });

  it('announces itself as a progressbar', () => {
    const view = renderComponent(<Loader label="Loading…" />);
    expect(view.root.findByProps({ accessibilityRole: 'progressbar' }).props.accessibilityLabel).toBe('Loading…');
  });
});
