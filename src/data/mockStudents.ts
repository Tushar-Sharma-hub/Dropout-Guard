export interface Student {
  studentId: string;
  name: string;
  email: string;
  avatar: string;
  attendancePercentage: number;
  quizScores: number[];
  assignmentsSubmitted: number;
  totalAssignments: number;
  engagementScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  course: string;
  lastActive: string;
  weeklyProgress: number[];
}

export interface RecoveryPlan {
  weakTopics: string[];
  dailyStudyHours: number;
  schedule: {
    day: string;
    focus: string;
    duration: string;
  }[];
  resources: {
    title: string;
    type: string;
    url: string;
  }[];
  strategies: string[];
}

const firstNames = ['Emma', 'Liam', 'Sophia', 'Noah', 'Olivia', 'James', 'Ava', 'William', 'Isabella', 'Benjamin'];
const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson'];
const courses = ['Computer Science 101', 'Data Structures', 'Web Development', 'Machine Learning Basics', 'Database Systems'];

function generateQuizScores(riskLevel: 'Low' | 'Medium' | 'High'): number[] {
  const baseScore = riskLevel === 'Low' ? 75 : riskLevel === 'Medium' ? 55 : 35;
  const variance = riskLevel === 'Low' ? 15 : riskLevel === 'Medium' ? 20 : 25;
  
  return Array.from({ length: 8 }, () => 
    Math.min(100, Math.max(0, baseScore + Math.floor(Math.random() * variance * 2) - variance))
  );
}

function generateWeeklyProgress(riskLevel: 'Low' | 'Medium' | 'High'): number[] {
  const base = riskLevel === 'Low' ? 80 : riskLevel === 'Medium' ? 50 : 25;
  return Array.from({ length: 12 }, (_, i) => {
    const trend = riskLevel === 'High' ? -i * 2 : riskLevel === 'Medium' ? 0 : i * 1;
    return Math.min(100, Math.max(0, base + trend + Math.floor(Math.random() * 20) - 10));
  });
}

export const mockStudents: Student[] = [
  // High Risk Students (2)
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
    riskLevel: 'High',
    course: 'Data Structures',
    lastActive: '5 days ago',
    weeklyProgress: generateWeeklyProgress('High'),
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
    riskLevel: 'High',
    course: 'Machine Learning Basics',
    lastActive: '4 days ago',
    weeklyProgress: generateWeeklyProgress('High'),
  },
  // Medium Risk Students (4)
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
    riskLevel: 'Medium',
    course: 'Web Development',
    lastActive: '2 days ago',
    weeklyProgress: generateWeeklyProgress('Medium'),
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
    riskLevel: 'Medium',
    course: 'Computer Science 101',
    lastActive: '1 day ago',
    weeklyProgress: generateWeeklyProgress('Medium'),
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
    riskLevel: 'Medium',
    course: 'Database Systems',
    lastActive: '2 days ago',
    weeklyProgress: generateWeeklyProgress('Medium'),
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
    riskLevel: 'Medium',
    course: 'Data Structures',
    lastActive: '1 day ago',
    weeklyProgress: generateWeeklyProgress('Medium'),
  },
  // Low Risk Students (4)
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
    riskLevel: 'Low',
    course: 'Machine Learning Basics',
    lastActive: '2 hours ago',
    weeklyProgress: generateWeeklyProgress('Low'),
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
    riskLevel: 'Low',
    course: 'Web Development',
    lastActive: '5 hours ago',
    weeklyProgress: generateWeeklyProgress('Low'),
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
    riskLevel: 'Low',
    course: 'Computer Science 101',
    lastActive: '1 hour ago',
    weeklyProgress: generateWeeklyProgress('Low'),
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
    riskLevel: 'Low',
    course: 'Database Systems',
    lastActive: '3 hours ago',
    weeklyProgress: generateWeeklyProgress('Low'),
  },
];

export const generateRecoveryPlan = (student: Student): RecoveryPlan => {
  const weakTopics = student.riskLevel === 'High' 
    ? ['Fundamental Concepts', 'Problem Solving', 'Time Management', 'Study Habits']
    : student.riskLevel === 'Medium'
    ? ['Advanced Topics', 'Practical Applications', 'Consistency']
    : ['Optimization', 'Advanced Techniques'];

  return {
    weakTopics,
    dailyStudyHours: student.riskLevel === 'High' ? 4 : student.riskLevel === 'Medium' ? 3 : 2,
    schedule: [
      { day: 'Monday', focus: 'Review fundamentals', duration: '2 hours' },
      { day: 'Tuesday', focus: 'Practice problems', duration: '2 hours' },
      { day: 'Wednesday', focus: 'Concept clarification', duration: '1.5 hours' },
      { day: 'Thursday', focus: 'Group study session', duration: '2 hours' },
      { day: 'Friday', focus: 'Mock tests', duration: '1.5 hours' },
      { day: 'Weekend', focus: 'Self-assessment & revision', duration: '3 hours' },
    ],
    resources: [
      { title: 'Khan Academy - Core Concepts', type: 'Video Course', url: '#' },
      { title: 'Practice Problem Set', type: 'Exercises', url: '#' },
      { title: 'Study Group Discord', type: 'Community', url: '#' },
      { title: 'Office Hours with TA', type: 'Mentorship', url: '#' },
    ],
    strategies: [
      'Break study sessions into 25-minute focused blocks',
      'Review notes within 24 hours of each lecture',
      'Form a study group with 2-3 classmates',
      'Use active recall instead of passive reading',
      'Attend all office hours for difficult topics',
    ],
  };
};

export const getStudentById = (id: string): Student | undefined => {
  return mockStudents.find(s => s.studentId === id);
};

export const getRiskStats = () => {
  const stats = {
    total: mockStudents.length,
    high: mockStudents.filter(s => s.riskLevel === 'High').length,
    medium: mockStudents.filter(s => s.riskLevel === 'Medium').length,
    low: mockStudents.filter(s => s.riskLevel === 'Low').length,
  };
  return stats;
};
