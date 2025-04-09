
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import TokenDashboard from "@/components/tokens/TokenDashboard";
import TokenPositions from "@/components/tokens/TokenPositions";
import TokenStaff from "@/components/tokens/TokenStaff";
import TokenHourlyAnalysis from "@/components/tokens/TokenHourlyAnalysis";
import { TokenProvider } from "@/contexts/TokenContext";

const TokenManagement: React.FC = () => {
  return (
    <TokenProvider>
      <PageLayout title="Token Management">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Overview</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="staff">Staff Tokens</TabsTrigger>
            <TabsTrigger value="hourly">Hourly Analysis</TabsTrigger>
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
        </Tabs>
      </PageLayout>
    </TokenProvider>
  );
};

export default TokenManagement;
