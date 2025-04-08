
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const StaffNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Staff Member Not Found</h1>
        <Button onClick={() => navigate('/staffing')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Staffing
        </Button>
      </div>
    </div>
  );
};

export default StaffNotFound;
