
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import EventFilter from "@/components/EventFilter";
import { useEvent } from "@/contexts/EventContext";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { selectedEventId, setSelectedEventId } = useEvent();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <Button 
        variant="outline"
        onClick={() => navigate('/staffing')} 
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Staffing
      </Button>
      
      <EventFilter 
        selectedEvent={selectedEventId}
        onEventChange={setSelectedEventId}
        className="w-full sm:w-auto"
      />
    </div>
  );
};

export default ProfileHeader;
