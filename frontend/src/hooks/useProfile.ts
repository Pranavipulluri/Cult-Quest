
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/services/authService';
import { profileService, ProfileUpdateData } from '@/services/profileService';
import { useEffect, useState } from 'react';

export type Profile = User;

export function useProfile() {
  const { user, isDemoMode } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !isDemoMode) {
      setProfile(null);
      setLoading(false);
      return;
    }
    
    const fetchProfile = async () => {
      setLoading(true);
      
      if (isDemoMode) {
        // Create a mock profile for demo mode
        const demoRegion = localStorage.getItem('demoUserRegion') || 'Global';
        const demoProfile: Profile = {
          id: 'demo-user',
          username: 'Demo User',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=demouser',
          level: 1,
          xp: 0,
          region: demoRegion,
          bio: 'This is a demo account exploring CulturalQuest.',
          role: 'user'
        };
        
        setProfile(demoProfile);
        setLoading(false);
        return;
      }
      
      try {
        const { profile: fetchedProfile } = await profileService.getProfile();
        setProfile(fetchedProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        // If we have user from auth, use that as fallback
        if (user) {
          setProfile(user);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, isDemoMode]);
  
  const updateProfile = async (updates: ProfileUpdateData) => {
    if (isDemoMode) {
      // In demo mode, we just update the local state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ...updates,
        };
      });
      
      // If updating region, store in localStorage
      if (updates.region) {
        localStorage.setItem('demoUserRegion', updates.region);
      }
      
      toast({
        title: "Profile updated (Demo)",
        description: "Your profile has been updated in demo mode. Note that changes won't persist after you leave.",
      });
      
      return;
    }
    
    if (!user) return;
    
    try {
      const { profile: updatedProfile } = await profileService.updateProfile(updates);
      setProfile(updatedProfile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return {
    profile,
    loading,
    updateProfile
  };
}
