import { useNavigate } from "react-router-dom";
import { Student } from "@/data/mockStudents";
import { RiskBadge } from "./RiskBadge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentTableProps {
  students: Student[];
}

export const StudentTable = ({ students }: StudentTableProps) => {
  const navigate = useNavigate();

  const getEngagementTrend = (score: number) => {
    if (score >= 70) return { icon: TrendingUp, color: 'text-risk-low' };
    if (score >= 50) return { icon: Minus, color: 'text-risk-medium' };
    return { icon: TrendingDown, color: 'text-risk-high' };
  };

  const getAverageScore = (scores: number[]) => {
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  return (
    <div className="bg-card rounded-xl border shadow-card overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Attendance
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Avg Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((student, index) => {
              const trend = getEngagementTrend(student.engagementScore);
              const TrendIcon = trend.icon;
              
              return (
                <tr
                  key={student.studentId}
                  className={cn(
                    "hover:bg-muted/30 transition-colors cursor-pointer",
                    "animate-slide-up"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => navigate(`/student/${student.studentId}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {student.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.course}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <span className="text-sm font-medium">{student.attendancePercentage}%</span>
                      <Progress 
                        value={student.attendancePercentage} 
                        className="h-1.5 w-24"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-sm font-medium",
                      getAverageScore(student.quizScores) >= 70 ? "text-risk-low" :
                      getAverageScore(student.quizScores) >= 50 ? "text-risk-medium" :
                      "text-risk-high"
                    )}>
                      {getAverageScore(student.quizScores)}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <TrendIcon className={cn("h-4 w-4", trend.color)} />
                      <span className="text-sm font-medium">{student.engagementScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge level={student.riskLevel} showPulse={student.riskLevel === 'High'} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
