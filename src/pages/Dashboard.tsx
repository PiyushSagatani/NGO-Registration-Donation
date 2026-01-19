import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { DonationForm } from "@/components/donation/DonationForm";
import { DonationHistory } from "@/components/donation/DonationHistory";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { useAuthContext } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, History, User } from "lucide-react";

const Dashboard = () => {
  const { user, profile, loading, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
    if (!loading && isAdmin) {
      navigate("/admin");
    }
  }, [user, loading, isAdmin, navigate]);

  const handleDonationSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {profile?.full_name || "Supporter"}!
          </h1>
          <p className="text-muted-foreground">
            Thank you for being part of our mission
          </p>
        </div>

        <Tabs defaultValue="donate" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="donate" className="gap-2">
              {/* <Heart className="h-4 w-4" /> */}
              Donate
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donate" className="max-w-lg">
            <DonationForm onSuccess={handleDonationSuccess} />
          </TabsContent>

          <TabsContent value="history">
            <DonationHistory refreshTrigger={refreshTrigger} />
          </TabsContent>

          <TabsContent value="profile" className="max-w-lg">
            <ProfileCard />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
