import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChange, signIn as firebaseSignIn, signOutUser as firebaseSignOut, getUserData } from '@/lib/firebase/auth';
import { getStudentByUserId, getStudent } from '@/lib/firebase/students';
import { getTeacherByUserId } from '@/lib/firebase/teachers';
import { FirestoreUser, FirestoreStudent } from '@/types/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'student' | 'teacher';

export interface User {
  email: string;
  role: UserRole;
  studentId?: string; // Only for students
  userId: string; // Firebase Auth UID
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  currentStudent: FirestoreStudent | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentStudent, setCurrentStudent] = useState<FirestoreStudent | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    let isMounted = true;

    try {
      const unsubscribe = onAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
        if (!isMounted) return;

        if (firebaseUser) {
          try {
            // Get user data from Firestore
            const firestoreUser = await getUserData(firebaseUser.uid);
            if (firestoreUser && isMounted) {
              const appUser: User = {
                email: firestoreUser.email,
                role: firestoreUser.role as UserRole,
                userId: firebaseUser.uid,
                studentId: firestoreUser.studentId,
              };
              setUser(appUser);

              // Load student data if user is a student
              if (firestoreUser.role === 'student' && firestoreUser.studentId) {
                const student = await getStudent(firestoreUser.studentId);
                if (isMounted) {
                  setCurrentStudent(student);
                }
              } else {
                setCurrentStudent(null);
              }
            }
          } catch (error) {
            console.error('Error loading user data:', error);
            if (isMounted) {
              setUser(null);
              setCurrentStudent(null);
            }
          }
        } else {
          if (isMounted) {
            setUser(null);
            setCurrentStudent(null);
          }
        }
        if (isMounted) {
          setLoading(false);
        }
      });

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Sign in with Firebase
      const result = await firebaseSignIn(email, password);
      
      if (!result) {
        return false;
      }

      const { firestoreUser } = result;

      // Verify role matches
      if (firestoreUser.role !== role) {
        await firebaseSignOut();
        throw new Error('role-mismatch');
      }

      // User is set via auth state listener
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      // Re-throw the error so the Login component can handle it properly
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear state first to prevent white screen
      setUser(null);
      setCurrentStudent(null);
      // Then sign out from Firebase
      await firebaseSignOut();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if Firebase sign out fails, clear local state
      setUser(null);
      setCurrentStudent(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      currentStudent,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
