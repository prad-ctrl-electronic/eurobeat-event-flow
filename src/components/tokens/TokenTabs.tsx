
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TokenDashboard from "./TokenDashboard";
import TokenPositions from "./TokenPositions";
import TokenStaff from "./TokenStaff";
import TokenHourlyAnalysis from "./TokenHourlyAnalysis";

const TokenTabs: React.FC = () => {
  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      <TabsList className="bg-muted/40 mb-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="positions">Positions</TabsTrigger>
        <TabsTrigger value="staff">Staff Tokens</TabsTrigger>
        <TabsTrigger value="hourly">Hourly Analysis</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        <TokenDashboard />
      </TabsContent>
      
      <TabsContent value="positions">
        <TokenPositions />
      </TabsContent>
      
      <TabsContent value="staff">
        <TokenStaff />
      </TabsContent>
      
      <TabsContent value="hourly">
        <TokenHourlyAnalysis />
      </TabsContent>
    </Tabs>
  );
};

export default TokenTabs;
