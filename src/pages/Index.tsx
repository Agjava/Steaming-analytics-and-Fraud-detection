import { useState, useEffect, useCallback } from 'react';
import { GameEvent, Player, SystemStats } from '@/types/game';
import { generateGameEvent, processEvent, getInitialPlayers, playerPool } from '@/utils/dataSimulator';
import { Leaderboard } from '@/components/Leaderboard';
import { EventStream } from '@/components/EventStream';
import { StatsPanel } from '@/components/StatsPanel';
import { Button } from '@/components/ui/button';
import { Play, Pause, Zap } from 'lucide-react';

const Index = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [players, setPlayers] = useState<Player[]>(() => getInitialPlayers());
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    eventsPerSecond: 0,
    totalEvents: 0,
    totalAnomalies: 0,
    activePlayers: playerPool.size,
  });

  // Track events per second
  const [recentEvents, setRecentEvents] = useState<number[]>([]);

  const processNewEvent = useCallback(() => {
    const newEvent = generateGameEvent();
    
    setEvents((prev) => [newEvent, ...prev].slice(0, 100));
    setPlayers((prev) => {
      const playersMap = new Map(prev.map(p => [p.id, p]));
      return processEvent(newEvent, playersMap);
    });
    
    setStats((prev) => ({
      ...prev,
      totalEvents: prev.totalEvents + 1,
      totalAnomalies: prev.totalAnomalies + (newEvent.isAnomaly ? 1 : 0),
    }));

    setRecentEvents((prev) => [...prev, Date.now()]);
  }, []);

  // Calculate events per second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const recentCount = recentEvents.filter(t => now - t < 1000).length;
      setStats((prev) => ({ ...prev, eventsPerSecond: recentCount }));
      setRecentEvents((prev) => prev.filter(t => now - t < 1000));
    }, 100);

    return () => clearInterval(interval);
  }, [recentEvents]);

  // Main event generation loop
  useEffect(() => {
    if (!isRunning) return;

    // Generate events at varying rates (10-50 per second)
    const minInterval = 20; // 50 events/sec
    const maxInterval = 100; // 10 events/sec

    const scheduleNext = () => {
      const interval = Math.random() * (maxInterval - minInterval) + minInterval;
      return setTimeout(() => {
        processNewEvent();
        if (isRunning) {
          timeoutRef.current = scheduleNext();
        }
      }, interval);
    };

    let timeoutRef = { current: scheduleNext() };

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isRunning, processNewEvent]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-primary/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Real-Time Data Pipeline
                </h1>
                <p className="text-sm text-muted-foreground">
                  Streaming Analytics & Fraud Detection
                </p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setIsRunning(!isRunning)}
              className={`gap-2 ${isRunning ? 'bg-destructive hover:bg-destructive/90' : ''}`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Stop Stream
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Stream
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Panel */}
        <div className="mb-8">
          <StatsPanel stats={stats} />
        </div>

        {/* Leaderboard and Event Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Leaderboard players={players} />
          <EventStream events={events} />
        </div>
      </div>
    </div>
  );
};

export default Index;
