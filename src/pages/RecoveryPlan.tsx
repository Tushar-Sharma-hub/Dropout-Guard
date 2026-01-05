import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { RiskBadge } from "@/components/RiskBadge";
import { getStudentById, generateRecoveryPlan } from "@/data/mockStudents";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Clock, 
  ExternalLink,
  Lightbulb,
  Sparkles,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecoveryPlan() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const student = getStudentById(id || '');

  // Students can only view their own recovery plan
  const isStudent = user?.role === 'student';
  const canView = !isStudent || (isStudent && user.studentId === id);

  if (!canView) {
    return (
      <Layout>
        <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You can only view your own recovery plan.</p>
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

  const plan = generateRecoveryPlan(student);

  const iconClasses = {
    video: 'bg-blue-500/10 text-blue-500',
    exercises: 'bg-purple-500/10 text-purple-500',
    community: 'bg-green-500/10 text-green-500',
    mentorship: 'bg-amber-500/10 text-amber-500',
  };

  const backPath = isStudent ? '/student-dashboard' : `/student/${student.studentId}`;
  const backLabel = isStudent ? 'Back to My Dashboard' : 'Back to Profile';

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

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 mb-6 text-primary-foreground animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">AI-Generated Recovery Plan</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-4 border-primary-foreground/20">
                <AvatarFallback className="bg-primary-foreground text-primary text-lg font-semibold">
                  {student.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{isStudent ? 'Your Recovery Plan' : student.name}</h1>
                <p className="opacity-90">{student.course}</p>
              </div>
            </div>
            <RiskBadge level={student.riskLevel} size="lg" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weak Topics */}
            <div className="bg-card rounded-xl border shadow-card p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-risk-high" />
                <h2 className="font-semibold text-lg">Areas for Improvement</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {plan.weakTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-risk-high-bg text-risk-high rounded-full text-sm font-medium animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="bg-card rounded-xl border shadow-card p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg">Recommended Study Schedule</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plan.schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="w-20 text-sm font-semibold text-primary">
                      {item.day}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.focus}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategies */}
            <div className="bg-card rounded-xl border shadow-card p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-risk-medium" />
                <h2 className="font-semibold text-lg">Study Strategies</h2>
              </div>
              <ul className="space-y-3">
                {plan.strategies.map((strategy, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Study Hours */}
            <div className="bg-card rounded-xl border shadow-card p-6 animate-fade-in">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Recommended Daily Study</p>
                <p className="text-5xl font-bold text-primary">{plan.dailyStudyHours}</p>
                <p className="text-lg text-muted-foreground">hours</p>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-card rounded-xl border shadow-card p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Recommended Resources</h2>
              </div>
              <div className="space-y-3">
                {plan.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      iconClasses[resource.type.toLowerCase().replace(' ', '') as keyof typeof iconClasses] || 'bg-primary/10 text-primary'
                    )}>
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">{resource.type}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
