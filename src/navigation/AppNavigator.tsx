import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Icon } from '@components';
import { strings } from '@/constants/strings';
import DashboardScreen from '@features/dashboard/screens/DashboardScreen';
import AboutScreen from '@features/settings/screens/AboutScreen';
import ProfileScreen from '@features/settings/screens/ProfileScreen';
import SettingsScreen from '@features/settings/screens/SettingsScreen';
import AddEditStudentScreen from '@features/students/screens/AddEditStudentScreen';
import StudentDetailScreen from '@features/students/screens/StudentDetailScreen';
import StudentListScreen from '@features/students/screens/StudentListScreen';
import CapturePreviewScreen from '@features/uploads/screens/CapturePreviewScreen';
import UploadHistoryScreen from '@features/uploads/screens/UploadHistoryScreen';
import UploadOptionsScreen from '@features/uploads/screens/UploadOptionsScreen';
import { GamesScreen } from '@features/games/screens/GamesScreen';
import { UnityGameScreen } from '@features/games/screens/UnityGameScreen';
import { IconName } from '@theme';

import type { IconGlyph } from '@theme';

import type { AppStackParamList, MainTabsParamList } from './types';

import {
  defaultStackOptions,
  defaultTabOptions,
  fullScreenModalOptions,
  modalOptions,
} from './screenOptions';

const Tabs = createBottomTabNavigator<MainTabsParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

function tabIcon(glyph: IconGlyph) {
  return function TabIcon({ focused }: { focused: boolean }): React.JSX.Element {
    return <Icon name={glyph} size={22} color={focused ? 'primary' : 'textMuted'} />;
  };
}

function MainTabs(): React.JSX.Element {
  return (
    <Tabs.Navigator screenOptions={defaultTabOptions}>
      <Tabs.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          title: strings.headers.dashboard,
          tabBarIcon: tabIcon(IconName.home),
        }}
      />
      <Tabs.Screen
        name="StudentsTab"
        component={StudentListScreen}
        options={{ title: strings.headers.students, tabBarIcon: tabIcon(IconName.users) }}
      />
      <Tabs.Screen
        name="HistoryTab"
        component={UploadHistoryScreen}
        options={{ title: strings.headers.uploads, tabBarIcon: tabIcon(IconName.uploadCloud) }}
      />
      <Tabs.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ title: strings.headers.settings, tabBarIcon: tabIcon(IconName.settings) }}
      />
      <Tabs.Screen
        name="GamesTab"
        component={GamesScreen}
        options={{ title: strings.headers.games, tabBarIcon: tabIcon(IconName.gamepad) }}
      />
    </Tabs.Navigator>
  );
}

export function AppNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator initialRouteName="MainTabs" screenOptions={defaultStackOptions}>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />

      <Stack.Screen
        name="AddEditStudent"
        component={AddEditStudentScreen}
        options={({ route }) => ({
          title:
            route.params.studentId === undefined
              ? strings.headers.addStudent
              : strings.headers.editStudent,
        })}
      />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />

      <Stack.Screen name="UploadOptions" component={UploadOptionsScreen} options={modalOptions} />
      <Stack.Screen
        name="CapturePreview"
        component={CapturePreviewScreen}
        options={({ route }) => ({
          ...fullScreenModalOptions,
          title: strings.headers.review(route.params.files.length),
        })}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: strings.headers.profile }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: strings.headers.about }}
      />
      <Stack.Screen
        name="UnityGame"
        component={UnityGameScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
