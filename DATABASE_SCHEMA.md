# DropoutGuard - Firestore Database Schema

Complete database schema documentation for the DropoutGuard Firebase backend.

## 📊 Schema Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     DROPOUTGUARD DATABASE                     │
└─────────────────────────────────────────────────────────────┘

Collections:
├── users/                    # User accounts & authentication
├── students/                 # Student academic data
├── teachers/                 # Teacher profiles
├── recoveryPlans/            # AI recovery plans
├── courses/                  # Course information
├── quizzes/                  # Quiz records
│   └── {quizId}/scores/      # Quiz scores subcollection
├── assignments/              # Assignment records
│   └── {assignmentId}/submissions/  # Submission subcollection
├── attendance/               # Attendance records
├── notifications/            # System notifications
└── aiAnalysis/              # AI analysis (future)
```

---

## 📁 Collection Details

### 1. Users Collection (`/users/{userId}`)

**Purpose**: Store user authentication and profile information.

**Document Structure**:
```typescript
{
  userId: string              // Document ID (Firebase Auth UID)
  email: string
  role: 'student' | 'teacher' | 'admin'
  displayName?: string
  photoURL?: string
  studentId?: string          // Reference to /students/{studentId}
  teacherId?: string          // Reference to /teachers/{teacherId}
  createdAt: Timestamp
  updatedAt: Timestamp
  lastLoginAt?: Timestamp
  isActive: boolean
}
```

**Indexes Required**: None (userId is unique)

**Access Rules**:
- Users can read/write their own document
- Teachers can read all user documents

---

### 2. Students Collection (`/students/{studentId}`)

**Purpose**: Store student academic performance and risk assessment data.

**Document Structure**:
```typescript
{
  studentId: string           // Document ID
  userId: string              // Reference to /users/{userId}
  name: string
  email: string
  avatar?: string
  course: string
  courseId?: string           // Reference to /courses/{courseId}
  
  // Academic Performance
  attendancePercentage: number  // 0-100
  quizScores: number[]          // Array of scores (0-100)
  assignmentsSubmitted: number
  totalAssignments: number
  engagementScore: number       // 0-100, calculated
  
  // Risk Assessment
  riskLevel: 'Low' | 'Medium' | 'High'
  riskScore: number             // 0-100, calculated
  riskFactors: string[]         // Identified risk factors
  lastRiskAssessmentAt: Timestamp
  
  // Progress Tracking
  weeklyProgress: number[]      // Array of weekly percentages
  lastActive: Timestamp
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
  enrolledAt: Timestamp
}
```

**Indexes Required**:
- `riskLevel` (ascending)
- `riskScore` (descending)
- `userId` (ascending)

**Access Rules**:
- Students can read their own document
- Teachers can read all student documents
- Only teachers can write

---

### 3. Teachers Collection (`/teachers/{teacherId}`)

**Purpose**: Store teacher profile and class management data.

**Document Structure**:
```typescript
{
  teacherId: string           // Document ID
  userId: string              // Reference to /users/{userId}
  name: string
  email: string
  photoURL?: string
  department?: string
  courses: string[]           // Array of course IDs
  studentIds: string[]        // Array of student IDs they teach
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Indexes Required**: None

**Access Rules**:
- All authenticated users can read
- Only teachers/admins can write

---

### 4. Recovery Plans Collection (`/recoveryPlans/{planId}`)

**Purpose**: Store AI-generated personalized recovery plans for at-risk students.

**Document Structure**:
```typescript
{
  planId: string              // Document ID
  studentId: string           // Reference to /students/{studentId}
  riskLevel: 'Low' | 'Medium' | 'High'
  
  // Weak Areas
  weakTopics: string[]
  
  // Study Schedule
  dailyStudyHours: number
  schedule: {
    day: string               // 'Monday', 'Tuesday', etc.
    focus: string
    duration: string          // e.g., '2 hours'
    completed?: boolean
  }[]
  
  // Learning Resources
  resources: {
    title: string
    type: 'Video Course' | 'Exercises' | 'Community' | 'Mentorship' | 'Article' | 'Book'
    url: string
    description?: string
  }[]
  
  // Strategies
  strategies: string[]
  
  // AI Metadata
  generatedBy: 'ai' | 'manual'
  generatedAt: Timestamp
  aiModel: string            // e.g., 'gemini-pro'
  
  // Progress Tracking
  isActive: boolean
  startedAt?: Timestamp
  completedAt?: Timestamp
  progressPercentage: number  // 0-100
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Indexes Required**:
- `studentId` (ascending) + `isActive` (ascending)
- `createdAt` (descending)

**Access Rules**:
- Students can read their own recovery plans
- Teachers can read all recovery plans
- Only teachers can write

---

### 5. Courses Collection (`/courses/{courseId}`)

**Purpose**: Store course information and metadata.

**Document Structure**:
```typescript
{
  courseId: string           // Document ID
  name: string               // e.g., 'Computer Science 101'
  code: string               // e.g., 'CS101'
  description?: string
  teacherId: string          // Reference to /teachers/{teacherId}
  studentIds: string[]       // Array of enrolled student IDs
  totalAssignments: number
  totalQuizzes: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Indexes Required**: None

**Access Rules**:
- All authenticated users can read
- Only teachers/admins can write

---

### 6. Quizzes Collection (`/quizzes/{quizId}`)

**Purpose**: Store quiz records.

**Document Structure**:
```typescript
{
  quizId: string             // Document ID
  courseId: string           // Reference to /courses/{courseId}
  title: string
  maxScore: number
  date: Timestamp
  createdAt: Timestamp
}
```

**Subcollection**: `/quizzes/{quizId}/scores/{scoreId}`

**Quiz Score Document**:
```typescript
{
  scoreId: string            // Document ID
  quizId: string             // Reference to /quizzes/{quizId}
  studentId: string          // Reference to /students/{studentId}
  score: number              // 0-100
  maxScore: number
  submittedAt: Timestamp
  createdAt: Timestamp
}
```

**Indexes Required**:
- `courseId` (ascending)
- `date` (descending)

**Access Rules**:
- Students can read their own quiz scores
- Teachers can read all quiz data

---

### 7. Assignments Collection (`/assignments/{assignmentId}`)

**Purpose**: Store assignment records.

**Document Structure**:
```typescript
{
  assignmentId: string       // Document ID
  courseId: string           // Reference to /courses/{courseId}
  title: string
  description?: string
  dueDate: Timestamp
  maxScore?: number
  createdAt: Timestamp
}
```

**Subcollection**: `/assignments/{assignmentId}/submissions/{submissionId}`

**Submission Document**:
```typescript
{
  submissionId: string       // Document ID
  assignmentId: string      // Reference to /assignments/{assignmentId}
  studentId: string         // Reference to /students/{studentId}
  submittedAt: Timestamp
  score?: number
  isLate: boolean
  createdAt: Timestamp
}
```

**Indexes Required**:
- `courseId` (ascending)
- `dueDate` (ascending)

**Access Rules**:
- Students can read their own submissions
- Teachers can read all assignment data

---

### 8. Attendance Collection (`/attendance/{attendanceId}`)

**Purpose**: Store daily attendance records.

**Document Structure**:
```typescript
{
  attendanceId: string       // Document ID
  studentId: string         // Reference to /students/{studentId}
  courseId: string          // Reference to /courses/{courseId}
  date: Timestamp           // Date of attendance
  status: 'present' | 'absent' | 'late' | 'excused'
  createdAt: Timestamp
}
```

**Indexes Required**:
- `studentId` (ascending) + `date` (descending)
- `courseId` (ascending) + `date` (descending)

**Access Rules**:
- Students can read their own attendance
- Teachers can read all attendance records

---

### 9. Notifications Collection (`/notifications/{notificationId}`)

**Purpose**: Store system notifications for users.

**Document Structure**:
```typescript
{
  notificationId: string     // Document ID
  userId: string             // Reference to /users/{userId}
  type: 'risk_alert' | 'recovery_plan' | 'assignment_due' | 'attendance_warning' | 'system'
  title: string
  message: string
  isRead: boolean
  studentId?: string         // For teacher notifications about students
  createdAt: Timestamp
  readAt?: Timestamp
}
```

**Indexes Required**:
- `userId` (ascending) + `isRead` (ascending) + `createdAt` (descending)
- `userId` (ascending) + `createdAt` (descending)

**Access Rules**:
- Users can only read/write their own notifications

---

### 10. AI Analysis Collection (`/aiAnalysis/{analysisId}`) - Future

**Purpose**: Store AI-generated risk assessments and recommendations.

**Document Structure**:
```typescript
{
  analysisId: string         // Document ID
  studentId: string         // Reference to /students/{studentId}
  riskLevel: 'Low' | 'Medium' | 'High'
  riskScore: number
  riskFactors: string[]
  recommendations: string[]
  aiModel: string           // e.g., 'gemini-pro'
  promptUsed?: string        // For debugging
  responseRaw?: string       // Raw AI response
  createdAt: Timestamp
}
```

**Indexes Required**:
- `studentId` (ascending) + `createdAt` (descending)

**Access Rules**:
- Students can read their own analysis
- Teachers can read all analysis

---

## 🔗 Relationships

### User → Student/Teacher
- One user document links to one student OR teacher document
- `users.userId` → `students.userId` or `teachers.userId`

### Student → Recovery Plan
- One student can have multiple recovery plans (historical)
- Only one active recovery plan at a time
- `recoveryPlans.studentId` → `students.studentId`

### Teacher → Students
- One teacher can have many students
- `teachers.studentIds[]` contains array of student IDs

### Course → Students/Quizzes/Assignments
- One course has many students, quizzes, and assignments
- `courses.studentIds[]` → `students.studentId[]`
- `quizzes.courseId` → `courses.courseId`
- `assignments.courseId` → `courses.courseId`

---

## 📈 Data Flow

### Risk Assessment Flow

1. **Data Collection**: Student performance data is collected (attendance, quizzes, assignments)
2. **Risk Calculation**: `calculateRiskLevel()` function analyzes data
3. **Risk Update**: Student document is updated with new risk level
4. **Recovery Plan**: If risk is Medium/High, recovery plan is generated
5. **Notification**: Teacher receives risk alert notification

### Recovery Plan Generation Flow

1. **Trigger**: Student risk level changes to Medium/High
2. **Analysis**: System analyzes student weak areas
3. **Generation**: Recovery plan is created (mock AI in MVP, real Gemini in production)
4. **Storage**: Plan is saved to Firestore
5. **Notification**: Student receives notification about new recovery plan

---

## 🔍 Query Patterns

### Common Queries

**Get all high-risk students**:
```typescript
query(
  collection(db, 'students'),
  where('riskLevel', '==', 'High'),
  orderBy('riskScore', 'desc')
)
```

**Get active recovery plan for student**:
```typescript
query(
  collection(db, 'recoveryPlans'),
  where('studentId', '==', studentId),
  where('isActive', '==', true),
  orderBy('createdAt', 'desc'),
  limit(1)
)
```

**Get unread notifications for user**:
```typescript
query(
  collection(db, 'notifications'),
  where('userId', '==', userId),
  where('isRead', '==', false),
  orderBy('createdAt', 'desc')
)
```

**Get student's quiz scores**:
```typescript
query(
  collection(db, 'quizzes', quizId, 'scores'),
  where('studentId', '==', studentId),
  orderBy('submittedAt', 'desc')
)
```

---

## 🚀 Performance Considerations

1. **Indexes**: Create composite indexes for common query patterns
2. **Pagination**: Use `limit()` and pagination for large collections
3. **Caching**: Consider caching frequently accessed data
4. **Subcollections**: Use subcollections for related data (quiz scores, submissions)
5. **Batch Operations**: Use batch writes for multiple updates

---

## 📝 Notes

- All timestamps use Firestore `Timestamp` type
- Document IDs are auto-generated unless specified
- Arrays are used for simple lists (studentIds, courses)
- References use document IDs, not full paths
- Risk scores are calculated on-the-fly, not stored separately (except in student document)

---

**Last Updated**: 2024
**Version**: 1.0.0

