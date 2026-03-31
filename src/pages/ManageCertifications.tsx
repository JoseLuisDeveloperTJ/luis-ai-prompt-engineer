import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCertifications } from '@/hooks/useSiteContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Pencil, X, Save } from 'lucide-react';

export default function ManageCertifications() {
  const { user } = useAuth();
  const { data: items } = useCertifications();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', issuer: '', date: '', credential_id: '', link: '' });
  const [adding, setAdding] = useState(false);

  const resetForm = () => { setForm({ title: '', issuer: '', date: '', credential_id: '', link: '' }); setAdding(false); setEditing(null); };

  const handleSave = async () => {
    if (!user || !form.title.trim() || !form.issuer.trim() || !form.date.trim()) return;
    if (editing) {
      const { error } = await supabase.from('certifications').update({
        title: form.title, issuer: form.issuer, date: form.date,
        credential_id: form.credential_id || null, link: form.link || null,
      }).eq('id', editing);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    } else {
      const { error } = await supabase.from('certifications').insert({
        user_id: user.id, title: form.title, issuer: form.issuer, date: form.date,
        credential_id: form.credential_id || null, link: form.link || null,
        sort_order: (items?.length ?? 0),
      });
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    }
    qc.invalidateQueries({ queryKey: ['certifications'] });
    resetForm();
    toast({ title: editing ? 'Updated!' : 'Added!' });
  };

  const handleDelete = async (id: string) => {
    await supabase.from('certifications').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['certifications'] });
    toast({ title: 'Deleted' });
  };

  const startEdit = (item: any) => {
    setEditing(item.id);
    setForm({ title: item.title, issuer: item.issuer, date: item.date, credential_id: item.credential_id || '', link: item.link || '' });
    setAdding(true);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Certifications</h1>
          <p className="text-muted-foreground text-sm">Manage your certifications and credentials</p>
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
              <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Title *</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="AWS Certified ML" maxLength={200} className="bg-background/50 border-border/50 focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Issuer *</label>
              <Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                placeholder="Amazon Web Services" maxLength={200} className="bg-background/50 border-border/50 focus:border-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Date *</label>
              <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="2024" maxLength={50} className="bg-background/50 border-border/50 focus:border-primary" />
            </div>
            <div>
              <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Credential ID</label>
              <Input value={form.credential_id} onChange={(e) => setForm({ ...form, credential_id: e.target.value })}
                placeholder="ABC-123-XYZ" maxLength={200} className="bg-background/50 border-border/50 focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Verification Link</label>
            <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://verify.example.com/..." maxLength={500} className="bg-background/50 border-border/50 focus:border-primary" />
          </div>
          <div className="flex gap-2">
            <Button variant="hero" size="sm" onClick={handleSave} disabled={!form.title.trim() || !form.issuer.trim() || !form.date.trim()}>
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
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.issuer} · {item.date}</p>
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
          <p className="text-muted-foreground text-sm text-center py-8">No certifications yet.</p>
        )}
      </div>
    </div>
  );
}
