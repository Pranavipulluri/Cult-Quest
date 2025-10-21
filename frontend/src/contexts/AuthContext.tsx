import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '../hooks/use-toast';
import { authService, User } from '../services/authService';

type AuthContextProps = {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, region?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isDemoMode: boolean;
  enterDemoMode: (region?: string) => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for demo mode
    const demoMode = localStorage.getItem('culturalQuestDemoMode') === 'true';
    if (demoMode) {
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    // Verify existing session
    const verifySession = async () => {
      try {
        const { user: verifiedUser } = await authService.verifyAuth();
        setUser(verifiedUser);
      } catch (error) {
        console.log('No active session');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const { user: loggedInUser, message } = await authService.signIn({ username, password });
      setUser(loggedInUser);
      
      toast({
        title: "Welcome back!",
        description: message,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to sign in. Please check your credentials.';
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  };

  const signUp = async (username: string, password: string, region?: string) => {
    try {
      const { user: newUser, message } = await authService.signUp({ username, password, region });
      setUser(newUser);
      
      toast({
        title: "Account created!",
        description: message,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create account. Please try again.';
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Clear user anyway
      setUser(null);
    }
  };

  const enterDemoMode = (region?: string) => {
    localStorage.setItem('culturalQuestDemoMode', 'true');
    localStorage.setItem('demoUserRegion', region || 'Global');
    setIsDemoMode(true);
    
    toast({
      title: "Demo Mode Activated",
      description: `You're now exploring CulturalQuest in Demo Mode. Region: ${region || 'Global'}`,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isDemoMode,
        enterDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
