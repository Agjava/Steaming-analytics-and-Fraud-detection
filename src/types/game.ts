export interface Player {
  id: string;
  username: string;
  score: number;
  kills: number;
  wins: number;
  gamesPlayed: number;
  rank: number;
  previousRank?: number;
  isAnomaly?: boolean;
}

export interface GameEvent {
  id: string;
  type: 'kill' | 'win' | 'score' | 'death';
  playerId: string;
  playerName: string;
  value: number;
  timestamp: number;
  isAnomaly?: boolean;
}

export interface SystemStats {
  eventsPerSecond: number;
  totalEvents: number;
  totalAnomalies: number;
  activePlayers: number;
}
