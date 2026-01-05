import { Student } from "@/data/mockStudents";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface RiskHeatmapProps {
  students: Student[];
}

export const RiskHeatmap = ({ students }: RiskHeatmapProps) => {
  const navigate = useNavigate();

  const sortedStudents = [...students].sort((a, b) => {
    const riskOrder = { High: 0, Medium: 1, Low: 2 };
    return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
  });

  const getRiskColor = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'High':
        return 'bg-risk-high hover:bg-risk-high/90';
      case 'Medium':
        return 'bg-risk-medium hover:bg-risk-medium/90';
      case 'Low':
        return 'bg-risk-low hover:bg-risk-low/90';
    }
  };

  return (
    <div className="bg-card rounded-xl border shadow-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Risk Distribution</h3>
          <p className="text-sm text-muted-foreground">Click on a student to view details</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-risk-high" />
            <span className="text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-risk-medium" />
            <span className="text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-risk-low" />
            <span className="text-muted-foreground">Low</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {sortedStudents.map((student, index) => (
          <button
            key={student.studentId}
            onClick={() => navigate(`/student/${student.studentId}`)}
            className={cn(
              "aspect-square rounded-lg flex items-center justify-center transition-all duration-200",
              "text-white text-xs font-medium shadow-sm",
              "hover:scale-105 hover:shadow-md cursor-pointer",
              "animate-scale-in",
              getRiskColor(student.riskLevel)
            )}
            style={{ animationDelay: `${index * 30}ms` }}
            title={`${student.name} - ${student.riskLevel} Risk`}
          >
            {student.avatar}
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-risk-high">
              {students.filter(s => s.riskLevel === 'High').length}
            </p>
            <p className="text-xs text-muted-foreground">High Risk</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-risk-medium">
              {students.filter(s => s.riskLevel === 'Medium').length}
            </p>
            <p className="text-xs text-muted-foreground">Medium Risk</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-risk-low">
              {students.filter(s => s.riskLevel === 'Low').length}
            </p>
            <p className="text-xs text-muted-foreground">Low Risk</p>
          </div>
        </div>
      </div>
    </div>
  );
};
