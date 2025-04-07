
import { LoginForm } from "@/components/auth/LoginForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export default function LoginPage() {
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <LoginForm />
      
      <div className="mt-4 max-w-md w-full">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-center gap-2" 
          onClick={() => setShowHelp(!showHelp)}
        >
          <Info className="h-4 w-4" />
          {showHelp ? "Hide Help" : "Need Help?"}
        </Button>
        
        {showHelp && (
          <div className="mt-2 p-4 text-sm bg-muted rounded-md">
            <h3 className="font-medium mb-1">Troubleshooting Login Issues:</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>New users must first sign up with an @refactore.co email</li>
              <li>After signing up, check the browser console for a verification token</li>
              <li>Use the verification token on the Verify Email page</li>
              <li>Only verified accounts can log in</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
