import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, X, Github, Plus, Trash2, Image, Video } from 'lucide-react';

export default function UploadProjects() {
  const { user } = useAuth();
  const { data: projects } = useProjects();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverType, setCoverType] = useState<'image' | 'video'>('image');
  const [uploading, setUploading] = useState(false);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;
    setUploading(true);

    let cover_url: string | null = null;

    if (coverFile) {
      const ext = coverFile.name.split('.').pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('project-covers')
        .upload(path, coverFile);
      if (uploadError) {
        toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
        setUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('project-covers').getPublicUrl(path);
      cover_url = urlData.publicUrl;
    }

    const { error } = await supabase.from('projects').insert({
      user_id: user.id,
      name: name.trim(),
      description: description.trim() || null,
      cover_url,
      cover_type: coverFile ? coverType : null,
      skills: skills.length > 0 ? skills : null,
      github_link: githubLink.trim() || null,
    });

    setUploading(false);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Project created!', description: 'It\'s now visible on your portfolio.' });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setName('');
      setDescription('');
      setSkills([]);
      setGithubLink('');
      setCoverFile(null);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project deleted' });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold mb-1">Upload Projects</h1>
        <p className="text-muted-foreground text-sm">Add new projects to your portfolio</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-xl card-gradient border border-border/50 space-y-5">
        <div>
          <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Project Name *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My AI Project"
            required
            maxLength={200}
            className="bg-background/50 border-border/50 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Cover (Image or Video)</label>
          <div className="flex gap-2 mb-2">
            <Button type="button" variant={coverType === 'image' ? 'default' : 'outline'} size="sm" onClick={() => setCoverType('image')}>
              <Image className="h-4 w-4 mr-1" /> Image
            </Button>
            <Button type="button" variant={coverType === 'video' ? 'default' : 'outline'} size="sm" onClick={() => setCoverType('video')}>
              <Video className="h-4 w-4 mr-1" /> Video
            </Button>
          </div>
          <Input
            type="file"
            accept={coverType === 'image' ? 'image/*' : 'video/*'}
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
            className="bg-background/50 border-border/50"
          />
          {coverFile && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span>{coverFile.name}</span>
              <button type="button" onClick={() => setCoverFile(null)} className="text-destructive hover:text-destructive/80">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project..."
            maxLength={2000}
            rows={4}
            className="bg-background/50 border-border/50 focus:border-primary resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-mono text-muted-foreground mb-1.5 block">Skills / Technologies</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g. Python, PyTorch..."
              maxLength={50}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              className="bg-background/50 border-border/50 focus:border-primary"
            />
            <Button type="button" variant="outline" size="icon" onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1 font-mono text-xs">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-mono text-muted-foreground mb-1.5 block">GitHub Link</label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              placeholder="https://github.com/..."
              maxLength={500}
              className="pl-10 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>

        <Button type="submit" variant="hero" disabled={uploading || !name.trim()}>
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Publish Project'}
        </Button>
      </form>

      {/* Existing projects */}
      {projects && projects.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Your Projects</h2>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl card-gradient border border-border/50">
                <div className="flex items-center gap-4">
                  {p.cover_url && (
                    <img src={p.cover_url} alt={p.name} className="w-16 h-12 object-cover rounded-md" />
                  )}
                  <div>
                    <h3 className="font-medium">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
