import { useState } from "react";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { StudentTable } from "@/components/StudentTable";
import { RiskHeatmap } from "@/components/RiskHeatmap";
import { mockStudents, getRiskStats } from "@/data/mockStudents";
import { Users, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  
  const stats = getRiskStats();

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'All' || student.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor student performance and identify at-risk learners
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Students"
            value={stats.total}
            subtitle="Active in system"
            icon={Users}
          />
          <MetricCard
            title="High Risk"
            value={stats.high}
            subtitle="Require immediate attention"
            icon={AlertTriangle}
            variant="risk-high"
          />
          <MetricCard
            title="Medium Risk"
            value={stats.medium}
            subtitle="Need monitoring"
            icon={Clock}
            variant="risk-medium"
          />
          <MetricCard
            title="Low Risk"
            value={stats.low}
            subtitle="On track"
            icon={TrendingUp}
            variant="risk-low"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Table */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students or courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {(['All', 'High', 'Medium', 'Low'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={riskFilter === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRiskFilter(level)}
                    className={
                      riskFilter === level && level !== 'All'
                        ? level === 'High'
                          ? 'bg-risk-high hover:bg-risk-high/90'
                          : level === 'Medium'
                          ? 'bg-risk-medium hover:bg-risk-medium/90'
                          : 'bg-risk-low hover:bg-risk-low/90'
                        : ''
                    }
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            <StudentTable students={filteredStudents} />
          </div>

          {/* Risk Heatmap */}
          <div className="lg:col-span-1">
            <RiskHeatmap students={mockStudents} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
