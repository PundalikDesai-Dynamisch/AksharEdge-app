import React from 'react';

import { renderComponent } from '@/testing/render';

import type { ChildStatus } from '@/types/models';

import { StatusPill } from '../StatusPill';

const STATUSES: ChildStatus[] = ['not_started', 'in_progress', 'report_ready'];

describe('StatusPill', () => {
  it.each(STATUSES)('renders %s', status => {
    expect(renderComponent(<StatusPill status={status} />).toJSON()).toMatchSnapshot();
  });

  it('pairs every status with a glyph, so status is never colour alone', () => {
    // design.md §18. A pill that differs only in tone is unreadable to a colour-blind parent, so
    // the chip must render two children — the icon and the label — not just the label.
    STATUSES.forEach(status => {
      const json = renderComponent(<StatusPill status={status} />).toJSON() as {
        children: unknown[];
      };

      expect(json.children).toHaveLength(2);
    });
  });
});
