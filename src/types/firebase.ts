/**
 * Firebase Firestore Data Models for DropoutGuard
 * 
 * This file defines the TypeScript interfaces that match the Firestore database schema.
 * All timestamps are stored as Firestore Timestamps and converted to Date objects in the app.
 */

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// ENUMS
// ============================================================================

export type UserRole = 'student' | 'teacher' | 'admin';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type ResourceType = 'Video Course' | 'Exercises' | 'Community' | 'Mentorship' | 'Article' | 'Book';

// ============================================================================
// USER COLLECTION
// ============================================================================

/**
 * Users Collection: /users/{userId}
 * 
 * Stores user account information and authentication metadata
 */
export interface FirestoreUser {
  userId: string; // Document ID
  email: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
  studentId?: string; // Reference to student document (only for students)
  teacherId?: string; // Reference to teacher document (only for teachers)
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
  isActive: boolean;
}

// ============================================================================
// STUDENTS COLLECTION
// ============================================================================

/**
 * Students Collection: /students/{studentId}
 * 
 * Core student academic data and performance metrics
 */
export interface FirestoreStudent {
  studentId: string; // Document ID
  userId: string; // Reference to /users/{userId}
  name: string;
  email: string;
  avatar?: string;
  course: string;
  courseId?: string; // Reference to /courses/{courseId}
  
  // Academic Performance
  attendancePercentage: number; // 0-100
  quizScores: number[]; // Array of quiz scores (0-100)
  assignmentsSubmitted: number;
  totalAssignments: number;
  engagementScore: number; // 0-100, calculated metric
  
  // Risk Assessment
  riskLevel: RiskLevel;
  riskScore: number; // 0-100, calculated risk score
  riskFactors: string[]; // Array of identified risk factors
  lastRiskAssessmentAt: Timestamp;
  
  // Progress Tracking
  weeklyProgress: number[]; // Array of weekly progress percentages
  lastActive: Timestamp;
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  enrolledAt: Timestamp;
}

// ============================================================================
// TEACHERS COLLECTION
// ============================================================================

/**
 * Teachers Collection: /teachers/{teacherId}
 * 
 * Teacher profile and class management data
 */
export interface FirestoreTeacher {
  teacherId: string; // Document ID
  userId: string; // Reference to /users/{userId}
  name: string;
  email: string;
  photoURL?: string;
  department?: string;
  courses: string[]; // Array of course IDs
  studentIds: string[]; // Array of student IDs they teach
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// RECOVERY PLANS COLLECTION
// ============================================================================

/**
 * Recovery Plans Collection: /recoveryPlans/{planId}
 * 
 * AI-generated personalized recovery plans for at-risk students
 */
export interface FirestoreRecoveryPlan {
  planId: string; // Document ID
  studentId: string; // Reference to /students/{studentId}
  riskLevel: RiskLevel;
  
  // Weak Areas Identified
  weakTopics: string[];
  
  // Study Schedule
  dailyStudyHours: number;
  schedule: RecoveryPlanSchedule[];
  
  // Learning Resources
  resources: RecoveryPlanResource[];
  
  // Actionable Strategies
  strategies: string[];
  
  // AI Metadata
  generatedBy: 'ai' | 'manual'; // For MVP, will be 'manual' or mocked as 'ai'
  generatedAt: Timestamp;
  aiModel: string; // e.g., 'gemini-pro' (for future use)
  
  // Progress Tracking
  isActive: boolean;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  progressPercentage: number; // 0-100
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RecoveryPlanSchedule {
  day: string; // 'Monday', 'Tuesday', etc.
  focus: string; // What to focus on
  duration: string; // e.g., '2 hours'
  completed?: boolean; // For tracking
}

export interface RecoveryPlanResource {
  title: string;
  type: ResourceType;
  url: string;
  description?: string;
}

// ============================================================================
// COURSES COLLECTION
// ============================================================================

/**
 * Courses Collection: /courses/{courseId}
 * 
 * Course information and metadata
 */
export interface FirestoreCourse {
  courseId: string; // Document ID
  name: string;
  code: string; // e.g., 'CS101'
  description?: string;
  teacherId: string; // Reference to /teachers/{teacherId}
  studentIds: string[]; // Array of student IDs enrolled
  totalAssignments: number;
  totalQuizzes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// QUIZZES COLLECTION
// ============================================================================

/**
 * Quizzes Collection: /quizzes/{quizId}
 * 
 * Individual quiz records for detailed tracking
 */
export interface FirestoreQuiz {
  quizId: string; // Document ID
  courseId: string; // Reference to /courses/{courseId}
  title: string;
  maxScore: number;
  date: Timestamp;
  createdAt: Timestamp;
}

// ============================================================================
// QUIZ SCORES SUBCOLLECTION
// ============================================================================

/**
 * Quiz Scores Subcollection: /quizzes/{quizId}/scores/{scoreId}
 * 
 * Individual student scores for each quiz
 */
export interface FirestoreQuizScore {
  scoreId: string; // Document ID
  quizId: string; // Reference to /quizzes/{quizId}
  studentId: string; // Reference to /students/{studentId}
  score: number; // 0-100
  maxScore: number;
  submittedAt: Timestamp;
  createdAt: Timestamp;
}

// ============================================================================
// ASSIGNMENTS COLLECTION
// ============================================================================

/**
 * Assignments Collection: /assignments/{assignmentId}
 * 
 * Assignment records
 */
export interface FirestoreAssignment {
  assignmentId: string; // Document ID
  courseId: string; // Reference to /courses/{courseId}
  title: string;
  description?: string;
  dueDate: Timestamp;
  maxScore?: number;
  createdAt: Timestamp;
}

// ============================================================================
// ASSIGNMENT SUBMISSIONS SUBCOLLECTION
// ============================================================================

/**
 * Assignment Submissions Subcollection: /assignments/{assignmentId}/submissions/{submissionId}
 * 
 * Student assignment submissions
 */
export interface FirestoreAssignmentSubmission {
  submissionId: string; // Document ID
  assignmentId: string; // Reference to /assignments/{assignmentId}
  studentId: string; // Reference to /students/{studentId}
  submittedAt: Timestamp;
  score?: number;
  isLate: boolean;
  createdAt: Timestamp;
}

// ============================================================================
// ATTENDANCE COLLECTION
// ============================================================================

/**
 * Attendance Records Collection: /attendance/{attendanceId}
 * 
 * Daily attendance tracking
 */
export interface FirestoreAttendance {
  attendanceId: string; // Document ID
  studentId: string; // Reference to /students/{studentId}
  courseId: string; // Reference to /courses/{courseId}
  date: Timestamp; // Date of attendance
  status: 'present' | 'absent' | 'late' | 'excused';
  createdAt: Timestamp;
}

// ============================================================================
// NOTIFICATIONS COLLECTION
// ============================================================================

/**
 * Notifications Collection: /notifications/{notificationId}
 * 
 * System notifications for teachers and students
 */
export interface FirestoreNotification {
  notificationId: string; // Document ID
  userId: string; // Reference to /users/{userId}
  type: 'risk_alert' | 'recovery_plan' | 'assignment_due' | 'attendance_warning' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  studentId?: string; // For teacher notifications about specific students
  createdAt: Timestamp;
  readAt?: Timestamp;
}

// ============================================================================
// AI ANALYSIS COLLECTION (Future Enhancement)
// ============================================================================

/**
 * AI Analysis Collection: /aiAnalysis/{analysisId}
 * 
 * Stores AI-generated risk assessments and recommendations
 * (For future Gemini integration)
 */
export interface FirestoreAIAnalysis {
  analysisId: string; // Document ID
  studentId: string; // Reference to /students/{studentId}
  riskLevel: RiskLevel;
  riskScore: number;
  riskFactors: string[];
  recommendations: string[];
  aiModel: string; // e.g., 'gemini-pro'
  promptUsed?: string; // For debugging/transparency
  responseRaw?: string; // Raw AI response
  createdAt: Timestamp;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Helper type for documents with IDs (common pattern in Firestore)
 */
export interface WithId<T> {
  id: string;
  data: T;
}

/**
 * Query options for Firestore queries
 */
export interface QueryOptions {
  limit?: number;
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  where?: {
    field: string;
    operator: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any';
    value: any;
  }[];
}

