/**
 * Firebase Seed Data Script
 * 
 * This script populates Firestore with initial demo data for DropoutGuard.
 * Run this script after setting up your Firebase project.
 * 
 * Usage:
 *   npx tsx scripts/seedFirebase.ts
 * 
 * Or with ts-node:
 *   ts-node scripts/seedFirebase.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, Timestamp, query, where, limit, getDocs } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase configuration (should match your .env file)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Mock student data (matching the existing mockStudents.ts structure)
const mockStudentsData = [
  {
    studentId: 'STU001',
    name: 'Marcus Chen',
    email: 'marcus.chen@university.edu',
    avatar: 'MC',
    attendancePercentage: 45,
    quizScores: [42, 38, 35, 40, 32, 28, 25, 30],
    assignmentsSubmitted: 3,
    totalAssignments: 10,
    engagementScore: 25,
    riskLevel: 'High' as const,
    course: 'Data Structures',
    weeklyProgress: [45, 42, 38, 35, 32, 28, 25, 22, 20, 18, 15, 12],
  },
  {
    studentId: 'STU002',
    name: 'Priya Patel',
    email: 'priya.patel@university.edu',
    avatar: 'PP',
    attendancePercentage: 52,
    quizScores: [55, 48, 42, 38, 35, 30, 28, 25],
    assignmentsSubmitted: 4,
    totalAssignments: 10,
    engagementScore: 30,
    riskLevel: 'High' as const,
    course: 'Machine Learning Basics',
    weeklyProgress: [52, 48, 45, 42, 38, 35, 32, 28, 25, 22, 20, 18],
  },
  {
    studentId: 'STU003',
    name: 'Emma Johnson',
    email: 'emma.johnson@university.edu',
    avatar: 'EJ',
    attendancePercentage: 68,
    quizScores: [65, 58, 62, 55, 60, 52, 58, 55],
    assignmentsSubmitted: 6,
    totalAssignments: 10,
    engagementScore: 55,
    riskLevel: 'Medium' as const,
    course: 'Web Development',
    weeklyProgress: [68, 65, 62, 60, 58, 55, 52, 50, 48, 50, 52, 55],
  },
  {
    studentId: 'STU004',
    name: 'David Kim',
    email: 'david.kim@university.edu',
    avatar: 'DK',
    attendancePercentage: 72,
    quizScores: [70, 62, 58, 65, 55, 60, 52, 58],
    assignmentsSubmitted: 7,
    totalAssignments: 10,
    engagementScore: 58,
    riskLevel: 'Medium' as const,
    course: 'Computer Science 101',
    weeklyProgress: [72, 70, 68, 65, 62, 60, 58, 55, 57, 60, 62, 65],
  },
  {
    studentId: 'STU005',
    name: 'Sofia Rodriguez',
    email: 'sofia.rodriguez@university.edu',
    avatar: 'SR',
    attendancePercentage: 65,
    quizScores: [58, 55, 60, 52, 58, 55, 50, 55],
    assignmentsSubmitted: 6,
    totalAssignments: 10,
    engagementScore: 52,
    riskLevel: 'Medium' as const,
    course: 'Database Systems',
    weeklyProgress: [65, 62, 60, 58, 55, 52, 50, 48, 50, 52, 55, 58],
  },
  {
    studentId: 'STU006',
    name: 'Alex Thompson',
    email: 'alex.thompson@university.edu',
    avatar: 'AT',
    attendancePercentage: 70,
    quizScores: [62, 58, 55, 60, 58, 62, 55, 58],
    assignmentsSubmitted: 7,
    totalAssignments: 10,
    engagementScore: 60,
    riskLevel: 'Medium' as const,
    course: 'Data Structures',
    weeklyProgress: [70, 68, 65, 62, 60, 58, 55, 57, 60, 62, 65, 68],
  },
  {
    studentId: 'STU007',
    name: 'Jessica Liu',
    email: 'jessica.liu@university.edu',
    avatar: 'JL',
    attendancePercentage: 95,
    quizScores: [92, 88, 95, 90, 87, 93, 91, 89],
    assignmentsSubmitted: 10,
    totalAssignments: 10,
    engagementScore: 92,
    riskLevel: 'Low' as const,
    course: 'Machine Learning Basics',
    weeklyProgress: [95, 92, 90, 88, 87, 89, 91, 93, 95, 92, 94, 96],
  },
  {
    studentId: 'STU008',
    name: 'Ryan O\'Connor',
    email: 'ryan.oconnor@university.edu',
    avatar: 'RO',
    attendancePercentage: 88,
    quizScores: [85, 82, 88, 80, 86, 84, 87, 83],
    assignmentsSubmitted: 9,
    totalAssignments: 10,
    engagementScore: 85,
    riskLevel: 'Low' as const,
    course: 'Web Development',
    weeklyProgress: [88, 85, 82, 80, 82, 84, 86, 88, 85, 87, 89, 91],
  },
  {
    studentId: 'STU009',
    name: 'Aisha Mohammed',
    email: 'aisha.mohammed@university.edu',
    avatar: 'AM',
    attendancePercentage: 92,
    quizScores: [90, 85, 92, 88, 91, 87, 89, 86],
    assignmentsSubmitted: 10,
    totalAssignments: 10,
    engagementScore: 88,
    riskLevel: 'Low' as const,
    course: 'Computer Science 101',
    weeklyProgress: [92, 90, 88, 85, 87, 89, 91, 93, 90, 92, 94, 96],
  },
  {
    studentId: 'STU010',
    name: 'Tyler Washington',
    email: 'tyler.washington@university.edu',
    avatar: 'TW',
    attendancePercentage: 90,
    quizScores: [88, 84, 90, 82, 88, 85, 86, 84],
    assignmentsSubmitted: 9,
    totalAssignments: 10,
    engagementScore: 82,
    riskLevel: 'Low' as const,
    course: 'Database Systems',
    weeklyProgress: [90, 88, 85, 82, 84, 86, 88, 90, 87, 89, 91, 93],
  },
];

// Calculate risk score and factors
const calculateRiskData = (student: typeof mockStudentsData[0]) => {
  const riskFactors: string[] = [];
  let riskScore = 0;

  if (student.attendancePercentage < 60) {
    riskScore += 30;
    riskFactors.push('Low attendance');
  } else if (student.attendancePercentage < 75) {
    riskScore += 15;
    riskFactors.push('Below average attendance');
  }

  const avgQuizScore = student.quizScores.reduce((a, b) => a + b, 0) / student.quizScores.length;
  if (avgQuizScore < 50) {
    riskScore += 30;
    riskFactors.push('Poor quiz performance');
  } else if (avgQuizScore < 65) {
    riskScore += 15;
    riskFactors.push('Below average quiz scores');
  }

  const completionRate = (student.assignmentsSubmitted / student.totalAssignments) * 100;
  if (completionRate < 50) {
    riskScore += 20;
    riskFactors.push('Low assignment completion');
  } else if (completionRate < 70) {
    riskScore += 10;
    riskFactors.push('Below average assignment completion');
  }

  if (student.engagementScore < 40) {
    riskScore += 20;
    riskFactors.push('Low engagement');
  } else if (student.engagementScore < 60) {
    riskScore += 10;
    riskFactors.push('Below average engagement');
  }

  return {
    riskScore: Math.min(100, riskScore),
    riskFactors,
  };
};

// Main seed function
async function seedDatabase() {
  console.log('🌱 Starting Firebase seed...\n');

  try {
    const now = Timestamp.now();
    const oneWeekAgo = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    // 1. Create teacher user
    console.log('📝 Creating teacher user...');
    let teacherUser;
    try {
      teacherUser = await createUserWithEmailAndPassword(
        auth,
        'teacher@dropoutguard.edu',
        'teacher123'
      );
      console.log('✅ Teacher user created');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('⚠️  Teacher user already exists, skipping...');
        // In production, you'd fetch the existing user
      } else {
        throw error;
      }
    }

    // 2. Create teacher document
    if (teacherUser) {
      // Check if teacher already exists
      const teacherQuery = query(
        collection(db, 'teachers'),
        where('userId', '==', teacherUser.user.uid),
        limit(1)
      );
      const teacherSnapshot = await getDocs(teacherQuery);
      
      if (teacherSnapshot.empty) {
        const teacherId = 'TCH001';
        await setDoc(doc(db, 'teachers', teacherId), {
        teacherId,
        userId: teacherUser.user.uid,
        name: 'Dr. Sarah Johnson',
        email: 'teacher@dropoutguard.edu',
        department: 'Computer Science',
        courses: ['CS101', 'DS201', 'WD301'],
        studentIds: mockStudentsData.map((s) => s.studentId),
        createdAt: now,
        updatedAt: now,
      });
      console.log('✅ Teacher document created');

        // Create user document for teacher
        await setDoc(doc(db, 'users', teacherUser.user.uid), {
          userId: teacherUser.user.uid,
          email: 'teacher@dropoutguard.edu',
          role: 'teacher',
          displayName: 'Dr. Sarah Johnson',
          teacherId,
          createdAt: now,
          updatedAt: now,
          isActive: true,
        });
        console.log('✅ Teacher user document created');
      } else {
        console.log('⚠️  Teacher document already exists, skipping...');
      }
    }

    // 3. Create students and user accounts
    console.log('\n📚 Creating students...');
    const studentUserIds: string[] = [];

    for (const studentData of mockStudentsData) {
      try {
        // Create auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          studentData.email,
          'student123'
        );
        studentUserIds.push(userCredential.user.uid);

        // Calculate risk data
        const riskData = calculateRiskData(studentData);

        // Create student document
        const studentDoc: any = {
          studentId: studentData.studentId,
          userId: userCredential.user.uid,
          name: studentData.name,
          email: studentData.email,
          avatar: studentData.avatar,
          course: studentData.course,
          attendancePercentage: studentData.attendancePercentage,
          quizScores: studentData.quizScores,
          assignmentsSubmitted: studentData.assignmentsSubmitted,
          totalAssignments: studentData.totalAssignments,
          engagementScore: studentData.engagementScore,
          riskLevel: studentData.riskLevel,
          riskScore: riskData.riskScore,
          riskFactors: riskData.riskFactors,
          weeklyProgress: studentData.weeklyProgress,
          lastActive: oneWeekAgo,
          lastRiskAssessmentAt: now,
          enrolledAt: Timestamp.fromDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)), // 90 days ago
          createdAt: now,
          updatedAt: now,
        };

        await setDoc(doc(db, 'students', studentData.studentId), studentDoc);

        // Create user document
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          userId: userCredential.user.uid,
          email: studentData.email,
          role: 'student',
          displayName: studentData.name,
          studentId: studentData.studentId,
          createdAt: now,
          updatedAt: now,
          isActive: true,
        });

        console.log(`✅ Created student: ${studentData.name} (${studentData.studentId})`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️  Student ${studentData.name} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating student ${studentData.name}:`, error.message);
        }
      }
    }

    // 4. Create recovery plans for high and medium risk students
    console.log('\n📋 Creating recovery plans...');
    const highAndMediumRiskStudents = mockStudentsData.filter(
      (s) => s.riskLevel === 'High' || s.riskLevel === 'Medium'
    );

    for (const student of highAndMediumRiskStudents) {
      try {
        // Check if recovery plan already exists
        const planId = `PLAN_${student.studentId}`;
        const planDoc = await getDoc(doc(db, 'recoveryPlans', planId));
        if (planDoc.exists()) {
          console.log(`⚠️  Recovery plan for ${student.name} already exists, skipping...`);
          continue;
        }

        const weakTopics =
          student.riskLevel === 'High'
            ? ['Fundamental Concepts', 'Problem Solving', 'Time Management', 'Study Habits']
            : ['Advanced Topics', 'Practical Applications', 'Consistency'];

        const dailyStudyHours = student.riskLevel === 'High' ? 4 : 3;

        // Build recovery plan object, omitting undefined fields
        const recoveryPlan: any = {
          planId,
          studentId: student.studentId,
          riskLevel: student.riskLevel,
          weakTopics,
          dailyStudyHours,
          schedule: [
            { day: 'Monday', focus: 'Review fundamentals', duration: '2 hours', completed: false },
            { day: 'Tuesday', focus: 'Practice problems', duration: '2 hours', completed: false },
            { day: 'Wednesday', focus: 'Concept clarification', duration: '1.5 hours', completed: false },
            { day: 'Thursday', focus: 'Group study session', duration: '2 hours', completed: false },
            { day: 'Friday', focus: 'Mock tests', duration: '1.5 hours', completed: false },
            { day: 'Weekend', focus: 'Self-assessment & revision', duration: '3 hours', completed: false },
          ],
          resources: [
            { title: 'Khan Academy - Core Concepts', type: 'Video Course', url: '#', description: 'Comprehensive video tutorials' },
            { title: 'Practice Problem Set', type: 'Exercises', url: '#', description: 'Hands-on practice exercises' },
            { title: 'Study Group Discord', type: 'Community', url: '#', description: 'Connect with peers' },
            { title: 'Office Hours with TA', type: 'Mentorship', url: '#', description: 'Get personalized help' },
          ],
          strategies: [
            'Break study sessions into 25-minute focused blocks',
            'Review notes within 24 hours of each lecture',
            'Form a study group with 2-3 classmates',
            'Use active recall instead of passive reading',
            'Attend all office hours for difficult topics',
          ],
          generatedBy: 'manual' as const,
          generatedAt: now,
          isActive: true,
          progressPercentage: 0,
          createdAt: now,
          updatedAt: now,
        };

        // Only add aiModel if it's defined (for future use)
        // For MVP, we'll omit it since it's optional

        await setDoc(doc(db, 'recoveryPlans', planId), recoveryPlan);
        console.log(`✅ Created recovery plan for ${student.name}`);
      } catch (error: any) {
        console.error(`❌ Error creating recovery plan for ${student.name}:`, error.message);
        // Continue with next student
      }
    }

    console.log('\n✨ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Teacher: 1`);
    console.log(`   - Students: ${mockStudentsData.length}`);
    console.log(`   - Recovery Plans: ${highAndMediumRiskStudents.length}`);
    console.log('\n🔑 Default credentials:');
    console.log('   Teacher: teacher@dropoutguard.edu / teacher123');
    console.log('   Students: [student-email] / student123');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

