import { getFirestore, doc, getDoc, setDoc } from '@react-native-firebase/firestore';

import type { User } from '@react-native-firebase/auth';

import type { Teacher } from '@/domain/entities/Teacher';

export const firestoreService = {
  async fetchOrCreateTeacher(user: User): Promise<Teacher> {
    const db = getFirestore();
    const docRef = doc(db, 'teachers', user.uid);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return snapshot.data() as Teacher;
    }

    const isGoogle = user.providerData.some(
      (p: { providerId: string }) => p.providerId === 'google.com',
    );
    const teacher: Teacher = {
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

    await setDoc(docRef, teacher);
    return teacher;
  },
};
