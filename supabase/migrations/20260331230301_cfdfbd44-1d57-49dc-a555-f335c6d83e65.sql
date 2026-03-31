
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  credential_id TEXT,
  link TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certifications are viewable by everyone" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Owner can insert certifications" ON public.certifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update certifications" ON public.certifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete certifications" ON public.certifications FOR DELETE USING (auth.uid() = user_id);
