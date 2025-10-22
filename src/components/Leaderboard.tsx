import { Player } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface LeaderboardProps {
  players: Player[];
  maxDisplay?: number;
}

export const Leaderboard = ({ players, maxDisplay = 10 }: LeaderboardProps) => {
  const topPlayers = players.slice(0, maxDisplay);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-primary" />;
    return <span className="text-muted-foreground font-bold">#{rank}</span>;
  };

  const getRankChange = (player: Player) => {
    if (!player.previousRank || player.previousRank === player.rank) return null;
    
    const change = player.previousRank - player.rank;
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-success text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>+{change}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-destructive text-sm">
          <TrendingDown className="w-4 h-4" />
          <span>{change}</span>
        </div>
      );
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Live Leaderboard
        </h2>
      </div>

      <div className="space-y-3">
        {topPlayers.map((player) => (
          <div
            key={player.id}
            className={`
              flex items-center gap-4 p-4 rounded-lg border transition-all
              ${player.isAnomaly 
                ? 'bg-destructive/10 border-destructive animate-pulse-glow' 
                : 'bg-muted/50 border-border hover:border-primary/50'
              }
              ${player.previousRank !== player.rank ? 'animate-rank-change' : ''}
            `}
          >
            <div className="flex items-center justify-center w-12">
              {getRankIcon(player.rank)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground truncate">
                  {player.username}
                </span>
                {player.isAnomaly && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Anomaly
                  </Badge>
                )}
              </div>
              <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                <span>{player.kills} kills</span>
                <span>{player.wins} wins</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {getRankChange(player)}
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {player.score.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
