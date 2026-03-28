import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useContactInfo } from '@/hooks/useSiteContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Save, Mail, Phone, MapPin, Globe } from 'lucide-react';

const PRESET_KEYS = [
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'phone', label: 'Phone', icon: Phone },
  { key: 'location', label: 'Location', icon: MapPin },
  { key: 'github', label: 'GitHub', icon: Globe },
  { key: 'linkedin', label: 'LinkedIn', icon: Globe },
  { key: 'twitter', label: 'Twitter / X', icon: Globe },
  { key: 'website', label: 'Website', icon: Globe },
];

export default function ManageContact() {
  const { user } = useAuth();
  const { data: contacts } = useContactInfo();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [values, setValues] = useState<Record<string, string>>({});

  // Initialize values from data
  const getVal = (key: string) => {
    if (values[key] !== undefined) return values[key];
    return contacts?.find((c) => c.key === key)?.value ?? '';
  };

  const handleSave = async () => {
    if (!user) return;
    const entries = PRESET_KEYS.filter((p) => getVal(p.key).trim());

    for (const p of entries) {
      const existing = contacts?.find((c) => c.key === p.key);
      if (existing) {
        await supabase.from('contact_info').update({ value: getVal(p.key).trim() }).eq('id', existing.id);
      } else {
        await supabase.from('contact_info').insert({
          user_id: user.id, key: p.key, value: getVal(p.key).trim(), sort_order: PRESET_KEYS.findIndex((k) => k.key === p.key),
        });
      }
    }

    // Delete cleared entries
    for (const p of PRESET_KEYS) {
      if (!getVal(p.key).trim()) {
        const existing = contacts?.find((c) => c.key === p.key);
        if (existing) await supabase.from('contact_info').delete().eq('id', existing.id);
      }
    }

    qc.invalidateQueries({ queryKey: ['contact-info'] });
    setValues({});
    toast({ title: 'Contact info saved!' });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold mb-1">Contact Info</h1>
        <p className="text-muted-foreground text-sm">Update your public contact information</p>
      </div>

      <div className="p-6 rounded-xl card-gradient border border-border/50 space-y-4">
        {PRESET_KEYS.map((p) => (
          <div key={p.key} className="flex items-center gap-3">
            <p.icon className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <label className="text-xs font-mono text-muted-foreground mb-1 block">{p.label}</label>
              <Input
                value={getVal(p.key)}
                onChange={(e) => setValues({ ...values, [p.key]: e.target.value })}
                placeholder={`Enter your ${p.label.toLowerCase()}`}
                maxLength={500}
                className="bg-background/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>
        ))}

        <Button variant="hero" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" /> Save All
        </Button>
      </div>
    </div>
  );
}
