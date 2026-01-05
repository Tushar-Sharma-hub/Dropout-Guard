import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RiskBadge } from '@/components/RiskBadge';
import { 
  GraduationCap, 
  Calendar, 
  ClipboardCheck, 
  TrendingUp, 
  Lightbulb, 
  ArrowRight,
  LogOut,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { generateRecoveryPlan } from '@/data/mockStudents';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentStudent, logout, user } = useAuth();

  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Student data not found</p>
      </div>
    );
  }

  const recoveryPlan = generateRecoveryPlan(currentStudent);
  const avgQuizScore = Math.round(
    currentStudent.quizScores.reduce((a, b) => a + b, 0) / currentStudent.quizScores.length
  );
  const assignmentCompletion = Math.round(
    (currentStudent.assignmentsSubmitted / currentStudent.totalAssignments) * 100
  );

  const quizChartData = currentStudent.quizScores.slice(-6).map((score, index) => ({
    quiz: `Q${index + 1}`,
    score,
  }));

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">dropoutguard</h1>
              <p className="text-xs text-muted-foreground">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Welcome back, {currentStudent.name.split(' ')[0]}!
            </h2>
            <p className="text-muted-foreground">{currentStudent.course}</p>
          </div>
          <Button onClick={() => navigate(`/student/${currentStudent.studentId}/recovery`)}>
            View Full Recovery Plan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Risk Level Card */}
        <Card className={`border-2 ${
          currentStudent.riskLevel === 'High' ? 'border-risk-high/30 bg-risk-high/5' :
          currentStudent.riskLevel === 'Medium' ? 'border-risk-medium/30 bg-risk-medium/5' :
          'border-risk-low/30 bg-risk-low/5'
        }`}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                currentStudent.riskLevel === 'High' ? 'bg-risk-high/20' :
                currentStudent.riskLevel === 'Medium' ? 'bg-risk-medium/20' :
                'bg-risk-low/20'
              }`}>
                <Target className={`w-7 h-7 ${
                  currentStudent.riskLevel === 'High' ? 'text-risk-high' :
                  currentStudent.riskLevel === 'Medium' ? 'text-risk-medium' :
                  'text-risk-low'
                }`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Current Risk Level</p>
                <p className="text-xl font-semibold">
                  {currentStudent.riskLevel === 'High' ? 'Needs Attention' :
                   currentStudent.riskLevel === 'Medium' ? 'Keep Improving' :
                   'On Track'}
                </p>
              </div>
            </div>
            <RiskBadge level={currentStudent.riskLevel} size="lg" showPulse />
          </CardContent>
        </Card>

        {/* Progress Bars */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{currentStudent.attendancePercentage}%</span>
                <span className={`text-sm ${
                  currentStudent.attendancePercentage >= 80 ? 'text-risk-low' :
                  currentStudent.attendancePercentage >= 60 ? 'text-risk-medium' :
                  'text-risk-high'
                }`}>
                  {currentStudent.attendancePercentage >= 80 ? 'Good' :
                   currentStudent.attendancePercentage >= 60 ? 'Needs improvement' :
                   'Critical'}
                </span>
              </div>
              <Progress 
                value={currentStudent.attendancePercentage} 
                className="h-3"
              />
              <p className="text-xs text-muted-foreground">
                Target: 80% minimum attendance required
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
                Assignment Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{assignmentCompletion}%</span>
                <span className="text-sm text-muted-foreground">
                  {currentStudent.assignmentsSubmitted}/{currentStudent.totalAssignments} submitted
                </span>
              </div>
              <Progress 
                value={assignmentCompletion} 
                className="h-3"
              />
              <p className="text-xs text-muted-foreground">
                {currentStudent.totalAssignments - currentStudent.assignmentsSubmitted} assignments pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              Recent Quiz Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-bold">{avgQuizScore}%</div>
              <span className="text-sm text-muted-foreground">Average Score</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizChartData}>
                  <XAxis 
                    dataKey="quiz" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Today's Focus */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              What You Should Focus On Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {recoveryPlan.weakTopics.slice(0, 2).map((topic, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{topic}</p>
                    <p className="text-xs text-muted-foreground">
                      Recommended: {recoveryPlan.dailyStudyHours / 2} hours today
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
              <div>
                <p className="font-medium">Today's Study Goal</p>
                <p className="text-sm text-muted-foreground">
                  Complete {recoveryPlan.dailyStudyHours} hours of focused study
                </p>
              </div>
              <div className="text-2xl font-bold text-primary">
                {recoveryPlan.dailyStudyHours}h
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(`/student/${currentStudent.studentId}/recovery`)}
            >
              View Full Recovery Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentDashboard;
