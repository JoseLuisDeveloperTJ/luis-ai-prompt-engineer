import { Mail, Github, Linkedin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Message sent!', description: 'Thanks for reaching out. I\'ll get back to you soon.' });
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <section id="contact" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Get in <span className="text-gradient">Touch</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded mb-12" />

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
          <div>
            <p className="text-muted-foreground mb-8">
              Interested in collaborating or have a project in mind? Drop me a message!
            </p>
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'hello@aidev.com' },
                { icon: Github, label: 'github.com/yourusername' },
                { icon: Linkedin, label: 'linkedin.com/in/yourusername' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-muted-foreground">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-mono">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="bg-card border-border/50 focus:border-primary"
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
              className="bg-card border-border/50 focus:border-primary"
            />
            <Textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={1000}
              rows={5}
              className="bg-card border-border/50 focus:border-primary resize-none"
            />
            <Button type="submit" variant="hero">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
