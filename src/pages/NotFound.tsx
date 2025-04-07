
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="card-gradient rounded-xl p-8 text-center max-w-md w-full">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary-purple to-accent-pink text-transparent bg-clip-text">404</h1>
        <p className="text-xl text-foreground mb-6">Oops! This page doesn't exist</p>
        <p className="text-muted-foreground mb-8">The page you're looking for wasn't found. Let's get you back on track.</p>
        <Button asChild className="gap-2">
          <a href="/">
            <Home className="h-4 w-4" /> Return to Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
