import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSkills, useEducation } from '@/hooks/useSiteContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, X, Pencil, Save, GraduationCap, Wrench } from 'lucide-react';

export default function ManageSkillsEducation() {
  const { user } = useAuth();
  const { data: skills } = useSkills();
  const { data: education } = useEducation();
  const { toast } = useToast();
  const qc = useQueryClient();

  // Skills
  const [skillCategory, setSkillCategory] = useState('');
  const [skillName, setSkillName] = useState('');

  const addSkill = async () => {
    if (!user || !skillCategory.trim() || !skillName.trim()) return;
    const { error } = await supabase.from('skills').insert({
      user_id: user.id, category: skillCategory.trim(), name: skillName.trim(),
      sort_order: (skills?.length ?? 0),
    });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    qc.invalidateQueries({ queryKey: ['skills'] });
    setSkillName('');
    toast({ title: 'Skill added!' });
  };

  const deleteSkill = async (id: string) => {
    await supabase.from('skills').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['skills'] });
  };

  // Education
  const [eduForm, setEduForm] = useState({ degree: '', school: '', year: '' });
  const [eduEditing, setEduEditing] = useState<string | null>(null);
  const [eduAdding, setEduAdding] = useState(false);

  const saveEdu = async () => {
    if (!user || !eduForm.degree.trim()) return;
    if (eduEditing) {
      await supabase.from('education').update(eduForm).eq('id', eduEditing);
    } else {
      await supabase.from('education').insert({ ...eduForm, user_id: user.id, sort_order: (education?.length ?? 0) });
    }
    qc.invalidateQueries({ queryKey: ['education'] });
    setEduForm({ degree: '', school: '', year: '' }); setEduAdding(false); setEduEditing(null);
    toast({ title: eduEditing ? 'Updated!' : 'Added!' });
  };

  const deleteEdu = async (id: string) => {
    await supabase.from('education').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['education'] });
  };

  const startEditEdu = (item: any) => {
    setEduEditing(item.id);
    setEduForm({ degree: item.degree, school: item.school, year: item.year });
    setEduAdding(true);
  };

  // Group skills by category
  const grouped = (skills ?? []).reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category]!.push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-10 max-w-3xl">
      {/* SKILLS */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">Skills</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-6">Add skills by category</p>

        <div className="flex gap-2 mb-6">
          <Input value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)}
            placeholder="Category (e.g. AI & ML)" maxLength={100} className="bg-background/50 border-border/50 focus:border-primary" />
          <Input value={skillName} onChange={(e) => setSkillName(e.target.value)}
            placeholder="Skill name" maxLength={100}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
            className="bg-background/50 border-border/50 focus:border-primary" />
          <Button variant="hero" size="icon" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
        </div>

        {Object.entries(grouped).map(([cat, catSkills]) => (
          <div key={cat} className="mb-4 p-4 rounded-xl card-gradient border border-border/50">
            <h3 className="text-sm font-mono text-primary mb-3">{`// ${cat}`}</h3>
            <div className="flex flex-wrap gap-2">
              {catSkills!.map((s) => (
                <Badge key={s.id} variant="secondary" className="gap-1 font-mono text-xs">
                  {s.name}
                  <button onClick={() => deleteSkill(s.id)}><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* EDUCATION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Education</h1>
          </div>
          {!eduAdding && (
            <Button variant="hero" size="sm" onClick={() => setEduAdding(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          )}
        </div>

        {eduAdding && (
          <div className="p-6 rounded-xl card-gradient border border-border/50 space-y-4 mb-6">
            <Input value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              placeholder="Degree *" maxLength={300} className="bg-background/50 border-border/50 focus:border-primary" />
            <div className="grid grid-cols-2 gap-4">
              <Input value={eduForm.school} onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
                placeholder="School" maxLength={300} className="bg-background/50 border-border/50 focus:border-primary" />
              <Input value={eduForm.year} onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                placeholder="Year" maxLength={20} className="bg-background/50 border-border/50 focus:border-primary" />
            </div>
            <div className="flex gap-2">
              <Button variant="hero" size="sm" onClick={saveEdu} disabled={!eduForm.degree.trim()}>
                <Save className="h-4 w-4 mr-1" /> {eduEditing ? 'Update' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setEduAdding(false); setEduEditing(null); setEduForm({ degree: '', school: '', year: '' }); }}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {education?.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-4 rounded-xl card-gradient border border-border/50">
              <div>
                <h3 className="font-medium">{e.degree}</h3>
                <p className="text-xs text-muted-foreground">{e.school} · {e.year}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEditEdu(e)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteEdu(e.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
