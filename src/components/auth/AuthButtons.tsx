
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, LogIn, UserPlus } from "lucide-react";

export function AuthButtons() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm hidden md:inline-block">
          {user?.email}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <LogOut className="h-4 w-4 mr-2" /> 
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => navigate('/login')}
      >
        <LogIn className="h-4 w-4 mr-2" />
        Login
      </Button>
      <Button 
        variant="default" 
        size="sm"
        onClick={() => navigate('/signup')}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Sign Up
      </Button>
    </div>
  );
}
