import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { 
  LayoutDashboard, 
  Bell, 
  Shield,
  LogOut
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
];

export const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-accent flex items-center justify-center">
            <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">dropoutguard</h1>
            <p className="text-xs text-sidebar-foreground/60">Teacher Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = location.pathname === href || 
            (href !== '/dashboard' && location.pathname.startsWith(href));
          
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "text-sidebar-foreground/70 hover:text-sidebar-foreground",
                "hover:bg-sidebar-accent",
                isActive && "bg-sidebar-accent text-sidebar-foreground font-medium"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="px-4 py-2">
          <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.email}</p>
          <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
