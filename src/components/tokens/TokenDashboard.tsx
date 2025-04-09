
import React from "react";
import { useTokens } from "@/contexts/TokenContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useSelectedEventName } from "@/contexts/EventContext";

const TokenDashboard: React.FC = () => {
  const { tokenStats, isLoading } = useTokens();
  const selectedEventName = useSelectedEventName();
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading token stats...</div>;
  }

  const {
    totalTokensSold,
    totalTokensCollected,
    difference,
    differencePercentage,
    foodTruckTokens,
    barTokens,
    cloakroomTokens
  } = tokenStats;

  // Calculate percentages for visualization
  const collectionRatePercent = totalTokensSold > 0 
    ? ((totalTokensCollected / totalTokensSold) * 100).toFixed(1) 
    : "0.0";
  
  const foodTruckPercent = totalTokensCollected > 0 
    ? ((foodTruckTokens / totalTokensCollected) * 100).toFixed(1)
    : "0.0";
  
  const barPercent = totalTokensCollected > 0 
    ? ((barTokens / totalTokensCollected) * 100).toFixed(1)
    : "0.0";
  
  const cloakroomPercent = totalTokensCollected > 0 
    ? ((cloakroomTokens / totalTokensCollected) * 100).toFixed(1)
    : "0.0";

  // Define custom Progress components with different colors
  const FoodTruckProgress = () => (
    <div className="bg-gray-200 rounded-full h-2">
      <div 
        className="bg-amber-500 h-2 rounded-full" 
        style={{ width: `${foodTruckPercent}%` }}
      />
    </div>
  );

  const BarProgress = () => (
    <div className="bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-500 h-2 rounded-full" 
        style={{ width: `${barPercent}%` }}
      />
    </div>
  );

  const CloakroomProgress = () => (
    <div className="bg-gray-200 rounded-full h-2">
      <div 
        className="bg-purple-500 h-2 rounded-full" 
        style={{ width: `${cloakroomPercent}%` }}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2">Token Collection Overview</h2>
        <h3 className="text-lg mb-4 text-muted-foreground">{selectedEventName}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Tokens Sold</h3>
            <p className="text-2xl font-bold">{totalTokensSold.toLocaleString()}</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Tokens Collected</h3>
            <p className="text-2xl font-bold">{totalTokensCollected.toLocaleString()}</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Difference</h3>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{difference.toLocaleString()}</p>
              <p className="text-sm font-medium text-red-500">({differencePercentage}%)</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Collection Rate</span>
              <span className="text-sm font-medium">{collectionRatePercent}%</span>
            </div>
            <Progress value={parseFloat(collectionRatePercent)} className="h-2" />
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Token Distribution</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Food Truck Tokens</span>
              <span className="text-sm font-medium">{foodTruckTokens.toLocaleString()} ({foodTruckPercent}%)</span>
            </div>
            <FoodTruckProgress />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Bar Tokens</span>
              <span className="text-sm font-medium">{barTokens.toLocaleString()} ({barPercent}%)</span>
            </div>
            <BarProgress />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Cloakroom Tokens</span>
              <span className="text-sm font-medium">{cloakroomTokens.toLocaleString()} ({cloakroomPercent}%)</span>
            </div>
            <CloakroomProgress />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TokenDashboard;
