import { CommonActions, createNavigationContainerRef } from '@react-navigation/native';

import type { AppStackParamList, RootStackParamList } from './types';

/**
 * Imperative navigation for callers with no React tree — the sync engine and the
 * background-fetch callback (doc 06 §6).
 *
 * The ref is typed over `RootStackParamList` because that is what NavigationContainer actually
 * hosts, while `navigateTo` keeps its public signature over `AppStackParamList` (doc 06 §6's
 * contract). Crossing that navigator boundary is dispatched through CommonActions rather than
 * cast to `never`, so no navigation call in the codebase needs a type assertion (doc 06 §11).
 */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateTo<T extends keyof AppStackParamList>(
  name: T,
  params?: AppStackParamList[T],
): void {
  // A background-fetch callback can fire before the container mounts, so this guard is
  // load-bearing rather than defensive (doc 06 §6).
  if (!navigationRef.isReady()) {
    return;
  }
  navigationRef.dispatch(CommonActions.navigate(name, params));
}
