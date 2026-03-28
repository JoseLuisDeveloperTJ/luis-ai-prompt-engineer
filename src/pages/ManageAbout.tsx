import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAboutMe } from '@/hooks/useSiteContent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Save, Plus, X, User } from 'lucide-react';

export default function ManageAbout() {
  const { user } = useAuth();
  const { data: aboutData } = useAboutMe();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [content, setContent] = useState('');
  const [highlights, setHighlights] = useState<{ icon: string; title: string; desc: string }[]>([]);
  const [newHighlight, setNewHighlight] = useState({ title: '', desc: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (aboutData) {
      setContent(aboutData.content || '');
      setHighlights(Array.isArray(aboutData.highlights) ? (aboutData.highlights as any[]) : []);
    }
  }, [aboutData]);

  const addHighlight = () => {
    if (!newHighlight.title.trim()) return;
    setHighlights([...highlights, { icon: '✦', ...newHighlight }]);
    setNewHighlight({ title: '', desc: '' });
  };

  const removeHighlight = (i: number) => setHighlights(highlights.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    const payload = { content, highlights: JSON.stringify(highlights), updated_at: new Date().toISOString() };

    if (aboutData) {
      const { error } = await supabase.from('about_me').update(payload).eq('id', aboutData.id);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setLoading(false); return; }
    } else {
      const { error } = await supabase.from('about_me').insert({ user_id: user.id, ...payload });
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); setLoading(false); return; }
    }

    qc.invalidateQueries({ queryKey: ['about-me'] });
    setLoading(false);
    toast({ title: 'About section saved!' });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold">About Me</h1>
      </div>
      <p className="text-muted-foreground text-sm">Edit your biographical introduction</p>

      <div className="p-6 rounded-xl card-gradient border border-border/50 space-y-6">
        <div>
          <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Bio Text</label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="Write about yourself..." rows={6} maxLength={3000}
            className="bg-background/50 border-border/50 focus:border-primary resize-none" />
        </div>

        <div>
          <label className="text-sm font-mono text-muted-foreground mb-3 block">Highlights / Specialties</label>
          <div className="space-y-3 mb-4">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/30">
                <div className="flex-1">
                  <p className="font-medium text-sm">{h.title}</p>
                  <p className="text-xs text-muted-foreground">{h.desc}</p>
                </div>
                <button onClick={() => removeHighlight(i)}><X className="h-4 w-4 text-destructive" /></button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input value={newHighlight.title} onChange={(e) => setNewHighlight({ ...newHighlight, title: e.target.value })}
              placeholder="Title (e.g. Machine Learning)" maxLength={100} className="bg-background/50 border-border/50 focus:border-primary" />
            <Input value={newHighlight.desc} onChange={(e) => setNewHighlight({ ...newHighlight, desc: e.target.value })}
              placeholder="Short description" maxLength={200} className="bg-background/50 border-border/50 focus:border-primary" />
            <Button type="button" variant="outline" size="icon" onClick={addHighlight}><Plus className="h-4 w-4" /></Button>
          </div>
        </div>

        <Button variant="hero" onClick={handleSave} disabled={loading}>
          <Save className="h-4 w-4 mr-2" /> {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
