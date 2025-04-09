
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import TokenDashboard from "@/components/tokens/TokenDashboard";
import TokenPositions from "@/components/tokens/TokenPositions";
import TokenStaff from "@/components/tokens/TokenStaff";
import TokenHourlyAnalysis from "@/components/tokens/TokenHourlyAnalysis";
import TokenDataImport from "@/components/tokens/TokenImport";
import { TokenProvider } from "@/contexts/TokenContext";
import EventFilter from "@/components/EventFilter";
import { useEvent } from "@/contexts/EventContext";

const TokenManagement: React.FC = () => {
  const { selectedEventId, setSelectedEventId } = useEvent();

  return (
    <TokenProvider>
      <PageLayout 
        title="Token Management" 
        filters={
          <EventFilter
            selectedEvent={selectedEventId}
            onEventChange={setSelectedEventId}
            className="w-full md:w-auto"
          />
        }
      >
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Overview</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="staff">Staff Tokens</TabsTrigger>
            <TabsTrigger value="hourly">Hourly Analysis</TabsTrigger>
            <TabsTrigger value="import">Import Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-0">
            <TokenDashboard />
          </TabsContent>
          
          <TabsContent value="positions" className="mt-0">
            <TokenPositions />
          </TabsContent>
          
          <TabsContent value="staff" className="mt-0">
            <TokenStaff />
          </TabsContent>
          
          <TabsContent value="hourly" className="mt-0">
            <TokenHourlyAnalysis />
          </TabsContent>
          
          <TabsContent value="import" className="mt-0">
            <TokenDataImport />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </TokenProvider>
  );
};

export default TokenManagement;
