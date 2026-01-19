import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";
import { LogOut, User, LayoutDashboard, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const { user, profile, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  return (
    <header className="border-b-2 border-foreground bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {/* <Heart className="h-8 w-8" /> */}
          <span className="text-xl font-bold tracking-tight">NGO DONATION</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link to={isAdmin ? "/admin" : "/dashboard"}>
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  {isAdmin ? "Admin Panel" : "Dashboard"}
                </Button>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1 border-2 border-foreground bg-secondary">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {profile?.full_name || profile?.email || "User"}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
