import { SystemStats } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Activity, Database, AlertTriangle, Users } from 'lucide-react';

interface StatsPanelProps {
  stats: SystemStats;
}

export const StatsPanel = ({ stats }: StatsPanelProps) => {
  const statItems = [
    {
      icon: Activity,
      label: 'Events/Second',
      value: stats.eventsPerSecond.toFixed(1),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Database,
      label: 'Total Events',
      value: stats.totalEvents.toLocaleString(),
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: AlertTriangle,
      label: 'Anomalies Detected',
      value: stats.totalAnomalies.toLocaleString(),
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      icon: Users,
      label: 'Active Players',
      value: stats.activePlayers.toLocaleString(),
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <Card
          key={item.label}
          className="bg-card/80 backdrop-blur-sm border-primary/20 p-6 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-2">
                {item.label}
              </div>
              <div className={`text-3xl font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
