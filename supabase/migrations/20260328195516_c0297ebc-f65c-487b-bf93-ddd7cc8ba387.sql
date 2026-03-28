
-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  cover_type TEXT DEFAULT 'image' CHECK (cover_type IN ('image', 'video')),
  skills TEXT[] DEFAULT '{}',
  github_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Users can create their own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for project covers
INSERT INTO storage.buckets (id, name, public) VALUES ('project-covers', 'project-covers', true);

CREATE POLICY "Project covers are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'project-covers');
CREATE POLICY "Authenticated users can upload project covers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-covers' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own project covers" ON storage.objects FOR UPDATE USING (bucket_id = 'project-covers' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own project covers" ON storage.objects FOR DELETE USING (bucket_id = 'project-covers' AND auth.role() = 'authenticated');

-- Site visits tracking
CREATE TABLE public.site_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL DEFAULT '/',
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  referrer TEXT
);

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log visits" ON public.site_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read visits" ON public.site_visits FOR SELECT USING (auth.role() = 'authenticated');
