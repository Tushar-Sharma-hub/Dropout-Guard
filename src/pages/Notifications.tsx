import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { RiskBadge } from "@/components/RiskBadge";
import { mockStudents } from "@/data/mockStudents";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  AlertTriangle, 
  Bell, 
  Check, 
  ChevronRight,
  Clock,
  TrendingDown,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: 'high_risk' | 'declining' | 'missed_assignments';
  studentId: string;
  studentName: string;
  studentAvatar: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const generateNotifications = (): Notification[] => {
  const highRiskStudents = mockStudents.filter(s => s.riskLevel === 'High');
  const notifications: Notification[] = [];

  highRiskStudents.forEach((student, index) => {
    notifications.push({
      id: `notif-${index}-1`,
      type: 'high_risk',
      studentId: student.studentId,
      studentName: student.name,
      studentAvatar: student.avatar,
      message: `${student.name} has been flagged as high risk with ${student.attendancePercentage}% attendance and ${student.engagementScore}% engagement.`,
      timestamp: '2 hours ago',
      read: false,
    });
  });

  // Add some declining students
  mockStudents.filter(s => s.riskLevel === 'Medium').slice(0, 2).forEach((student, index) => {
    notifications.push({
      id: `notif-declining-${index}`,
      type: 'declining',
      studentId: student.studentId,
      studentName: student.name,
      studentAvatar: student.avatar,
      message: `${student.name}'s performance has been declining over the past 2 weeks.`,
      timestamp: '5 hours ago',
      read: true,
    });
  });

  return notifications;
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(generateNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'high_risk':
        return <AlertTriangle className="h-5 w-5 text-risk-high" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-risk-medium" />;
      case 'missed_assignments':
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Layout>
      <div className="p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-1 bg-risk-high text-white text-sm font-medium rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              Stay updated on student alerts and interventions
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={cn(
                  "bg-card rounded-xl border shadow-card p-4 transition-all hover:shadow-card-hover cursor-pointer animate-slide-up",
                  !notification.read && "border-l-4 border-l-risk-high"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  markAsRead(notification.id);
                  navigate(`/student/${notification.studentId}`);
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {notification.studentAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{notification.studentName}</span>
                      {notification.type === 'high_risk' && (
                        <RiskBadge level="High" size="sm" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
