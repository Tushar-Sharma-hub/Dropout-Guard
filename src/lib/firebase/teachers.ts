/**
 * Firebase Teachers Service
 * 
 * Handles teacher-related Firestore operations
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
import { FirestoreTeacher } from '@/types/firebase';

const TEACHERS_COLLECTION = 'teachers';

/**
 * Get a teacher by ID
 */
export const getTeacher = async (teacherId: string): Promise<FirestoreTeacher | null> => {
  try {
    const teacherDoc = await getDoc(doc(db, TEACHERS_COLLECTION, teacherId));
    if (!teacherDoc.exists()) {
      return null;
    }
    return {
      teacherId: teacherDoc.id,
      ...teacherDoc.data(),
    } as FirestoreTeacher;
  } catch (error) {
    console.error('Get teacher error:', error);
    throw error;
  }
};

/**
 * Get teacher by userId
 */
export const getTeacherByUserId = async (userId: string): Promise<FirestoreTeacher | null> => {
  try {
    const q = query(
      collection(db, TEACHERS_COLLECTION),
      where('userId', '==', userId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return {
      teacherId: doc.id,
      ...doc.data(),
    } as FirestoreTeacher;
  } catch (error) {
    console.error('Get teacher by userId error:', error);
    throw error;
  }
};

/**
 * Get all teachers
 */
export const getAllTeachers = async (): Promise<FirestoreTeacher[]> => {
  try {
    const q = query(collection(db, TEACHERS_COLLECTION), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      teacherId: doc.id,
      ...doc.data(),
    })) as FirestoreTeacher[];
  } catch (error) {
    console.error('Get all teachers error:', error);
    throw error;
  }
};

/**
 * Create a new teacher
 */
export const createTeacher = async (
  teacherData: Omit<FirestoreTeacher, 'teacherId' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const teacherRef = doc(collection(db, TEACHERS_COLLECTION));
    const now = Timestamp.now();
    
    await setDoc(teacherRef, {
      ...teacherData,
      createdAt: now,
      updatedAt: now,
    });

    return teacherRef.id;
  } catch (error) {
    console.error('Create teacher error:', error);
    throw error;
  }
};

/**
 * Update a teacher
 */
export const updateTeacher = async (
  teacherId: string,
  updates: Partial<Omit<FirestoreTeacher, 'teacherId' | 'createdAt'>>
): Promise<void> => {
  try {
    await updateDoc(doc(db, TEACHERS_COLLECTION, teacherId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    throw error;
  }
};

/**
 * Add student to teacher's class
 */
export const addStudentToTeacher = async (
  teacherId: string,
  studentId: string
): Promise<void> => {
  try {
    const teacher = await getTeacher(teacherId);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    if (!teacher.studentIds.includes(studentId)) {
      await updateTeacher(teacherId, {
        studentIds: [...teacher.studentIds, studentId],
      });
    }
  } catch (error) {
    console.error('Add student to teacher error:', error);
    throw error;
  }
};

/**
 * Remove student from teacher's class
 */
export const removeStudentFromTeacher = async (
  teacherId: string,
  studentId: string
): Promise<void> => {
  try {
    const teacher = await getTeacher(teacherId);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    await updateTeacher(teacherId, {
      studentIds: teacher.studentIds.filter((id) => id !== studentId),
    });
  } catch (error) {
    console.error('Remove student from teacher error:', error);
    throw error;
  }
};

