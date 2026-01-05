# Firebase Backend Services

This directory contains all Firebase-related services for DropoutGuard.

## 📁 File Structure

```
src/lib/firebase/
├── config.ts          # Firebase initialization and configuration
├── auth.ts            # Authentication services
├── students.ts        # Student data operations
├── teachers.ts        # Teacher data operations
├── recoveryPlans.ts   # Recovery plan management
├── notifications.ts  # Notification system
└── index.ts          # Central export point
```

## 🔧 Services Overview

### `config.ts`
- Initializes Firebase app, auth, firestore, and storage
- Loads configuration from environment variables
- Exports singleton instances

**Usage**:
```typescript
import { auth, db } from '@/lib/firebase/config';
```

### `auth.ts`
- User authentication (sign in, sign up, sign out)
- User profile management
- Password reset
- Auth state monitoring

**Usage**:
```typescript
import { signIn, signUp, signOut, getUserData } from '@/lib/firebase/auth';

// Sign in
const result = await signIn('user@example.com', 'password');

// Get user data
const userData = await getUserData(userId);
```

### `students.ts`
- CRUD operations for students
- Risk level calculation
- Risk statistics
- Student queries (by risk level, by user ID, etc.)

**Usage**:
```typescript
import { 
  getStudent, 
  getAllStudents, 
  getHighRiskStudents,
  calculateRiskLevel 
} from '@/lib/firebase/students';

// Get all students
const students = await getAllStudents();

// Get high-risk students
const highRisk = await getHighRiskStudents();

// Calculate risk for a student
const risk = calculateRiskLevel(student);
```

### `teachers.ts`
- Teacher profile management
- Class management (add/remove students)
- Teacher queries

**Usage**:
```typescript
import { 
  getTeacher, 
  getAllTeachers,
  addStudentToTeacher 
} from '@/lib/firebase/teachers';

// Get teacher
const teacher = await getTeacher(teacherId);

// Add student to teacher's class
await addStudentToTeacher(teacherId, studentId);
```

### `recoveryPlans.ts`
- Recovery plan generation (mock AI in MVP)
- Recovery plan CRUD operations
- Progress tracking
- Schedule management

**Usage**:
```typescript
import { 
  generateRecoveryPlan,
  getRecoveryPlanByStudentId,
  markScheduleItemCompleted 
} from '@/lib/firebase/recoveryPlans';

// Generate recovery plan
const planId = await generateRecoveryPlan(studentId);

// Get student's recovery plan
const plan = await getRecoveryPlanByStudentId(studentId);

// Mark schedule item as completed
await markScheduleItemCompleted(planId, dayIndex, true);
```

### `notifications.ts`
- Notification creation and management
- Read/unread status tracking
- Risk alert notifications
- Notification queries

**Usage**:
```typescript
import { 
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  createRiskAlertNotification 
} from '@/lib/firebase/notifications';

// Create notification
await createNotification({
  userId: 'user123',
  type: 'risk_alert',
  title: 'High Risk Alert',
  message: 'Student needs attention',
  isRead: false,
});

// Get user notifications
const notifications = await getNotificationsByUserId(userId, {
  unreadOnly: true,
  limit: 10,
});
```

## 🔄 Data Flow

### Authentication Flow
1. User signs in → `signIn()` → Returns Firebase user + Firestore user data
2. Auth state changes → `onAuthStateChange()` → Update app state
3. User data fetched → `getUserData()` → Returns complete user profile

### Student Data Flow
1. Fetch students → `getAllStudents()` → Returns all students
2. Filter by risk → `getStudentsByRiskLevel()` → Returns filtered list
3. Calculate risk → `calculateRiskLevel()` → Updates risk assessment
4. Update student → `updateStudent()` → Saves changes to Firestore

### Recovery Plan Flow
1. Generate plan → `generateRecoveryPlan()` → Creates new plan
2. Fetch plan → `getRecoveryPlanByStudentId()` → Returns active plan
3. Track progress → `markScheduleItemCompleted()` → Updates progress
4. Complete plan → `updateRecoveryPlan()` → Marks as completed

## 🎯 Best Practices

1. **Error Handling**: Always wrap Firebase calls in try-catch blocks
2. **Type Safety**: Use TypeScript types from `@/types/firebase`
3. **Loading States**: Use React Query or similar for data fetching
4. **Caching**: Leverage Firebase's built-in caching
5. **Pagination**: Use `limit()` for large collections

## 🔐 Security

- All services assume Firebase Security Rules are properly configured
- Never expose sensitive operations to client-side
- Validate user permissions before operations
- Use Firestore security rules for data access control

## 🚀 Future Enhancements

- [ ] Real-time listeners for live updates
- [ ] Batch operations for bulk updates
- [ ] Offline persistence configuration
- [ ] Gemini AI integration for recovery plans
- [ ] Analytics and logging
- [ ] Caching layer for frequently accessed data

## 📚 Related Documentation

- [Firebase Setup Guide](../FIREBASE_SETUP.md)
- [Database Schema](../DATABASE_SCHEMA.md)
- [Firebase TypeScript Types](../../types/firebase.ts)

