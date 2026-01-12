import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">AI Fitness</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 12, 2026</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly, including account details, health metrics, 
              workout data, and uploaded documents like lab reports. We also collect usage data and 
              device information automatically.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              Your data powers our AI to deliver personalized fitness recommendations. We use it to 
              provide and improve our services, communicate with you, ensure security, and comply 
              with legal obligations.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement industry-standard security measures including encryption, secure servers, 
              and access controls. Your health data is treated with the highest level of protection. 
              However, no system is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell your personal data. We may share data with service providers who help 
              operate our platform, when required by law, or with your explicit consent. AI training 
              uses anonymized, aggregated data only.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to access, correct, or delete your personal data. You can export 
              your data at any time. You may opt out of marketing communications while still 
              receiving essential service updates.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Cookies and Tracking</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar technologies for authentication, preferences, and analytics. 
              You can manage cookie preferences in your browser settings. Some features may not work 
              properly if cookies are disabled.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We retain your data as long as your account is active or as needed to provide services. 
              After account deletion, we may retain anonymized data for analytics and legal compliance 
              for a limited period.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
            <p className="text-muted-foreground mb-4">
              Our services are not intended for users under 16 years of age. We do not knowingly 
              collect personal information from children. If we discover such data, we will delete 
              it promptly.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. International Transfers</h2>
            <p className="text-muted-foreground mb-4">
              Your data may be processed in countries other than your own. We ensure appropriate 
              safeguards are in place for international data transfers in compliance with applicable 
              privacy laws.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              For privacy-related questions or to exercise your rights, contact our Data Protection 
              Officer at privacy@aifitness.com.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 AI Fitness. Powered by artificial intelligence.</p>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
