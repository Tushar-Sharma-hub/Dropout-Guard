/**
 * Firebase Recovery Plans Service
 * 
 * Handles recovery plan creation, retrieval, and management
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
  FirestoreRecoveryPlan,
  FirestoreStudent,
  RiskLevel,
} from '@/types/firebase';
import { getStudent } from './students';
import { generateRecoveryPlanWithGemini, isGeminiConfigured } from './gemini';

const RECOVERY_PLANS_COLLECTION = 'recoveryPlans';

/**
 * Get a recovery plan by ID
 */
export const getRecoveryPlan = async (planId: string): Promise<FirestoreRecoveryPlan | null> => {
  try {
    const planDoc = await getDoc(doc(db, RECOVERY_PLANS_COLLECTION, planId));
    if (!planDoc.exists()) {
      return null;
    }
    return {
      planId: planDoc.id,
      ...planDoc.data(),
    } as FirestoreRecoveryPlan;
  } catch (error) {
    console.error('Get recovery plan error:', error);
    throw error;
  }
};

/**
 * Get recovery plan for a student
 */
export const getRecoveryPlanByStudentId = async (
  studentId: string
): Promise<FirestoreRecoveryPlan | null> => {
  try {
    const q = query(
      collection(db, RECOVERY_PLANS_COLLECTION),
      where('studentId', '==', studentId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return {
      planId: doc.id,
      ...doc.data(),
    } as FirestoreRecoveryPlan;
  } catch (error) {
    console.error('Get recovery plan by student ID error:', error);
    throw error;
  }
};

/**
 * Get all recovery plans for a student (including inactive)
 */
export const getAllRecoveryPlansByStudentId = async (
  studentId: string
): Promise<FirestoreRecoveryPlan[]> => {
  try {
    const q = query(
      collection(db, RECOVERY_PLANS_COLLECTION),
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      planId: doc.id,
      ...doc.data(),
    })) as FirestoreRecoveryPlan[];
  } catch (error) {
    console.error('Get all recovery plans by student ID error:', error);
    throw error;
  }
};

/**
 * Generate a recovery plan for a student
 * 
 * Uses Gemini AI if configured, otherwise falls back to mock logic
 */
export const generateRecoveryPlan = async (
  studentId: string
): Promise<string> => {
  try {
    const student = await getStudent(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    // Check if there's an active plan
    const existingPlan = await getRecoveryPlanByStudentId(studentId);
    if (existingPlan) {
      // Deactivate existing plan
      await updateRecoveryPlan(existingPlan.planId, { isActive: false });
    }

    let plan: Omit<FirestoreRecoveryPlan, 'planId' | 'studentId' | 'riskLevel' | 'generatedBy' | 'generatedAt' | 'isActive' | 'progressPercentage' | 'createdAt' | 'updatedAt'>;
    let generatedBy: 'ai' | 'manual' = 'manual';
    let aiModel: string | undefined = undefined;

    // Try to use Gemini AI if configured
    if (isGeminiConfigured()) {
      try {
        console.log(`🤖 Generating recovery plan for ${student.name} using Gemini AI...`);
        const geminiPlan = await generateRecoveryPlanWithGemini(student);
        plan = geminiPlan;
        generatedBy = 'ai';
        aiModel = 'gemini-pro';
        console.log(`✅ Successfully generated AI recovery plan for ${student.name}`);
      } catch (geminiError: any) {
        console.warn(`⚠️  Gemini AI generation failed: ${geminiError.message}`);
        console.log('📝 Falling back to mock recovery plan generation...');
        // Fallback to mock logic if Gemini fails
        plan = createRecoveryPlanFromStudent(student);
      }
    } else {
      // Use mock logic if Gemini is not configured
      console.log(`📝 Generating recovery plan for ${student.name} using mock logic...`);
      plan = createRecoveryPlanFromStudent(student);
    }

    // Create new plan document
    const planRef = doc(collection(db, RECOVERY_PLANS_COLLECTION));
    const now = Timestamp.now();

    const planData: any = {
      ...plan,
      planId: planRef.id,
      studentId,
      riskLevel: student.riskLevel,
      generatedBy,
      generatedAt: now,
      isActive: true,
      progressPercentage: 0,
      createdAt: now,
      updatedAt: now,
    };

    // Only add aiModel if it was used
    if (aiModel) {
      planData.aiModel = aiModel;
    }

    await setDoc(planRef, planData);

    return planRef.id;
  } catch (error) {
    console.error('Generate recovery plan error:', error);
    throw error;
  }
};

/**
 * Create recovery plan data from student information
 * (Mock AI logic for MVP)
 */
const createRecoveryPlanFromStudent = (
  student: FirestoreStudent
): Omit<FirestoreRecoveryPlan, 'planId' | 'studentId' | 'riskLevel' | 'generatedBy' | 'generatedAt' | 'isActive' | 'progressPercentage' | 'createdAt' | 'updatedAt'> => {
  // Determine weak topics based on risk level and performance
  const weakTopics: string[] = [];
  if (student.attendancePercentage < 70) {
    weakTopics.push('Attendance & Consistency');
  }
  if (student.quizScores.length > 0) {
    const avgScore = student.quizScores.reduce((a, b) => a + b, 0) / student.quizScores.length;
    if (avgScore < 60) {
      weakTopics.push('Fundamental Concepts');
      weakTopics.push('Problem Solving');
    }
  }
  if (student.engagementScore < 50) {
    weakTopics.push('Study Habits');
    weakTopics.push('Time Management');
  }
  if (weakTopics.length === 0) {
    weakTopics.push('Advanced Topics');
    weakTopics.push('Optimization');
  }

  // Determine daily study hours based on risk level
  const dailyStudyHours = student.riskLevel === 'High' ? 4 : student.riskLevel === 'Medium' ? 3 : 2;

  // Create weekly schedule
  const schedule = [
    { day: 'Monday', focus: 'Review fundamentals', duration: `${Math.ceil(dailyStudyHours * 0.5)} hours`, completed: false },
    { day: 'Tuesday', focus: 'Practice problems', duration: `${Math.ceil(dailyStudyHours * 0.5)} hours`, completed: false },
    { day: 'Wednesday', focus: 'Concept clarification', duration: `${Math.ceil(dailyStudyHours * 0.4)} hours`, completed: false },
    { day: 'Thursday', focus: 'Group study session', duration: `${Math.ceil(dailyStudyHours * 0.5)} hours`, completed: false },
    { day: 'Friday', focus: 'Mock tests', duration: `${Math.ceil(dailyStudyHours * 0.4)} hours`, completed: false },
    { day: 'Weekend', focus: 'Self-assessment & revision', duration: `${Math.ceil(dailyStudyHours * 1.5)} hours`, completed: false },
  ];

  // Learning resources
  const resources = [
    { title: 'Khan Academy - Core Concepts', type: 'Video Course' as const, url: '#', description: 'Comprehensive video tutorials' },
    { title: 'Practice Problem Set', type: 'Exercises' as const, url: '#', description: 'Hands-on practice exercises' },
    { title: 'Study Group Discord', type: 'Community' as const, url: '#', description: 'Connect with peers' },
    { title: 'Office Hours with TA', type: 'Mentorship' as const, url: '#', description: 'Get personalized help' },
  ];

  // Actionable strategies
  const strategies = [
    'Break study sessions into 25-minute focused blocks (Pomodoro technique)',
    'Review notes within 24 hours of each lecture',
    'Form a study group with 2-3 classmates',
    'Use active recall instead of passive reading',
    'Attend all office hours for difficult topics',
    student.attendancePercentage < 70 ? 'Set daily reminders for class attendance' : '',
    student.engagementScore < 50 ? 'Reduce distractions during study time' : '',
  ].filter(Boolean) as string[];

  return {
    weakTopics,
    dailyStudyHours,
    schedule,
    resources,
    strategies,
  };
};

/**
 * Create a recovery plan
 */
export const createRecoveryPlan = async (
  planData: Omit<FirestoreRecoveryPlan, 'planId' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const planRef = doc(collection(db, RECOVERY_PLANS_COLLECTION));
    const now = Timestamp.now();

    await setDoc(planRef, {
      ...planData,
      planId: planRef.id,
      createdAt: now,
      updatedAt: now,
    });

    return planRef.id;
  } catch (error) {
    console.error('Create recovery plan error:', error);
    throw error;
  }
};

/**
 * Update a recovery plan
 */
export const updateRecoveryPlan = async (
  planId: string,
  updates: Partial<Omit<FirestoreRecoveryPlan, 'planId' | 'createdAt'>>
): Promise<void> => {
  try {
    await updateDoc(doc(db, RECOVERY_PLANS_COLLECTION, planId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Update recovery plan error:', error);
    throw error;
  }
};

/**
 * Delete a recovery plan
 */
export const deleteRecoveryPlan = async (planId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, RECOVERY_PLANS_COLLECTION, planId));
  } catch (error) {
    console.error('Delete recovery plan error:', error);
    throw error;
  }
};

/**
 * Mark recovery plan schedule item as completed
 */
export const markScheduleItemCompleted = async (
  planId: string,
  dayIndex: number,
  completed: boolean
): Promise<void> => {
  try {
    const plan = await getRecoveryPlan(planId);
    if (!plan) {
      throw new Error('Recovery plan not found');
    }

    const updatedSchedule = [...plan.schedule];
    if (updatedSchedule[dayIndex]) {
      updatedSchedule[dayIndex].completed = completed;
    }

    // Calculate progress percentage
    const completedCount = updatedSchedule.filter((item) => item.completed).length;
    const progressPercentage = (completedCount / updatedSchedule.length) * 100;

    await updateRecoveryPlan(planId, {
      schedule: updatedSchedule,
      progressPercentage,
    });
  } catch (error) {
    console.error('Mark schedule item completed error:', error);
    throw error;
  }
};

