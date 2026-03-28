
-- Experience table
CREATE TABLE public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  period TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Experience is viewable by everyone" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Owner can insert experience" ON public.experience FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update experience" ON public.experience FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete experience" ON public.experience FOR DELETE USING (auth.uid() = user_id);

-- Skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skills are viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Owner can insert skills" ON public.skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update skills" ON public.skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete skills" ON public.skills FOR DELETE USING (auth.uid() = user_id);

-- Education table
CREATE TABLE public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  degree TEXT NOT NULL,
  school TEXT NOT NULL,
  year TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Education is viewable by everyone" ON public.education FOR SELECT USING (true);
CREATE POLICY "Owner can insert education" ON public.education FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update education" ON public.education FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete education" ON public.education FOR DELETE USING (auth.uid() = user_id);

-- Contact info table (key-value)
CREATE TABLE public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, key)
);
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contact info is viewable by everyone" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "Owner can insert contact" ON public.contact_info FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update contact" ON public.contact_info FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete contact" ON public.contact_info FOR DELETE USING (auth.uid() = user_id);

-- About me table (single row per user)
CREATE TABLE public.about_me (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  highlights JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.about_me ENABLE ROW LEVEL SECURITY;
CREATE POLICY "About me is viewable by everyone" ON public.about_me FOR SELECT USING (true);
CREATE POLICY "Owner can insert about" ON public.about_me FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update about" ON public.about_me FOR UPDATE USING (auth.uid() = user_id);

-- Project images (gallery)
CREATE TABLE public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project images are viewable by everyone" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Owner can insert project images" ON public.project_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);
CREATE POLICY "Owner can delete project images" ON public.project_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);
