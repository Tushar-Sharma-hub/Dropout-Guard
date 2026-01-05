import { createContext, useContext, useState, ReactNode } from 'react';
import { Student, mockStudents } from '@/data/mockStudents';

export type UserRole = 'student' | 'teacher';

export interface User {
  email: string;
  role: UserRole;
  studentId?: string; // Only for students
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  currentStudent: Student | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers = {
  teachers: ['teacher@dropoutguard.edu', 'admin@dropoutguard.edu'],
  students: mockStudents.map(s => ({ email: s.email, studentId: s.studentId })),
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('dropoutguard_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock authentication - accept any password for demo
    if (password.length < 4) return false;

    if (role === 'teacher') {
      // For demo, accept any email with teacher role
      const newUser: User = { email, role: 'teacher' };
      setUser(newUser);
      sessionStorage.setItem('dropoutguard_user', JSON.stringify(newUser));
      return true;
    } else {
      // For students, try to match with mock data or assign first high-risk student for demo
      const matchedStudent = mockUsers.students.find(s => s.email.toLowerCase() === email.toLowerCase());
      const studentId = matchedStudent?.studentId || 'STU001'; // Default to first high-risk student for demo
      
      const newUser: User = { email, role: 'student', studentId };
      setUser(newUser);
      sessionStorage.setItem('dropoutguard_user', JSON.stringify(newUser));
      return true;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('dropoutguard_user');
  };

  const currentStudent = user?.role === 'student' && user.studentId
    ? mockStudents.find(s => s.studentId === user.studentId) || null
    : null;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      currentStudent,
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
