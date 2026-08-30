import { store } from '@/store';
import { authService } from '@/services/firebase/authService';
import { firestoreService } from '@/services/firebase/firestoreService';
import { setAuthState } from '@/features/auth/auth.slice';
import { logger } from '@/utils/logger';

import type { Teacher } from '@/domain/entities/Teacher';

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
      store.dispatch(setAuthState({ status: 'signedOut', teacher: null }));
      return;
    }

    try {
      // Fetch or create teacher doc
      logger.debug('Fetching/creating teacher', { uid: user.uid });
      const teacher = await firestoreService.fetchOrCreateTeacher(user);
      logger.debug('Teacher fetched successfully', { teacherId: teacher.teacherId });
      store.dispatch(setAuthState({ status: 'signedIn', teacher }));
    } catch (error: unknown) {
      logger.error('Failed to restore teacher profile', error);
      // Fallback: build minimal teacher to avoid stranding on Splash screen
      const isGoogle = user.providerData.some(
        (p: { providerId: string }) => p.providerId === 'google.com',
      );
      const fallbackTeacher: Teacher = {
        teacherId: user.uid,
        fullName: user.displayName || 'Unknown Teacher',
        email: user.email?.toLowerCase() || '',
        school: '',
        phone: user.phoneNumber || null,
        photoUrl: user.photoURL || null,
        authProvider: isGoogle ? 'google' : 'password',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      logger.warn('Using fallback teacher, dispatching signedIn');
      store.dispatch(setAuthState({ status: 'signedIn', teacher: fallbackTeacher }));
    }
  });
}
