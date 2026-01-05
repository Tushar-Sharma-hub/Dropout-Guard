import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { RiskBadge } from "@/components/RiskBadge";
import { PerformanceChart } from "@/components/PerformanceChart";
import { getStudentById } from "@/data/mockStudents";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Clock, 
  FileText, 
  Mail,
  Sparkles,
  Target
} from "lucide-react";

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const student = getStudentById(id || '');

  // Students can only view their own profile
  const isStudent = user?.role === 'student';
  const canView = !isStudent || (isStudent && user.studentId === id);

  if (!canView) {
    return (
      <Layout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You can only view your own profile.</p>
          <Button onClick={() => navigate('/student-dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-bold mb-4">Student Not Found</h2>
          <Button onClick={() => navigate(isStudent ? '/student-dashboard' : '/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const averageScore = Math.round(
    student.quizScores.reduce((a, b) => a + b, 0) / student.quizScores.length
  );

  const backPath = isStudent ? '/student-dashboard' : '/dashboard';
  const backLabel = isStudent ? 'Back to My Dashboard' : 'Back to Dashboard';

  return (
    <Layout>
      <div className="p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>

        {/* Student Header */}
        <div className="bg-card rounded-xl border shadow-card p-6 mb-6 animate-slide-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                  {student.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">{student.name}</h1>
                  <RiskBadge level={student.riskLevel} showPulse={student.riskLevel === 'High'} />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {student.course}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {student.email}
                  </span>
                </div>
              </div>
            </div>
            <Link to={`/student/${student.studentId}/recovery`}>
              <Button className="gap-2">
                <Sparkles className="h-4 w-4" />
                {isStudent ? 'View Recovery Plan' : 'Generate Recovery Plan'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Attendance Rate"
            value={`${student.attendancePercentage}%`}
            icon={Calendar}
            variant={
              student.attendancePercentage >= 80 ? 'risk-low' :
              student.attendancePercentage >= 60 ? 'risk-medium' : 'risk-high'
            }
          />
          <MetricCard
            title="Average Score"
            value={`${averageScore}%`}
            icon={Target}
            variant={
              averageScore >= 70 ? 'risk-low' :
              averageScore >= 50 ? 'risk-medium' : 'risk-high'
            }
          />
          <MetricCard
            title="Assignments"
            value={`${student.assignmentsSubmitted}/${student.totalAssignments}`}
            subtitle={`${Math.round((student.assignmentsSubmitted / student.totalAssignments) * 100)}% completion`}
            icon={FileText}
            variant={
              student.assignmentsSubmitted >= student.totalAssignments * 0.8 ? 'risk-low' :
              student.assignmentsSubmitted >= student.totalAssignments * 0.5 ? 'risk-medium' : 'risk-high'
            }
          />
          <MetricCard
            title="Engagement"
            value={`${student.engagementScore}%`}
            subtitle={`Last active: ${student.lastActive}`}
            icon={Clock}
            variant={
              student.engagementScore >= 70 ? 'risk-low' :
              student.engagementScore >= 50 ? 'risk-medium' : 'risk-high'
            }
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart scores={student.quizScores} />
          
          {/* Weekly Progress */}
          <div className="bg-card rounded-xl border shadow-card p-6 animate-fade-in">
            <div className="mb-6">
              <h3 className="font-semibold text-lg">Weekly Progress</h3>
              <p className="text-sm text-muted-foreground">Engagement over the last 12 weeks</p>
            </div>
            <div className="space-y-3">
              {student.weeklyProgress.slice(-6).map((progress, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Week {student.weeklyProgress.length - 5 + index}</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className={`h-2 ${
                      progress >= 70 ? '[&>div]:bg-risk-low' :
                      progress >= 50 ? '[&>div]:bg-risk-medium' :
                      '[&>div]:bg-risk-high'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
