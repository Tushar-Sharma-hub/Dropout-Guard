/**
 * Comprehensive Backend Test Script
 * 
 * Tests Firebase connection, Firestore operations, and Gemini AI integration
 * Run with: npx tsx scripts/test-backend.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { generateRecoveryPlanWithGemini, isGeminiConfigured } from '../src/lib/firebase/gemini';
import { FirestoreStudent } from '../src/types/firebase';
import { Timestamp } from 'firebase/firestore';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(60));
  log(title, colors.cyan);
  console.log('='.repeat(60));
}

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || '',
};

async function testFirebaseConfig() {
  logSection('🔧 Testing Firebase Configuration');
  
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  let allConfigured = true;
  for (const field of requiredFields) {
    const value = firebaseConfig[field as keyof typeof firebaseConfig];
    if (value && value.trim() !== '') {
      log(`  ✅ ${field}: ${value.substring(0, 20)}...`, colors.green);
    } else {
      log(`  ❌ ${field}: NOT CONFIGURED`, colors.red);
      allConfigured = false;
    }
  }

  if (!allConfigured) {
    log('\n⚠️  Some Firebase config values are missing!', colors.yellow);
    log('   Please check your .env file.', colors.yellow);
    return false;
  }

  log('\n✅ All Firebase config values are present', colors.green);
  return true;
}

async function testFirebaseConnection() {
  logSection('🔌 Testing Firebase Connection');

  try {
    log('  Initializing Firebase app...', colors.blue);
    const app = initializeApp(firebaseConfig);
    log('  ✅ Firebase app initialized', colors.green);

    log('  Connecting to Firestore...', colors.blue);
    const db = getFirestore(app);
    log('  ✅ Firestore connected', colors.green);

    log('  Testing Firestore read...', colors.blue);
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    log(`  ✅ Successfully read ${snapshot.size} students from Firestore`, colors.green);

    return { app, db, success: true };
  } catch (error: any) {
    log(`  ❌ Firebase connection failed: ${error.message}`, colors.red);
    if (error.code) {
      log(`     Error code: ${error.code}`, colors.red);
    }
    return { app: null, db: null, success: false };
  }
}

async function testFirebaseAuth() {
  logSection('🔐 Testing Firebase Authentication');

  try {
    const auth = getAuth();
    log('  Attempting to sign in as teacher...', colors.blue);
    
    const userCredential = await signInWithEmailAndPassword(
      auth,
      'teacher@dropoutguard.edu',
      'teacher123'
    );

    log(`  ✅ Successfully authenticated as: ${userCredential.user.email}`, colors.green);
    log(`     User ID: ${userCredential.user.uid}`, colors.green);
    
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      log('  ⚠️  Teacher user not found. Run seed script first.', colors.yellow);
    } else if (error.code === 'auth/wrong-password') {
      log('  ⚠️  Wrong password. Check seed script credentials.', colors.yellow);
    } else {
      log(`  ❌ Authentication failed: ${error.message}`, colors.red);
      log(`     Error code: ${error.code}`, colors.red);
    }
    return { success: false, user: null };
  }
}

async function testFirestoreData(db: any) {
  logSection('📊 Testing Firestore Data');

  try {
    // Test students collection
    log('  Reading students collection...', colors.blue);
    const studentsRef = collection(db, 'students');
    const studentsSnapshot = await getDocs(studentsRef);
    const students = studentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    log(`  ✅ Found ${students.length} students`, colors.green);

    if (students.length > 0) {
      const firstStudent = students[0] as any;
      log(`     Sample: ${firstStudent.name} (${firstStudent.riskLevel} risk)`, colors.green);
    }

    // Test users collection
    log('  Reading users collection...', colors.blue);
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    log(`  ✅ Found ${usersSnapshot.size} users`, colors.green);

    // Test recovery plans collection
    log('  Reading recovery plans collection...', colors.blue);
    const plansRef = collection(db, 'recoveryPlans');
    const plansSnapshot = await getDocs(plansRef);
    const plans = plansSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    log(`  ✅ Found ${plans.length} recovery plans`, colors.green);

    if (plans.length > 0) {
      const aiPlans = plans.filter((p: any) => p.generatedBy === 'ai');
      const manualPlans = plans.filter((p: any) => p.generatedBy === 'manual');
      log(`     AI-generated: ${aiPlans.length}`, colors.green);
      log(`     Manual: ${manualPlans.length}`, colors.green);
    }

    // Test teachers collection
    log('  Reading teachers collection...', colors.blue);
    const teachersRef = collection(db, 'teachers');
    const teachersSnapshot = await getDocs(teachersRef);
    log(`  ✅ Found ${teachersSnapshot.size} teachers`, colors.green);

    return { success: true, students, plans };
  } catch (error: any) {
    log(`  ❌ Firestore read failed: ${error.message}`, colors.red);
    return { success: false, students: [], plans: [] };
  }
}

async function testGeminiConfig() {
  logSection('🤖 Testing Gemini AI Configuration');

  const apiKey = process.env.VITE_GEMINI_API_KEY || '';
  
  if (!apiKey || apiKey.trim() === '') {
    log('  ⚠️  Gemini API key not found in .env', colors.yellow);
    log('     Set VITE_GEMINI_API_KEY in your .env file to enable AI', colors.yellow);
    return { configured: false, apiKey: '' };
  }

  log(`  ✅ Gemini API key found: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`, colors.green);
  log('  ✅ Gemini AI is configured and ready', colors.green);
  
  return { configured: true, apiKey };
}

async function testGeminiAI() {
  logSection('🤖 Testing Gemini AI Generation');

  if (!isGeminiConfigured()) {
    log('  ⚠️  Skipping Gemini test - API key not configured', colors.yellow);
    return { success: false, skipped: true };
  }

  try {
    // Create a test student
    const testStudent: FirestoreStudent = {
      studentId: 'TEST001',
      userId: 'test-user-id',
      name: 'Test Student',
      email: 'test@university.edu',
      course: 'Computer Science 101',
      attendancePercentage: 55,
      quizScores: [45, 38, 42, 35, 40],
      assignmentsSubmitted: 4,
      totalAssignments: 10,
      engagementScore: 35,
      riskLevel: 'High',
      riskScore: 75,
      riskFactors: ['Low attendance', 'Poor quiz performance', 'Low engagement'],
      weeklyProgress: [55, 52, 48, 45, 42, 40],
      lastActive: Timestamp.now(),
      lastRiskAssessmentAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      enrolledAt: Timestamp.now(),
    };

    log('  Generating recovery plan with Gemini AI...', colors.blue);
    log(`     Student: ${testStudent.name} (${testStudent.riskLevel} risk)`, colors.blue);
    
    const startTime = Date.now();
    const recoveryPlan = await generateRecoveryPlanWithGemini(testStudent);
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    log(`  ✅ Recovery plan generated successfully!`, colors.green);
    log(`     Generation time: ${duration}s`, colors.green);
    log(`     Weak topics: ${recoveryPlan.weakTopics.length}`, colors.green);
    log(`     Daily study hours: ${recoveryPlan.dailyStudyHours}`, colors.green);
    log(`     Schedule items: ${recoveryPlan.schedule.length}`, colors.green);
    log(`     Resources: ${recoveryPlan.resources.length}`, colors.green);
    log(`     Strategies: ${recoveryPlan.strategies.length}`, colors.green);

    return { success: true, plan: recoveryPlan, duration };
  } catch (error: any) {
    log(`  ❌ Gemini AI test failed: ${error.message}`, colors.red);
    if (error.message.includes('API key')) {
      log('     Check your VITE_GEMINI_API_KEY in .env', colors.yellow);
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      log('     Check your internet connection', colors.yellow);
    }
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.clear();
  log('\n🧪 DropoutGuard Backend Test Suite', colors.cyan);
  log('=====================================\n', colors.cyan);

  const results = {
    firebaseConfig: false,
    firebaseConnection: false,
    firebaseAuth: false,
    firestoreData: false,
    geminiConfig: false,
    geminiAI: false,
  };

  // Test 1: Firebase Configuration
  results.firebaseConfig = await testFirebaseConfig();
  if (!results.firebaseConfig) {
    log('\n❌ Firebase configuration incomplete. Please fix .env file.', colors.red);
    return;
  }

  // Test 2: Firebase Connection
  const { app, db, success: connectionSuccess } = await testFirebaseConnection();
  results.firebaseConnection = connectionSuccess;
  if (!connectionSuccess) {
    log('\n❌ Cannot connect to Firebase. Check your configuration.', colors.red);
    return;
  }

  // Test 3: Firebase Authentication
  const { success: authSuccess } = await testFirebaseAuth();
  results.firebaseAuth = authSuccess;

  // Test 4: Firestore Data
  const { success: dataSuccess } = await testFirestoreData(db);
  results.firestoreData = dataSuccess;

  // Test 5: Gemini Configuration
  const { configured: geminiConfigured } = await testGeminiConfig();
  results.geminiConfig = geminiConfigured;

  // Test 6: Gemini AI (only if configured)
  if (geminiConfigured) {
    const { success: geminiSuccess } = await testGeminiAI();
    results.geminiAI = geminiSuccess;
  }

  // Summary
  logSection('📋 Test Summary');
  
  const tests = [
    { name: 'Firebase Configuration', result: results.firebaseConfig },
    { name: 'Firebase Connection', result: results.firebaseConnection },
    { name: 'Firebase Authentication', result: results.firebaseAuth },
    { name: 'Firestore Data', result: results.firestoreData },
    { name: 'Gemini Configuration', result: results.geminiConfig },
    { name: 'Gemini AI Generation', result: results.geminiAI, optional: !results.geminiConfig },
  ];

  let allPassed = true;
  for (const test of tests) {
    if (test.result) {
      log(`  ✅ ${test.name}`, colors.green);
    } else if (test.optional) {
      log(`  ⚠️  ${test.name} (optional - not configured)`, colors.yellow);
    } else {
      log(`  ❌ ${test.name}`, colors.red);
      allPassed = false;
    }
  }

  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    log('\n🎉 All critical tests passed!', colors.green);
    log('   Your backend is ready to use!', colors.green);
  } else {
    log('\n⚠️  Some tests failed. Please review the errors above.', colors.yellow);
  }
  console.log('='.repeat(60) + '\n');
}

// Run tests
runAllTests().catch((error) => {
  log(`\n❌ Fatal error: ${error.message}`, colors.red);
  process.exit(1);
});

