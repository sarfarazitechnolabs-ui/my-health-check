import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
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
            <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 12, 2026</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using AI Fitness, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              AI Fitness provides AI-powered fitness planning, workout tracking, nutrition guidance, 
              and health monitoring tools. Our services are designed to assist you in achieving your 
              fitness goals through personalized recommendations.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              You are responsible for maintaining the confidentiality of your account credentials 
              and for all activities that occur under your account. You must notify us immediately 
              of any unauthorized use.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Subscription and Payments</h2>
            <p className="text-muted-foreground mb-4">
              Some features require a paid subscription. Subscriptions automatically renew unless 
              cancelled before the renewal date. Refunds are handled according to our refund policy.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Health Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              AI Fitness is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult with a qualified healthcare provider before starting any fitness program. 
              Use our recommendations at your own risk.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. User Content</h2>
            <p className="text-muted-foreground mb-4">
              You retain ownership of content you submit. By uploading content, you grant us a license 
              to use it for providing and improving our services. You are responsible for ensuring your 
              content does not violate any laws or third-party rights.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Prohibited Uses</h2>
            <p className="text-muted-foreground mb-4">
              You may not use our services for any illegal purpose, to harass others, to distribute 
              malware, to infringe on intellectual property, or to attempt to gain unauthorized access 
              to our systems.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              AI Fitness shall not be liable for any indirect, incidental, special, or consequential 
              damages arising from your use of our services. Our total liability shall not exceed the 
              amount you paid us in the past 12 months.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We may modify these terms at any time. We will notify you of significant changes. 
              Continued use after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these terms, please contact us at legal@aifitness.com.
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

export default Terms;
