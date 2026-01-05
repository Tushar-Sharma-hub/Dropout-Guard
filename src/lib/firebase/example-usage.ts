/**
 * Example Usage of Firebase Backend Services
 * 
 * This file demonstrates how to use the Firebase backend services
 * in your React components. Copy and adapt these patterns as needed.
 */

// ============================================================================
// AUTHENTICATION EXAMPLES
// ============================================================================

import { signIn, signUp, signOut, getUserData, onAuthStateChange } from '@/lib/firebase/auth';

// Example 1: Sign in a user
export async function exampleSignIn() {
  try {
    const result = await signIn('teacher@dropoutguard.edu', 'teacher123');
    console.log('Signed in:', result.user.email);
    console.log('User role:', result.firestoreUser.role);
    return result;
  } catch (error) {
    console.error('Sign in failed:', error);
    throw error;
  }
}

// Example 2: Sign up a new user
export async function exampleSignUp() {
  try {
    const result = await signUp(
      'newstudent@university.edu',
      'password123',
      'New Student',
      'student',
      { studentId: 'STU011' } // Optional: link to existing student
    );
    console.log('User created:', result.user.uid);
    return result;
  } catch (error) {
    console.error('Sign up failed:', error);
    throw error;
  }
}

// Example 3: Monitor auth state changes
export function exampleAuthStateListener() {
  const unsubscribe = onAuthStateChange((user) => {
    if (user) {
      console.log('User is signed in:', user.email);
      // Fetch user data
      getUserData(user.uid).then((userData) => {
        console.log('User data:', userData);
      });
    } else {
      console.log('User is signed out');
    }
  });

  // Return unsubscribe function to clean up
  return unsubscribe;
}

// Example 4: Sign out
export async function exampleSignOut() {
  try {
    await signOut();
    console.log('Signed out successfully');
  } catch (error) {
    console.error('Sign out failed:', error);
  }
}

// ============================================================================
// STUDENT DATA EXAMPLES
// ============================================================================

import {
  getStudent,
  getAllStudents,
  getHighRiskStudents,
  getStudentsByRiskLevel,
  updateStudent,
  calculateRiskLevel,
  getRiskStats,
} from '@/lib/firebase/students';

// Example 5: Get all students
export async function exampleGetAllStudents() {
  try {
    const students = await getAllStudents();
    console.log(`Found ${students.length} students`);
    return students;
  } catch (error) {
    console.error('Failed to fetch students:', error);
    throw error;
  }
}

// Example 6: Get high-risk students
export async function exampleGetHighRiskStudents() {
  try {
    const highRiskStudents = await getHighRiskStudents();
    console.log(`Found ${highRiskStudents.length} high-risk students`);
    return highRiskStudents;
  } catch (error) {
    console.error('Failed to fetch high-risk students:', error);
    throw error;
  }
}

// Example 7: Get student by ID
export async function exampleGetStudent(studentId: string) {
  try {
    const student = await getStudent(studentId);
    if (student) {
      console.log('Student:', student.name, '- Risk:', student.riskLevel);
      return student;
    } else {
      console.log('Student not found');
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch student:', error);
    throw error;
  }
}

// Example 8: Update student data
export async function exampleUpdateStudent(studentId: string) {
  try {
    await updateStudent(studentId, {
      attendancePercentage: 85,
      engagementScore: 75,
    });
    console.log('Student updated successfully');
  } catch (error) {
    console.error('Failed to update student:', error);
    throw error;
  }
}

// Example 9: Get risk statistics
export async function exampleGetRiskStats() {
  try {
    const stats = await getRiskStats();
    console.log('Risk Statistics:', stats);
    return stats;
  } catch (error) {
    console.error('Failed to fetch risk stats:', error);
    throw error;
  }
}

// ============================================================================
// RECOVERY PLAN EXAMPLES
// ============================================================================

import {
  generateRecoveryPlan,
  getRecoveryPlanByStudentId,
  updateRecoveryPlan,
  markScheduleItemCompleted,
} from '@/lib/firebase/recoveryPlans';

// Example 10: Generate recovery plan for a student
export async function exampleGenerateRecoveryPlan(studentId: string) {
  try {
    const planId = await generateRecoveryPlan(studentId);
    console.log('Recovery plan generated:', planId);
    return planId;
  } catch (error) {
    console.error('Failed to generate recovery plan:', error);
    throw error;
  }
}

// Example 11: Get student's recovery plan
export async function exampleGetRecoveryPlan(studentId: string) {
  try {
    const plan = await getRecoveryPlanByStudentId(studentId);
    if (plan) {
      console.log('Recovery plan found:', plan.planId);
      console.log('Weak topics:', plan.weakTopics);
      console.log('Daily study hours:', plan.dailyStudyHours);
      return plan;
    } else {
      console.log('No active recovery plan found');
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch recovery plan:', error);
    throw error;
  }
}

// Example 12: Mark schedule item as completed
export async function exampleMarkScheduleComplete(planId: string, dayIndex: number) {
  try {
    await markScheduleItemCompleted(planId, dayIndex, true);
    console.log('Schedule item marked as completed');
  } catch (error) {
    console.error('Failed to update schedule:', error);
    throw error;
  }
}

// ============================================================================
// NOTIFICATION EXAMPLES
// ============================================================================

import {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  createRiskAlertNotification,
  getUnreadNotificationCount,
} from '@/lib/firebase/notifications';

// Example 13: Get user notifications
export async function exampleGetNotifications(userId: string) {
  try {
    const notifications = await getNotificationsByUserId(userId, {
      unreadOnly: true,
      limit: 10,
    });
    console.log(`Found ${notifications.length} unread notifications`);
    return notifications;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw error;
  }
}

// Example 14: Create risk alert notification
export async function exampleCreateRiskAlert(
  teacherUserId: string,
  studentId: string,
  studentName: string
) {
  try {
    const notificationId = await createRiskAlertNotification(
      teacherUserId,
      studentId,
      studentName,
      'High'
    );
    console.log('Risk alert created:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Failed to create risk alert:', error);
    throw error;
  }
}

// Example 15: Mark notification as read
export async function exampleMarkNotificationRead(notificationId: string) {
  try {
    await markNotificationAsRead(notificationId);
    console.log('Notification marked as read');
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
}

// ============================================================================
// REACT HOOK EXAMPLES
// ============================================================================

/**
 * Example React Hook: Use Students
 * 
 * This shows how to create a custom hook for fetching students
 */
import { useState, useEffect } from 'react';
import { FirestoreStudent } from '@/types/firebase';

export function useStudents() {
  const [students, setStudents] = useState<FirestoreStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const data = await getAllStudents();
        setStudents(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  return { students, loading, error };
}

/**
 * Example React Hook: Use Student Recovery Plan
 */
import { FirestoreRecoveryPlan } from '@/types/firebase';

export function useRecoveryPlan(studentId: string) {
  const [plan, setPlan] = useState<FirestoreRecoveryPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPlan() {
      try {
        setLoading(true);
        const data = await getRecoveryPlanByStudentId(studentId);
        setPlan(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (studentId) {
      fetchPlan();
    }
  }, [studentId]);

  return { plan, loading, error };
}

// ============================================================================
// INTEGRATION WITH REACT QUERY
// ============================================================================

/**
 * Example: Using React Query for data fetching
 * 
 * This shows how to use the Firebase services with React Query
 * for better caching and state management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useStudentsQuery() {
  return useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
  });
}

export function useStudentQuery(studentId: string) {
  return useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudent(studentId),
    enabled: !!studentId,
  });
}

export function useRecoveryPlanQuery(studentId: string) {
  return useQuery({
    queryKey: ['recoveryPlan', studentId],
    queryFn: () => getRecoveryPlanByStudentId(studentId),
    enabled: !!studentId,
  });
}

export function useGenerateRecoveryPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateRecoveryPlan,
    onSuccess: (planId, studentId) => {
      // Invalidate and refetch recovery plan
      queryClient.invalidateQueries({ queryKey: ['recoveryPlan', studentId] });
    },
  });
}

