import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { useAuthContext } from "@/contexts/AuthContext";
import { 
  Heart, 
  Users, 
  Shield, 
  CreditCard, 
  ArrowRight,
  CheckCircle,
  BarChart3
} from "lucide-react";

const Index = () => {
  const { user, isAdmin } = useAuthContext();

  const features = [
    {
      icon: Users,
      title: "Easy Registration",
      description: "Quick and simple registration process to join our cause",
    },
    {
      icon: CreditCard,
      title: "Secure Donations",
      description: "Safe and transparent payment processing with status tracking",
    },
    {
      icon: Shield,
      title: "Data Integrity",
      description: "Your data is saved regardless of payment outcome",
    },
    {
      icon: BarChart3,
      title: "Track Your Impact",
      description: "View your complete donation history and contribution status",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="border-b-2 border-foreground">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-foreground bg-secondary mb-8">
              {/* <Heart className="h-5 w-5" /> */}
              <span className="text-sm font-medium">National Service Scheme, IIT Roorkee</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Not for Me,<br />But for the Nation
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join us in making a difference. Register to support our cause and 
              contribute to building a better tomorrow through secure, transparent donations.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {user ? (
                <Link to={isAdmin ? "/admin" : "/dashboard"}>
                  <Button size="lg" className="gap-2">
                    Go to {isAdmin ? "Admin Panel" : "Dashboard"}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth?mode=signup">
                    <Button size="lg" className="gap-2">
                      Register Now
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="lg" variant="outline">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform ensures complete transparency and data integrity throughout your journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-foreground shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <feature.icon className="h-10 w-10 mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-secondary border-y-2 border-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Simple steps to make your contribution
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {[
                { step: 1, title: "Register", description: "Create your account with basic details" },
                { step: 2, title: "Choose Amount", description: "Select or enter your donation amount" },
                { step: 3, title: "Make Payment", description: "Complete payment through secure gateway" },
                { step: 4, title: "Track Status", description: "View your donation history and status anytime" },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-10 h-10 border-2 border-foreground bg-background flex items-center justify-center font-bold shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1 pb-6 border-b-2 border-foreground last:border-0">
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-foreground shadow-md max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-8 text-center">
              {/* <Heart className="h-16 w-16 mx-auto mb-6" /> */}
              <h2 className="text-2xl font-bold mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of supporters who are helping us create positive change.
                Every contribution counts.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Secure Payments
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  100% Transparent
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Instant Confirmation
                </div>
              </div>
              {!user && (
                <Link to="/auth?mode=signup" className="mt-6 inline-block">
                  <Button size="lg" className="gap-2">
                    Start Your Journey
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
