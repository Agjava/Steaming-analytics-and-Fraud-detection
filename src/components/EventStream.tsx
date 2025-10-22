import { useEffect, useRef } from 'react';
import { GameEvent } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Target, Trophy, Skull, AlertTriangle } from 'lucide-react';

interface EventStreamProps {
  events: GameEvent[];
  maxDisplay?: number;
}

export const EventStream = ({ events, maxDisplay = 50 }: EventStreamProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [events]);

  const getEventIcon = (type: GameEvent['type']) => {
    switch (type) {
      case 'kill':
        return <Target className="w-4 h-4" />;
      case 'win':
        return <Trophy className="w-4 h-4" />;
      case 'score':
        return <Activity className="w-4 h-4" />;
      case 'death':
        return <Skull className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: GameEvent['type'], isAnomaly?: boolean) => {
    if (isAnomaly) return 'text-destructive';
    switch (type) {
      case 'kill':
        return 'text-primary';
      case 'win':
        return 'text-success';
      case 'score':
        return 'text-accent';
      case 'death':
        return 'text-muted-foreground';
    }
  };

  const formatValue = (event: GameEvent) => {
    if (event.type === 'win') return '+1 WIN';
    if (event.value > 0) return `+${event.value}`;
    return event.value;
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 p-6 flex flex-col h-[600px]">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Event Stream
        </h2>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
      >
        {events.slice(0, maxDisplay).map((event) => (
          <div
            key={event.id}
            className={`
              flex items-center gap-3 p-3 rounded-lg border animate-slide-up
              ${event.isAnomaly 
                ? 'bg-destructive/10 border-destructive' 
                : 'bg-muted/30 border-border'
              }
            `}
          >
            <div className={`${getEventColor(event.type, event.isAnomaly)}`}>
              {getEventIcon(event.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground truncate">
                  {event.playerName}
                </span>
                {event.isAnomaly && (
                  <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {event.type}
              </div>
            </div>

            <Badge 
              variant={event.isAnomaly ? "destructive" : "secondary"}
              className="font-mono"
            >
              {formatValue(event)}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};
