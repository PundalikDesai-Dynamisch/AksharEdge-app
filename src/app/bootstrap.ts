import { store } from '@/store';
import { authService } from '@/services/firebase/authService';
import { buildRepositories } from '@/data/container';
import { setAuthState } from '@/features/auth/auth.slice';
import { logger } from '@/utils/logger';

import type { Parent } from '@/domain/entities/Parent';

/**
 * Initialises the app on launch (doc 04 §10). Phase 1 wires only the auth listener;
 * later phases add: DB open → migrate → crash recovery → network monitor → sync engine.
 */
export async function bootstrap(): Promise<void> {
  logger.info('Bootstrap: starting');

  // 1. Subscribe to auth state (THE single source of signedIn/signedOut)
  authService.onAuthStateChanged(async (user) => {
    logger.debug('onAuthStateChanged fired', { uid: user?.uid ?? null });

    if (!user) {
      logger.debug('No user, setting signedOut');
      store.dispatch(setAuthState({ status: 'signedOut', parent: null }));
      return;
    }

    try {
      // Fetch or create parent doc
      logger.debug('Fetching/creating parent', { uid: user.uid });
      const { parents } = buildRepositories();
      const isGoogle = user.providerData.some(
        (p: { providerId: string }) => p.providerId === 'google.com',
      );
      const authProvider = isGoogle ? 'google' : 'password';

      const parent = await parents.fetchOrCreate({
        parentId: user.uid,
        fullName: user.displayName || 'Unknown Parent',
        email: user.email?.toLowerCase() || '',
        phone: user.phoneNumber || null,
        contactMethod: 'email',
        location: null,
        authProvider,
      });

      logger.debug('Parent fetched successfully', { parentId: parent.parentId });
      store.dispatch(setAuthState({ status: 'signedIn', parent }));
    } catch (error: unknown) {
      logger.error('Failed to restore parent profile', error);
      // Fallback: build minimal parent to avoid stranding on Splash screen
      const isGoogle = user.providerData.some(
        (p: { providerId: string }) => p.providerId === 'google.com',
      );
      const fallbackParent: Parent = {
        parentId: user.uid,
        fullName: user.displayName || 'Unknown Parent',
        email: user.email?.toLowerCase() || '',
        phone: user.phoneNumber || null,
        contactMethod: 'email',
        location: null,
        childCount: 0,
        authProvider: isGoogle ? 'google' : 'password',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      logger.warn('Using fallback parent, dispatching signedIn');
      store.dispatch(setAuthState({ status: 'signedIn', parent: fallbackParent }));
    }
  });
}
