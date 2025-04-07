
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setIsVerifying(false);
      return;
    }

    const performVerification = async () => {
      try {
        const success = await verifyEmail(token);
        
        if (success) {
          setVerified(true);
          toast.success("Email verified successfully!");
        } else {
          toast.error("Verification failed", {
            description: "Invalid or expired verification token",
          });
        }
      } catch (error) {
        toast.error("Verification failed", {
          description: "An unexpected error occurred",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    performVerification();
  }, [searchParams, verifyEmail]);

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto">
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold">Email Verification</h1>
        
        {isVerifying ? (
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p>Verifying your email...</p>
          </div>
        ) : verified ? (
          <div className="space-y-4">
            <div className="mx-auto bg-green-500/20 text-green-500 rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">Email Verified!</h2>
            <p className="text-muted-foreground">
              Your email has been successfully verified. You can now log in to your account.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="mt-4"
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto bg-red-500/20 text-red-500 rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">Verification Failed</h2>
            <p className="text-muted-foreground">
              We couldn't verify your email. The verification link may be invalid or expired.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
              >
                Go to Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
              >
                Sign Up Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
