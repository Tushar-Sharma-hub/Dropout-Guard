# 🚀 Quick Start - Run Your Backend

## Step 1: Install Firebase

Due to system permissions, please run this command manually in your terminal:

```bash
npm install firebase
```

Or if you prefer yarn:
```bash
yarn add firebase
```

## Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Name it: `dropoutguard` (or your choice)
4. Enable **Google Analytics** (optional)
5. Click **"Create project"**

## Step 3: Enable Services

### Enable Authentication:
1. Go to **Authentication** > **Get started**
2. Click **Email/Password**
3. Toggle **Enable**
4. Click **Save**

### Create Firestore Database:
1. Go to **Firestore Database** > **Create database**
2. Choose **"Start in test mode"** (for MVP)
3. Select a location
4. Click **"Enable"**

## Step 4: Get Your Firebase Config

1. Click the **Web icon** (`</>`) in Firebase Console
2. Register app: `DropoutGuard Web`
3. **Copy the config object**

## Step 5: Create .env File

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

Replace the values with your actual Firebase config.

## Step 6: Install Seed Script Dependencies

```bash
npm install --save-dev dotenv tsx
```

## Step 7: Run Seed Script

```bash
npx tsx scripts/seedFirebase.ts
```

This will:
- Create a teacher user: `teacher@dropoutguard.edu` / `teacher123`
- Create 10 student users with demo data
- Generate recovery plans for at-risk students

## Step 8: Test the Backend

You can now use the Firebase services in your app:

```typescript
import { getAllStudents } from '@/lib/firebase/students';
import { signIn } from '@/lib/firebase/auth';

// Test in your component
const students = await getAllStudents();
console.log('Students:', students);
```

## ✅ You're Done!

Your backend is now set up and ready to use. The seed script has populated your database with demo data.

## 🔍 Verify Setup

Check your Firestore database in Firebase Console - you should see:
- `users` collection with teacher and students
- `students` collection with 10 students
- `teachers` collection with 1 teacher
- `recoveryPlans` collection with plans for at-risk students

## 🐛 Troubleshooting

**"Firebase not initialized"**
- Check your `.env` file exists and has correct values
- Restart your dev server after creating `.env`

**"Permission denied" errors**
- Make sure Firestore is in test mode (for MVP)
- Check Firebase Security Rules

**"Module not found: firebase"**
- Run `npm install firebase` again
- Check `node_modules` exists

---

**Need help?** See `FIREBASE_SETUP.md` for detailed instructions.

