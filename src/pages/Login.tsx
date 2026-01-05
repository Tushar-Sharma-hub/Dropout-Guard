import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, AlertCircle, Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated (but only if we have user data)
  // This hook MUST be called before any conditional returns
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const redirectPath = user.role === 'teacher' ? '/dashboard' : '/student-dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (!authLoading && isAuthenticated && user) {
    return null;
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    // Clear fields - no pre-filling
    setEmail('');
    setPassword('');
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
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Check for Firebase error codes
      if (err.code === 'auth/user-not-found' || err.message?.includes('user-not-found')) {
        setError('No account found with this email address. Please check your email or create an account.');
      } else if (err.code === 'auth/wrong-password' || err.message?.includes('wrong-password')) {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-email' || err.message?.includes('invalid-email')) {
        setError('Invalid email address format.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.message === 'role-mismatch' || err.message?.includes('role')) {
        setError('This account does not match the selected role. Please select the correct role.');
      } else if (err.message?.includes('User data not found')) {
        setError('User account found but data is missing. Please contact support.');
      } else {
        setError(err.message || 'Login failed. Please check your credentials and try again.');
      }
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
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
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
                  Use your Firebase authenticated credentials
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
