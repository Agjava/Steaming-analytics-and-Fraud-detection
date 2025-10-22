import { GameEvent, Player } from '@/types/game';

const PLAYER_NAMES = [
  'Shadow', 'Phoenix', 'Viper', 'Ghost', 'Reaper', 'Titan', 'Storm', 'Blaze',
  'Frost', 'Nova', 'Hawk', 'Raven', 'Wolf', 'Dragon', 'Cobra', 'Eagle',
  'Thunder', 'Lightning', 'Inferno', 'Cyclone', 'Phantom', 'Specter',
  'Nemesis', 'Apex', 'Vertex', 'Zenith', 'Cipher', 'Vector', 'Matrix', 'Nexus'
];

const EVENT_TYPES: GameEvent['type'][] = ['kill', 'score', 'win', 'death'];

let eventCounter = 0;
let playerPool: Map<string, Player> = new Map();

// Initialize player pool
for (let i = 0; i < 30; i++) {
  const id = `player_${i}`;
  playerPool.set(id, {
    id,
    username: PLAYER_NAMES[i % PLAYER_NAMES.length] + (i > PLAYER_NAMES.length ? i : ''),
    score: Math.floor(Math.random() * 1000),
    kills: Math.floor(Math.random() * 50),
    wins: Math.floor(Math.random() * 10),
    gamesPlayed: Math.floor(Math.random() * 100) + 10,
    rank: 0,
  });
}

export const generateGameEvent = (): GameEvent => {
  const players = Array.from(playerPool.values());
  const player = players[Math.floor(Math.random() * players.length)];
  const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  
  let value: number;
  let isAnomaly = false;

  // Determine event value and check for anomalies
  switch (eventType) {
    case 'kill':
      value = 1;
      // Anomaly: Too many kills in short time (would be detected by tracking rate)
      isAnomaly = Math.random() < 0.02;
      break;
    case 'score':
      value = Math.floor(Math.random() * 50) + 10;
      // Anomaly: Suspiciously high score gain
      isAnomaly = value > 45;
      break;
    case 'win':
      value = 100;
      // Anomaly: Too many wins (would be detected by tracking win rate)
      isAnomaly = Math.random() < 0.01;
      break;
    case 'death':
      value = -5;
      break;
  }

  eventCounter++;
  return {
    id: `event_${eventCounter}`,
    type: eventType,
    playerId: player.id,
    playerName: player.username,
    value,
    timestamp: Date.now(),
    isAnomaly,
  };
};

export const processEvent = (event: GameEvent, players: Map<string, Player>): Player[] => {
  const player = players.get(event.playerId);
  if (!player) return Array.from(players.values());

  // Update player stats based on event
  switch (event.type) {
    case 'kill':
      player.kills += event.value;
      player.score += 10;
      break;
    case 'score':
      player.score += event.value;
      break;
    case 'win':
      player.wins += 1;
      player.score += event.value;
      break;
    case 'death':
      // Deaths don't change much
      break;
  }

  // Flag player if event is anomalous
  if (event.isAnomaly) {
    player.isAnomaly = true;
    // Clear anomaly flag after a delay
    setTimeout(() => {
      player.isAnomaly = false;
    }, 3000);
  }

  // Convert to array and sort by score
  const playersArray = Array.from(players.values());
  playersArray.sort((a, b) => b.score - a.score);

  // Update ranks
  playersArray.forEach((p, index) => {
    p.previousRank = p.rank;
    p.rank = index + 1;
  });

  return playersArray;
};

export const getInitialPlayers = (): Player[] => {
  const players = Array.from(playerPool.values());
  players.sort((a, b) => b.score - a.score);
  players.forEach((p, index) => {
    p.rank = index + 1;
    p.previousRank = index + 1;
  });
  return players;
};

export { playerPool };
