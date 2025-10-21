
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { LeaderboardUser, profileService } from "@/services/profileService";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

const Scoreboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<LeaderboardUser | null>(null);
  const { user, isDemoMode } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (isDemoMode) {
        // Mock leaderboard for demo mode
        const mockLeaderboard: LeaderboardUser[] = [
          { id: '1', username: 'CulturalExplorer', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=1', level: 15, xp: 15000, region: 'Global', role: 'user', bio: '', rank: 1 },
          { id: '2', username: 'WorldTraveler', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=2', level: 12, xp: 12000, region: 'Kerala', role: 'user', bio: '', rank: 2 },
          { id: '3', username: 'QuestMaster', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=3', level: 10, xp: 10000, region: 'Tamil Nadu', role: 'user', bio: '', rank: 3 },
          { id: 'demo-user', username: 'Demo User', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=demouser', level: 1, xp: 0, region: 'Global', role: 'user', bio: '', rank: 42 },
        ];
        setLeaderboard(mockLeaderboard.slice(0, 3));
        setUserRank(mockLeaderboard[3]);
        setLoading(false);
        return;
      }

      try {
        const { leaderboard: data } = await profileService.getLeaderboard();
        setLeaderboard(data);

        // Find current user's rank
        if (user) {
          const currentUserRank = data.find(item => item.id === user.id);
          if (currentUserRank) {
            setUserRank(currentUserRank);
          }
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user, isDemoMode]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Global Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-center p-3 rounded-lg border ${
                  user && item.id === user.id ? "bg-teal-50 border-teal-200" : "bg-white"
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="font-bold text-lg min-w-8 text-center">
                    {item.rank === 1 && <Trophy className="h-6 w-6 text-yellow-500 mx-auto" />}
                    {item.rank !== 1 && <span>#{item.rank}</span>}
                  </div>
                  <Avatar className="h-12 w-12 border-2 border-white shadow">
                    <AvatarImage src={item.avatar} alt={item.username} />
                    <AvatarFallback>{item.username?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{item.username || "Adventurer"}</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-teal-600 mr-2">
                        Level {item.level}
                      </Badge>
                      <span className="text-sm text-gray-500">{item.xp} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {user && userRank && userRank.rank && userRank.rank > 10 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-teal-50 border-teal-200 border flex items-center p-3 rounded-lg">
              <div className="flex items-center space-x-4 flex-1">
                <div className="font-bold text-lg min-w-8 text-center">
                  #{userRank.rank}
                </div>
                <Avatar className="h-12 w-12 border-2 border-white shadow">
                  <AvatarImage src={userRank.avatar} alt={userRank.username} />
                  <AvatarFallback>{userRank.username?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{userRank.username || "Adventurer"}</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-teal-600 mr-2">
                      Level {userRank.level}
                    </Badge>
                    <span className="text-sm text-gray-500">{userRank.xp} XP</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Scoreboard;
