import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useExperience } from '@/hooks/useSiteContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Pencil, X, Save } from 'lucide-react';

export default function ManageExperience() {
  const { user } = useAuth();
  const { data: items } = useExperience();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ period: '', job_title: '', company: '', description: '' });
  const [adding, setAdding] = useState(false);

  const resetForm = () => { setForm({ period: '', job_title: '', company: '', description: '' }); setAdding(false); setEditing(null); };

  const handleSave = async () => {
    if (!user || !form.job_title.trim() || !form.period.trim()) return;
    if (editing) {
      const { error } = await supabase.from('experience').update({
        period: form.period, job_title: form.job_title, company: form.company, description: form.description,
      }).eq('id', editing);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    } else {
      const { error } = await supabase.from('experience').insert({
        user_id: user.id, period: form.period, job_title: form.job_title, company: form.company,
        description: form.description, sort_order: (items?.length ?? 0),
      });
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    }
    qc.invalidateQueries({ queryKey: ['experience'] });
    resetForm();
    toast({ title: editing ? 'Updated!' : 'Added!' });
  };

  const handleDelete = async (id: string) => {
    await supabase.from('experience').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['experience'] });
    toast({ title: 'Deleted' });
  };

  const startEdit = (item: any) => {
    setEditing(item.id);
    setForm({ period: item.period, job_title: item.job_title, company: item.company, description: item.description || '' });
    setAdding(true);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Experience</h1>
          <p className="text-muted-foreground text-sm">Manage your work experience entries</p>
        </div>
        {!adding && (
          <Button variant="hero" size="sm" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        )}
      </div>

      {adding && (
        <div className="p-6 rounded-xl card-gradient border border-border/50 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Period *</label>
              <Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}
                placeholder="2023 — Present" maxLength={100} className="bg-background/50 border-border/50 focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Job Title *</label>
              <Input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                placeholder="Senior AI Engineer" maxLength={200} className="bg-background/50 border-border/50 focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Company</label>
            <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Company Name" maxLength={200} className="bg-background/50 border-border/50 focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Description</label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your role..." maxLength={1000} rows={3} className="bg-background/50 border-border/50 focus:border-primary resize-none" />
          </div>
          <div className="flex gap-2">
            <Button variant="hero" size="sm" onClick={handleSave} disabled={!form.job_title.trim() || !form.period.trim()}>
              <Save className="h-4 w-4 mr-1" /> {editing ? 'Update' : 'Save'}
            </Button>
            <Button variant="outline" size="sm" onClick={resetForm}><X className="h-4 w-4 mr-1" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items?.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-xl card-gradient border border-border/50">
            <div>
              <h3 className="font-medium">{item.job_title}</h3>
              <p className="text-xs text-muted-foreground">{item.company} · {item.period}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => startEdit(item)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {(!items || items.length === 0) && !adding && (
          <p className="text-muted-foreground text-sm text-center py-8">No experience entries yet.</p>
        )}
      </div>
    </div>
  );
}
