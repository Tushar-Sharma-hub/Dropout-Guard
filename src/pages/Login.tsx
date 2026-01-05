import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, AlertCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    const redirectPath = user.role === 'teacher' ? '/dashboard' : '/student-dashboard';
    navigate(redirectPath, { replace: true });
    return null;
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    // Pre-fill demo credentials
    if (role === 'teacher') {
      setEmail('teacher@dropoutguard.edu');
    } else {
      setEmail('marcus.chen@university.edu');
    }
    setPassword('demo123');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password, selectedRole);
      if (success) {
        toast.success(`Welcome! Logged in as ${selectedRole}`);
        const redirectPath = selectedRole === 'teacher' ? '/dashboard' : '/student-dashboard';
        navigate(redirectPath, { replace: true });
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">dropoutguard</h1>
          <p className="text-muted-foreground">AI-Powered Student Success Platform</p>
        </div>

        {!selectedRole ? (
          /* Role Selection */
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">Select your role to continue</p>
            
            <Card 
              className="cursor-pointer transition-all hover:border-primary hover:shadow-lg group"
              onClick={() => handleRoleSelect('teacher')}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Teacher / Mentor</h3>
                  <p className="text-sm text-muted-foreground">Monitor all students and manage interventions</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer transition-all hover:border-primary hover:shadow-lg group"
              onClick={() => handleRoleSelect('student')}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors">
                  <GraduationCap className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Student</h3>
                  <p className="text-sm text-muted-foreground">View your progress and recovery plan</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Login Form */
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                {selectedRole === 'teacher' ? (
                  <Users className="w-6 h-6 text-primary" />
                ) : (
                  <GraduationCap className="w-6 h-6 text-primary" />
                )}
              </div>
              <CardTitle>Login as {selectedRole === 'teacher' ? 'Teacher' : 'Student'}</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => {
                    setSelectedRole(null);
                    setEmail('');
                    setPassword('');
                    setError('');
                  }}
                >
                  ← Back to role selection
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Demo mode: Any password (4+ chars) works
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Login;
