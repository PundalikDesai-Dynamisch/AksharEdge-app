import React from 'react';

import { renderComponent } from '@/testing/render';

import { OfflineBanner } from '../OfflineBanner';

describe('OfflineBanner', () => {
  it('renders nothing when online', () => {
    expect(renderComponent(<OfflineBanner visible={false} />).toJSON()).toBeNull();
  });

  it('renders offline, with and without a pending count', () => {
    expect(renderComponent(<OfflineBanner visible />).toJSON()).toMatchSnapshot();
    expect(renderComponent(<OfflineBanner visible pendingCount={3} />).toJSON()).toMatchSnapshot();
  });
});
