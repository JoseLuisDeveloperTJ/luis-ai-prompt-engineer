import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProjects } from '@/hooks/useProjects';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Eye, FolderOpen, TrendingUp, Clock } from 'lucide-react';
import { useMemo } from 'react';

function useVisitStats() {
  return useQuery({
    queryKey: ['visit-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_visits')
        .select('*')
        .order('visited_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export default function DashboardOverview() {
  const { data: visits } = useVisitStats();
  const { data: projects } = useProjects();

  const totalVisits = visits?.length ?? 0;
  const totalProjects = projects?.length ?? 0;

  const last7Days = useMemo(() => {
    if (!visits) return [];
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days[key] = 0;
    }
    visits.forEach((v) => {
      const key = v.visited_at.split('T')[0];
      if (key in days) days[key]++;
    });
    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
      visits: count,
    }));
  }, [visits]);

  const topPages = useMemo(() => {
    if (!visits) return [];
    const pages: Record<string, number> = {};
    visits.forEach((v) => {
      pages[v.page] = (pages[v.page] || 0) + 1;
    });
    return Object.entries(pages)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [visits]);

  const todayVisits = useMemo(() => {
    if (!visits) return 0;
    const today = new Date().toISOString().split('T')[0];
    return visits.filter((v) => v.visited_at.startsWith(today)).length;
  }, [visits]);

  const stats = [
    { label: 'Total Visits', value: totalVisits, icon: Eye, color: 'text-primary' },
    { label: 'Today', value: todayVisits, icon: TrendingUp, color: 'text-primary' },
    { label: 'Projects', value: totalProjects, icon: FolderOpen, color: 'text-primary' },
    { label: 'Last Visit', value: visits?.[0] ? new Date(visits[0].visited_at).toLocaleTimeString() : '—', icon: Clock, color: 'text-primary' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your portfolio performance</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl card-gradient border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground font-mono">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl card-gradient border border-border/50">
          <h3 className="text-sm font-mono text-muted-foreground mb-4">Visits — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={last7Days}>
              <defs>
                <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
              <XAxis dataKey="date" stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(220, 18%, 8%)',
                  border: '1px solid hsl(220, 14%, 16%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 20%, 92%)',
                }}
              />
              <Area type="monotone" dataKey="visits" stroke="hsl(160, 84%, 39%)" fill="url(#visitGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-xl card-gradient border border-border/50">
          <h3 className="text-sm font-mono text-muted-foreground mb-4">Top Pages</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topPages} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
              <XAxis type="number" stroke="hsl(215, 15%, 55%)" fontSize={12} />
              <YAxis dataKey="page" type="category" stroke="hsl(215, 15%, 55%)" fontSize={12} width={80} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(220, 18%, 8%)',
                  border: '1px solid hsl(220, 14%, 16%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 20%, 92%)',
                }}
              />
              <Bar dataKey="count" fill="hsl(160, 84%, 39%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
