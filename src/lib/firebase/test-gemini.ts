/**
 * Test Script for Gemini AI Integration
 * 
 * This script tests the Gemini AI recovery plan generation.
 * Run with: npx tsx src/lib/firebase/test-gemini.ts
 */

// Load environment variables for Node.js
import * as dotenv from 'dotenv';
dotenv.config();

import { generateRecoveryPlanWithGemini, isGeminiConfigured } from './gemini';
import { FirestoreStudent } from '@/types/firebase';
import { Timestamp } from 'firebase/firestore';

// Mock student data for testing
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

async function testGemini() {
  console.log('🧪 Testing Gemini AI Integration\n');

  // Check if Gemini is configured
  if (!isGeminiConfigured()) {
    console.error('❌ Gemini API key not configured!');
    console.log('   Please set VITE_GEMINI_API_KEY in your .env file');
    process.exit(1);
  }

  console.log('✅ Gemini API key found');
  console.log(`📊 Testing with student: ${testStudent.name}`);
  console.log(`   Risk Level: ${testStudent.riskLevel}`);
  console.log(`   Risk Score: ${testStudent.riskScore}/100`);
  console.log(`   Attendance: ${testStudent.attendancePercentage}%`);
  console.log(`   Engagement: ${testStudent.engagementScore}/100\n`);

  try {
    console.log('🤖 Generating recovery plan with Gemini AI...\n');
    const startTime = Date.now();

    const recoveryPlan = await generateRecoveryPlanWithGemini(testStudent);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('✅ Recovery plan generated successfully!\n');
    console.log(`⏱️  Generation time: ${duration}s\n`);
    console.log('📋 Recovery Plan Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📚 Weak Topics (${recoveryPlan.weakTopics.length}):`);
    recoveryPlan.weakTopics.forEach((topic, i) => {
      console.log(`   ${i + 1}. ${topic}`);
    });

    console.log(`\n⏰ Daily Study Hours: ${recoveryPlan.dailyStudyHours} hours`);

    console.log(`\n📅 Weekly Schedule:`);
    recoveryPlan.schedule.forEach((item) => {
      console.log(`   ${item.day.padEnd(10)} - ${item.focus.padEnd(30)} (${item.duration})`);
    });

    console.log(`\n📖 Learning Resources (${recoveryPlan.resources.length}):`);
    recoveryPlan.resources.forEach((resource, i) => {
      console.log(`   ${i + 1}. ${resource.title}`);
      console.log(`      Type: ${resource.type}`);
      if (resource.description) {
        console.log(`      ${resource.description}`);
      }
    });

    console.log(`\n💡 Strategies (${recoveryPlan.strategies.length}):`);
    recoveryPlan.strategies.forEach((strategy, i) => {
      console.log(`   ${i + 1}. ${strategy}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ Test completed successfully!');
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  }
}

// Run test
testGemini();

