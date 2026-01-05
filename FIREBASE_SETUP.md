# Firebase Backend Setup Guide

This document provides a complete guide to setting up the Firebase backend for DropoutGuard.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Project Setup](#firebase-project-setup)
3. [Firestore Database Schema](#firestore-database-schema)
4. [Authentication Setup](#authentication-setup)
5. [Environment Configuration](#environment-configuration)
6. [Seeding Initial Data](#seeding-initial-data)
7. [Firebase Security Rules](#firebase-security-rules)
8. [Testing the Backend](#testing-the-backend)

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Google account (for Firebase)
- Firebase CLI (optional, for advanced features)

---

## Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `dropoutguard` (or your preferred name)
4. Enable Google Analytics (optional, recommended)
5. Click **"Create project"**

### Step 2: Register Web App

1. In your Firebase project, click the **Web icon** (`</>`)
2. Register app with nickname: `DropoutGuard Web`
3. **Copy the Firebase configuration object** (you'll need this for `.env`)
4. Click **"Continue to console"**

### Step 3: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Get started**
2. Enable **Email/Password** sign-in method:
   - Click on **Email/Password**
   - Toggle **Enable**
   - Click **Save**

### Step 4: Create Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Choose **"Start in test mode"** (we'll add security rules later)
3. Select a location (choose closest to your users)
4. Click **"Enable"**

---

## Firestore Database Schema

The database structure is organized as follows:

### Collections Overview

```
/users/{userId}                    # User accounts and authentication
/students/{studentId}              # Student academic data
/teachers/{teacherId}             # Teacher profiles
/recoveryPlans/{planId}            # AI-generated recovery plans
/courses/{courseId}                # Course information
/quizzes/{quizId}                  # Quiz records
/quizzes/{quizId}/scores/{scoreId} # Individual quiz scores
/assignments/{assignmentId}        # Assignment records
/assignments/{assignmentId}/submissions/{submissionId} # Submissions
/attendance/{attendanceId}         # Attendance records
/notifications/{notificationId}    # System notifications
/aiAnalysis/{analysisId}          # AI analysis (future)
```

### Detailed Schema

See `src/types/firebase.ts` for complete TypeScript interfaces.

#### Key Collections:

**Users** (`/users/{userId}`)
- Stores user authentication and profile data
- Links to student or teacher documents

**Students** (`/students/{studentId}`)
- Academic performance metrics
- Risk assessment data
- Progress tracking

**Recovery Plans** (`/recoveryPlans/{planId}`)
- Personalized recovery strategies
- Study schedules
- Learning resources
- Progress tracking

---

## Authentication Setup

Firebase Authentication is configured to support:
- Email/Password authentication
- Role-based access (student, teacher, admin)

### User Roles

- **Student**: Can view their own dashboard and recovery plan
- **Teacher**: Can view all students, generate recovery plans
- **Admin**: Full system access (future enhancement)

---

## Environment Configuration

### Step 1: Install Dependencies

```bash
npm install firebase
```

### Step 2: Create Environment File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase configuration values from Step 2 of Firebase Project Setup:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=dropoutguard.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=dropoutguard
VITE_FIREBASE_STORAGE_BUCKET=dropoutguard.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: Verify Configuration

The Firebase config is loaded in `src/lib/firebase/config.ts`. Make sure your `.env` file is in the project root.

---

## Seeding Initial Data

A seed script is provided to populate your Firestore database with demo data.

### Option 1: Using the Seed Script

1. Install additional dependencies (if needed):
   ```bash
   npm install --save-dev dotenv tsx
   ```

2. Update the seed script with your Firebase config (or use environment variables)

3. Run the seed script:
   ```bash
   npx tsx scripts/seedFirebase.ts
   ```

### Option 2: Manual Setup via Firebase Console

1. Go to Firestore Database in Firebase Console
2. Manually create documents following the schema in `src/types/firebase.ts`

### Default Credentials (from seed script)

- **Teacher**: `teacher@dropoutguard.edu` / `teacher123`
- **Students**: `[student-email]@university.edu` / `student123`

**⚠️ Important**: Change these passwords in production!

---

## Firebase Security Rules

### Basic Security Rules (for MVP/Development)

Add these rules in Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Students can read their own data
    match /students/{studentId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher');
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
    
    // Teachers can read all teacher documents
    match /teachers/{teacherId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
    
    // Recovery plans: students can read their own, teachers can read all
    match /recoveryPlans/{planId} {
      allow read: if request.auth != null && 
        (resource.data.studentId in get(/databases/$(database)/documents/students/{studentId}).data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher');
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
    
    // Notifications: users can read their own
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Default: deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Production Security Rules

For production, implement more granular rules based on:
- Role-based access control
- Data validation
- Rate limiting
- Audit logging

---

## Testing the Backend

### 1. Test Firebase Connection

Create a test file `test-firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './src/lib/firebase/config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
  try {
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    console.log(`✅ Connected! Found ${snapshot.size} students.`);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
```

### 2. Test Authentication

Use the Firebase services in your app:

```typescript
import { signIn } from '@/lib/firebase/auth';

// Test login
const result = await signIn('teacher@dropoutguard.edu', 'teacher123');
console.log('Logged in:', result);
```

### 3. Test Data Retrieval

```typescript
import { getAllStudents } from '@/lib/firebase/students';

const students = await getAllStudents();
console.log('Students:', students);
```

---

## Next Steps

1. ✅ Firebase project created
2. ✅ Firestore database initialized
3. ✅ Authentication enabled
4. ✅ Environment variables configured
5. ✅ Initial data seeded
6. ✅ Security rules applied
7. 🔄 Integrate Firebase services into your React app
8. 🔄 Update AuthContext to use Firebase Auth
9. 🔄 Replace mock data with Firebase queries

---

## Troubleshooting

### Common Issues

**"Firebase: Error (auth/network-request-failed)"**
- Check your internet connection
- Verify Firebase project is active
- Check API key is correct

**"Missing or insufficient permissions"**
- Review Firestore security rules
- Ensure user is authenticated
- Check user role in Firestore

**"Document not found"**
- Run the seed script to populate data
- Verify document IDs match
- Check collection names

**Environment variables not loading**
- Ensure `.env` file is in project root
- Restart development server after changing `.env`
- Verify variable names start with `VITE_`

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

## Support

For issues or questions:
1. Check Firebase Console for error logs
2. Review Firestore security rules
3. Verify environment configuration
4. Check browser console for client-side errors

---

**Last Updated**: 2024
**Version**: 1.0.0

