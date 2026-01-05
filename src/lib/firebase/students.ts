/**
 * Firebase Students Service
 * 
 * Handles all student-related Firestore operations
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import {
  FirestoreStudent,
  RiskLevel,
  QueryOptions,
} from '@/types/firebase';

const STUDENTS_COLLECTION = 'students';

/**
 * Get a single student by ID
 */
export const getStudent = async (studentId: string): Promise<FirestoreStudent | null> => {
  try {
    const studentDoc = await getDoc(doc(db, STUDENTS_COLLECTION, studentId));
    if (!studentDoc.exists()) {
      return null;
    }
    return {
      studentId: studentDoc.id,
      ...studentDoc.data(),
    } as FirestoreStudent;
  } catch (error) {
    console.error('Get student error:', error);
    throw error;
  }
};

/**
 * Get student by userId
 */
export const getStudentByUserId = async (userId: string): Promise<FirestoreStudent | null> => {
  try {
    const q = query(
      collection(db, STUDENTS_COLLECTION),
      where('userId', '==', userId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return {
      studentId: doc.id,
      ...doc.data(),
    } as FirestoreStudent;
  } catch (error) {
    console.error('Get student by userId error:', error);
    throw error;
  }
};

/**
 * Get all students
 */
export const getAllStudents = async (options?: QueryOptions): Promise<FirestoreStudent[]> => {
  try {
    let q = query(collection(db, STUDENTS_COLLECTION));

    // Apply where clauses
    if (options?.where) {
      options.where.forEach((condition) => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
    }

    // Apply ordering
    if (options?.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
    } else {
      // Default ordering by name
      q = query(q, orderBy('name', 'asc'));
    }

    // Apply limit
    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      studentId: doc.id,
      ...doc.data(),
    })) as FirestoreStudent[];
  } catch (error) {
    console.error('Get all students error:', error);
    throw error;
  }
};

/**
 * Get students by risk level
 */
export const getStudentsByRiskLevel = async (riskLevel: RiskLevel): Promise<FirestoreStudent[]> => {
  return getAllStudents({
    where: [{ field: 'riskLevel', operator: '==', value: riskLevel }],
    orderBy: { field: 'riskScore', direction: 'desc' },
  });
};

/**
 * Get high-risk students
 */
export const getHighRiskStudents = async (): Promise<FirestoreStudent[]> => {
  return getStudentsByRiskLevel('High');
};

/**
 * Create a new student
 */
export const createStudent = async (
  studentData: Omit<FirestoreStudent, 'studentId' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const studentRef = doc(collection(db, STUDENTS_COLLECTION));
    const now = Timestamp.now();
    
    await setDoc(studentRef, {
      ...studentData,
      createdAt: now,
      updatedAt: now,
      enrolledAt: studentData.enrolledAt || now,
      lastActive: studentData.lastActive || now,
      lastRiskAssessmentAt: now,
    });

    return studentRef.id;
  } catch (error) {
    console.error('Create student error:', error);
    throw error;
  }
};

/**
 * Update a student
 */
export const updateStudent = async (
  studentId: string,
  updates: Partial<Omit<FirestoreStudent, 'studentId' | 'createdAt'>>
): Promise<void> => {
  try {
    await updateDoc(doc(db, STUDENTS_COLLECTION, studentId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Update student error:', error);
    throw error;
  }
};

/**
 * Delete a student
 */
export const deleteStudent = async (studentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, STUDENTS_COLLECTION, studentId));
  } catch (error) {
    console.error('Delete student error:', error);
    throw error;
  }
};

/**
 * Calculate and update student risk level
 */
export const calculateRiskLevel = (student: FirestoreStudent): {
  riskLevel: RiskLevel;
  riskScore: number;
  riskFactors: string[];
} => {
  const riskFactors: string[] = [];
  let riskScore = 0;

  // Attendance factor (0-30 points)
  if (student.attendancePercentage < 60) {
    riskScore += 30;
    riskFactors.push('Low attendance');
  } else if (student.attendancePercentage < 75) {
    riskScore += 15;
    riskFactors.push('Below average attendance');
  }

  // Quiz scores factor (0-30 points)
  const avgQuizScore = student.quizScores.length > 0
    ? student.quizScores.reduce((a, b) => a + b, 0) / student.quizScores.length
    : 0;
  if (avgQuizScore < 50) {
    riskScore += 30;
    riskFactors.push('Poor quiz performance');
  } else if (avgQuizScore < 65) {
    riskScore += 15;
    riskFactors.push('Below average quiz scores');
  }

  // Assignment completion factor (0-20 points)
  const completionRate = student.totalAssignments > 0
    ? (student.assignmentsSubmitted / student.totalAssignments) * 100
    : 0;
  if (completionRate < 50) {
    riskScore += 20;
    riskFactors.push('Low assignment completion');
  } else if (completionRate < 70) {
    riskScore += 10;
    riskFactors.push('Below average assignment completion');
  }

  // Engagement factor (0-20 points)
  if (student.engagementScore < 40) {
    riskScore += 20;
    riskFactors.push('Low engagement');
  } else if (student.engagementScore < 60) {
    riskScore += 10;
    riskFactors.push('Below average engagement');
  }

  // Determine risk level
  let riskLevel: RiskLevel;
  if (riskScore >= 70) {
    riskLevel = 'High';
  } else if (riskScore >= 40) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'Low';
  }

  return {
    riskLevel,
    riskScore: Math.min(100, riskScore),
    riskFactors,
  };
};

/**
 * Update student risk assessment
 */
export const updateStudentRiskAssessment = async (studentId: string): Promise<void> => {
  try {
    const student = await getStudent(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const riskAssessment = calculateRiskLevel(student);
    
    await updateStudent(studentId, {
      riskLevel: riskAssessment.riskLevel,
      riskScore: riskAssessment.riskScore,
      riskFactors: riskAssessment.riskFactors,
      lastRiskAssessmentAt: Timestamp.now() as any,
    });
  } catch (error) {
    console.error('Update risk assessment error:', error);
    throw error;
  }
};

/**
 * Get risk statistics
 */
export const getRiskStats = async (): Promise<{
  total: number;
  high: number;
  medium: number;
  low: number;
}> => {
  try {
    const students = await getAllStudents();
    return {
      total: students.length,
      high: students.filter((s) => s.riskLevel === 'High').length,
      medium: students.filter((s) => s.riskLevel === 'Medium').length,
      low: students.filter((s) => s.riskLevel === 'Low').length,
    };
  } catch (error) {
    console.error('Get risk stats error:', error);
    throw error;
  }
};

