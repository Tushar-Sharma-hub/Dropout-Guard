/**
 * Firebase Authentication Service
 * 
 * Handles user authentication, role management, and session management
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { FirestoreUser, UserRole } from '@/types/firebase';

/**
 * Sign in with email and password
 */
export const signIn = async (
  email: string,
  password: string
): Promise<{ user: FirebaseUser; firestoreUser: FirestoreUser } | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firestoreUser = await getUserData(userCredential.user.uid);
    
    if (!firestoreUser) {
      throw new Error('User data not found in Firestore');
    }

    // Update last login timestamp
    try {
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLoginAt: new Date(),
      });
    } catch (updateError) {
      // Non-critical error, continue
      console.warn('Failed to update last login timestamp:', updateError);
    }

    return {
      user: userCredential.user,
      firestoreUser,
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    // Preserve Firebase error codes for better error handling
    if (error.code) {
      const authError: any = new Error(error.message || 'Failed to sign in');
      authError.code = error.code;
      throw authError;
    }
    // If it's already an Error object, throw it as-is
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error.message || 'Failed to sign in');
  }
};

/**
 * Sign up new user
 */
export const signUp = async (
  email: string,
  password: string,
  displayName: string,
  role: UserRole,
  additionalData?: {
    studentId?: string;
    teacherId?: string;
  }
): Promise<{ user: FirebaseUser; firestoreUser: FirestoreUser }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update Firebase Auth profile
    await updateProfile(userCredential.user, {
      displayName,
    });

    // Create Firestore user document
    const firestoreUserData: Omit<FirestoreUser, 'userId'> = {
      email,
      role,
      displayName,
      studentId: additionalData?.studentId,
      teacherId: additionalData?.teacherId,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
      isActive: true,
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      ...firestoreUserData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const firestoreUser: FirestoreUser = {
      userId: userCredential.user.uid,
      ...firestoreUserData,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    };

    return {
      user: userCredential.user,
      firestoreUser,
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Export as signOut for convenience
export const signOut = signOutUser;

/**
 * Get user data from Firestore
 */
export const getUserData = async (userId: string): Promise<FirestoreUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return null;
    }
    return {
      userId: userDoc.id,
      ...userDoc.data(),
    } as FirestoreUser;
  } catch (error) {
    console.error('Get user data error:', error);
    return null;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (
  callback: (user: FirebaseUser | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<FirestoreUser>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error: any) {
    console.error('Update user profile error:', error);
    throw new Error(error.message || 'Failed to update user profile');
  }
};

