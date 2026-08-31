import React from 'react';

import { strings } from '@/constants/strings';
import { IconName } from '@theme';

import type { IconGlyph } from '@theme';
import type { ChildStatus } from '@/types/models';

import { Chip } from './Chip';

import type { ChipTone } from './Chip';

interface StatusPillProps {
  status: ChildStatus;
}

/**
 * The child status pill on Parent Home and All Children (spec §7).
 *
 * Every status carries a glyph as well as a tone, because design.md §18 forbids communicating
 * state by colour alone — and "Report ready" is exactly the kind of status a parent must be able
 * to find at a glance without relying on green.
 *
 * The status itself is derived by `deriveChildStatus` from real assessment data; this component
 * only renders what it is handed.
 */
const STATUS: Readonly<Record<ChildStatus, { tone: ChipTone; icon: IconGlyph; label: string }>> = {
  not_started: { tone: 'neutral', icon: IconName.clock, label: strings.status.not_started },
  in_progress: { tone: 'info', icon: IconName.refresh, label: strings.status.in_progress },
  report_ready: {
    tone: 'success',
    icon: IconName.checkCircle,
    label: strings.status.report_ready,
  },
};

export function StatusPill({ status }: StatusPillProps): React.JSX.Element {
  const { tone, icon, label } = STATUS[status];

  return <Chip label={label} tone={tone} icon={icon} />;
}
