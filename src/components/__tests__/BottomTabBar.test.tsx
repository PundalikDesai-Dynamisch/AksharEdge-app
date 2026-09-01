import React from 'react';

import { IconName } from '@theme';
import { controlsByRole, renderComponent } from '@/testing/render';

import type { TabItem } from '../BottomTabBar';

import { BottomTabBar } from '../BottomTabBar';

const PARENT: TabItem[] = [
  { key: 'add', label: 'Add', icon: IconName.plus },
  { key: 'children', label: 'All Children', icon: IconName.users },
  { key: 'parent', label: 'Parent', icon: IconName.user },
  { key: 'support', label: 'Support', icon: IconName.helpCircle },
];

/** Ready to Play state A — Report is locked until the assessment is scored (spec §18). */
const CHILD_A: TabItem[] = [
  { key: 'play', label: 'Play', icon: IconName.gamepad },
  { key: 'report', label: 'Report', icon: IconName.barChart, disabled: true },
  { key: 'parent', label: 'Parent', icon: IconName.user },
  { key: 'support', label: 'Support', icon: IconName.helpCircle },
];

describe('BottomTabBar', () => {
  it('renders the parent variant', () => {
    expect(
      renderComponent(<BottomTabBar variant="parent" items={PARENT} activeKey="children" onSelect={jest.fn()} />).toJSON(),
    ).toMatchSnapshot();
  });

  it('renders the child variant', () => {
    expect(
      renderComponent(<BottomTabBar variant="child" items={CHILD_A} activeKey="play" onSelect={jest.fn()} />).toJSON(),
    ).toMatchSnapshot();
  });

  it('locks a disabled tab rather than hiding it', () => {
    // design.md §18 and spec §18: a vanishing tab is more confusing than an inert one.
    const view = renderComponent(
      <BottomTabBar variant="child" items={CHILD_A} activeKey="play" onSelect={jest.fn()} />,
    );

    expect(controlsByRole(view, 'tab')).toHaveLength(CHILD_A.length);
  });

  it('does not navigate from a disabled tab', () => {
    const onSelect = jest.fn();
    const view = renderComponent(
      <BottomTabBar variant="child" items={CHILD_A} activeKey="play" onSelect={onSelect} />,
    );
    const report = controlsByRole(view, 'tab')[1];

    expect(report?.props.disabled).toBe(true);
    expect(report?.props.accessibilityState).toEqual({ selected: false, disabled: true });
  });

  it('tells assistive tech the tab is locked, not merely unselected', () => {
    const view = renderComponent(
      <BottomTabBar variant="child" items={CHILD_A} activeKey="play" onSelect={jest.fn()} />,
    );

    expect(controlsByRole(view, 'tab')[1]?.props.accessibilityLabel).toBe('Report, Locked');
  });

  it('selects an enabled tab', () => {
    const onSelect = jest.fn();
    const view = renderComponent(
      <BottomTabBar variant="child" items={CHILD_A} activeKey="play" onSelect={onSelect} />,
    );

    controlsByRole(view, 'tab')[3]?.props.onPress();
    expect(onSelect).toHaveBeenCalledWith('support');
  });
});
