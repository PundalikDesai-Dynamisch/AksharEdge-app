import React, { useEffect } from 'react';


import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { startAssessmentSubscription } from '@features/assessment/assessment.thunks';
import { isPlayAvailable } from '@/domain/policies/reportAvailability';

import ReadyToPlayScreen from '@features/assessment/screens/ReadyToPlayScreen';
import { ReportScreen } from '@features/reports/screens/ReportScreen';
import ParentDetailsScreen from '@features/parent/screens/ParentDetailsScreen';
import SupportScreen from '@features/parent/screens/SupportScreen';
import { BottomTabBar } from '@components/BottomTabBar';
import { IconName } from '@theme';

import type { ChildStackParamList, ParentScreenProps } from './types';

const Tab = createBottomTabNavigator<ChildStackParamList>();

const CustomTabBar = (props: BottomTabBarProps & { playAvailable: boolean; reportAvailable: boolean }) => {
  const currentRoute = props.state.routes[props.state.index]?.name;
  
  let activeKey = 'play';
  if (currentRoute === 'ReadyToPlay') activeKey = 'play';
  if (currentRoute === 'Report') activeKey = 'report';
  if (currentRoute === 'ParentDetails') activeKey = 'parent';
  if (currentRoute === 'Support') activeKey = 'support';

  const handleTabSelect = (key: string): void => {
    switch (key) {
      case 'play':
        props.navigation.navigate('ReadyToPlay');
        break;
      case 'report':
        props.navigation.navigate('Report');
        break;
      case 'parent':
        props.navigation.navigate('ParentDetails');
        break;
      case 'support':
        props.navigation.navigate('Support', { origin: 'ReadyToPlay' });
        break;
    }
  };

  return (
    <BottomTabBar
      variant="child"
      activeKey={activeKey}
      onSelect={handleTabSelect}
      items={[
        {
          key: 'play',
          label: 'Play',
          icon: IconName.gamepad,
          disabled: !props.playAvailable,
        },
        {
          key: 'report',
          label: 'Report',
          icon: IconName.award,
          disabled: !props.reportAvailable,
        },
        {
          key: 'parent',
          label: 'Parent',
          icon: IconName.user,
        },
        {
          key: 'support',
          label: 'Support',
          icon: IconName.helpCircle,
        },
      ]}
    />
  );
};

export function ChildNavigator(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const route = useRoute<ParentScreenProps<'ChildTabs'>['route']>();
  
  const { childId } = route.params;
  const assessment = useAppSelector(state => state.assessment.assessment);

  useEffect(() => {
    if (childId) {
      const promise = dispatch(startAssessmentSubscription(childId));
      return () => {
        promise.abort();
      };
    }
  }, [dispatch, childId]);

  const playAvailable = isPlayAvailable(assessment);
  const reportAvailable = true; // TODO: revert to isReportAvailable(assessment) when functionality is ready

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} playAvailable={playAvailable} reportAvailable={reportAvailable} />}
    >
      <Tab.Screen name="ReadyToPlay" component={ReadyToPlayScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="ParentDetails" component={ParentDetailsScreen} initialParams={{ readonly: true }} options={{ headerShown: true, title: 'Parent Profile' }} />
      <Tab.Screen name="Support" component={SupportScreen} />
    </Tab.Navigator>
  );
}
