
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  formatCurrency, 
  calculateDCF, 
  calculateCCA, 
  calculateAssetBased,
  calculateDDM,
  calculateWeightedValuation,
  downloadData
} from "@/utils/financeUtils";
import { FileDown, Calculator, ChartBar, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "sonner";

// DCF Model Component
const DCFModelTab: React.FC<{
  updateValuation: (method: string, value: number) => void
}> = ({ updateValuation }) => {
  const [cashFlows, setCashFlows] = useState<string>("500000,550000,600000,650000,700000");
  const [discountRate, setDiscountRate] = useState<number>(0.1);
  const [terminalGrowthRate, setTerminalGrowthRate] = useState<number>(0.03);
  const [outstandingShares, setOutstandingShares] = useState<number>(1000000);
  const [result, setResult] = useState<{
    enterpriseValue: number;
    equityValue: number;
    sharePrice: number;
  } | null>(null);

  const handleCalculate = () => {
    try {
      const cashFlowArray = cashFlows.split(',').map(Number);
      if (cashFlowArray.some(isNaN)) {
        toast.error("Invalid cash flow values. Please enter comma-separated numbers.");
        return;
      }

      const dcfResult = calculateDCF(
        cashFlowArray,
        discountRate,
        terminalGrowthRate,
        outstandingShares
      );

      setResult(dcfResult);
      updateValuation("DCF Model", dcfResult.sharePrice);
      toast.success("DCF calculation completed");
    } catch (error) {
      toast.error("Calculation error. Please check your inputs.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Discounted Cash Flow (DCF) Model
        </CardTitle>
        <CardDescription>
          Values a company based on projected future cash flows discounted to present value
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cashFlows">Projected Cash Flows (comma-separated)</Label>
          <Input
            id="cashFlows"
            value={cashFlows}
            onChange={(e) => setCashFlows(e.target.value)}
            placeholder="e.g., 500000,550000,600000,650000,700000"
          />
          <p className="text-xs text-muted-foreground">
            Enter projected annual cash flows in EUR for the next 5 years
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="discountRate">Discount Rate</Label>
            <div className="flex items-center">
              <Input
                id="discountRate"
                type="number"
                step="0.01"
                min="0.01"
                max="0.5"
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
              />
              <span className="ml-2">%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="terminalRate">Terminal Growth Rate</Label>
            <div className="flex items-center">
              <Input
                id="terminalRate"
                type="number"
                step="0.01"
                min="0.01"
                max="0.05"
                value={terminalGrowthRate}
                onChange={(e) => setTerminalGrowthRate(Number(e.target.value))}
              />
              <span className="ml-2">%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shares">Outstanding Shares</Label>
            <Input
              id="shares"
              type="number"
              min="1"
              value={outstandingShares}
              onChange={(e) => setOutstandingShares(Number(e.target.value))}
            />
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full">Calculate DCF Valuation</Button>

        {result && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <h4 className="font-semibold mb-2">DCF Valuation Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-background rounded-md">
                <p className="text-sm text-muted-foreground">Enterprise Value</p>
                <p className="text-lg font-bold">{formatCurrency(result.enterpriseValue)}</p>
              </div>
              <div className="p-3 bg-background rounded-md">
                <p className="text-sm text-muted-foreground">Equity Value</p>
                <p className="text-lg font-bold">{formatCurrency(result.equityValue)}</p>
              </div>
              <div className="p-3 bg-background rounded-md border border-primary">
                <p className="text-sm text-muted-foreground">Share Price</p>
                <p className="text-lg font-bold">{formatCurrency(result.sharePrice)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Comparable Company Analysis Component
const ComparableCompanyTab: React.FC<{
  updateValuation: (method: string, value: number) => void
}> = ({ updateValuation }) => {
  const [revenue, setRevenue] = useState<number>(10000000);
  const [ebitda, setEBITDA] = useState<number>(2000000);
  const [earningsPerShare, setEarningsPerShare] = useState<number>(1.5);
  const [outstandingShares, setOutstandingShares] = useState<number>(1000000);
  const [industryPERatio, setIndustryPERatio] = useState<number>(15);
  const [industryEVToEBITDA, setIndustryEVToEBITDA] = useState<number>(8);
  const [industryEVToRevenue, setIndustryEVToRevenue] = useState<number>(2);
  const [result, setResult] = useState<{
    priceBased: number;
    revenueBased: number;
    ebitdaBased: number;
    average: number;
  } | null>(null);

  const handleCalculate = () => {
    try {
      const ccaResult = calculateCCA(
        revenue,
        ebitda,
        earningsPerShare,
        outstandingShares,
        industryPERatio,
        industryEVToEBITDA,
        industryEVToRevenue
      );

      // Calculate average of the three methods
      const average = (ccaResult.priceBased + ccaResult.revenueBased + ccaResult.ebitdaBased) / 3;
      
      setResult({ ...ccaResult, average });
      updateValuation("Comparable Company", average);
      toast.success("Comparable company analysis completed");
    } catch (error) {
      toast.error("Calculation error. Please check your inputs.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBar className="h-5 w-5" />
          Comparable Company Analysis
        </CardTitle>
        <CardDescription>
          Values a company based on metrics of similar companies in the industry
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">Annual Revenue</Label>
            <Input
              id="revenue"
              type="number"
              min="0"
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ebitda">EBITDA</Label>
            <Input
              id="ebitda"
              type="number"
              min="0"
              value={ebitda}
              onChange={(e) => setEBITDA(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="eps">Earnings Per Share</Label>
            <Input
              id="eps"
              type="number"
              step="0.01"
              min="0"
              value={earningsPerShare}
              onChange={(e) => setEarningsPerShare(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shares">Outstanding Shares</Label>
            <Input
              id="shares"
              type="number"
              min="1"
              value={outstandingShares}
              onChange={(e) => setOutstandingShares(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="peRatio">Industry P/E Ratio</Label>
            <Input
              id="peRatio"
              type="number"
              step="0.1"
              min="0"
              value={industryPERatio}
              onChange={(e) => setIndustryPERatio(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evToEbitda">Industry EV/EBITDA</Label>
            <Input
              id="evToEbitda"
              type="number"
              step="0.1"
              min="0"
              value={industryEVToEBITDA}
              onChange={(e) => setIndustryEVToEBITDA(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evToRevenue">Industry EV/Revenue</Label>
            <Input
              id="evToRevenue"
              type="number"
              step="0.1"
              min="0"
              value={industryEVToRevenue}
              onChange={(e) => setIndustryEVToRevenue(Number(e.target.value))}
            />
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full">Calculate Comparable Valuation</Button>

        {result && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <h4 className="font-semibold mb-2">Comparable Company Valuation Results</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-background rounded-md">
                <p className="text-sm text-muted-foreground">P/E Based</p>
                <p className="text-lg font-bold">{formatCurrency(result.priceBased)}</p>
              </div>
              <div className="p-3 bg-background rounded-md">
                <p className="text-sm text-muted-foreground">Revenue Based</p>
                <p className="text-lg font-bold">{formatCurrency(result.revenueBased)}</p>
              </div>
              <div className="p-3 bg-background rounded-md">
                <p className="text-sm text-muted-foreground">EBITDA Based</p>
                <p className="text-lg font-bold">{formatCurrency(result.ebitdaBased)}</p>
              </div>
              <div className="p-3 bg-background rounded-md border border-primary">
                <p className="text-sm text-muted-foreground">Average Share Price</p>
                <p className="text-lg font-bold">{formatCurrency(result.average)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Asset Based Valuation Component
const AssetBasedTab: React.FC<{
  updateValuation: (method: string, value: number) => void
}> = ({ updateValuation }) => {
  const [totalAssets, setTotalAssets] = useState<number>(5000000);
  const [totalLiabilities, setTotalLiabilities] = useState<number>(2000000);
  const [outstandingShares, setOutstandingShares] = useState<number>(1000000);
  const [result, setResult] = useState<{
    bookValue: number;
    sharePrice: number;
  } | null>(null);

  const handleCalculate = () => {
    try {
      const assetResult = calculateAssetBased(
        totalAssets,
        totalLiabilities,
        outstandingShares
      );
      
      setResult(assetResult);
      updateValuation("Asset-Based", assetResult.sharePrice);
      toast.success("Asset-based valuation completed");
    } catch (error) {
      toast.error("Calculation error. Please check your inputs.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Asset-Based Valuation
        </CardTitle>
        <CardDescription>
          Values a company based on the net value of its assets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assets">Total Assets</Label>
            <Input
              id="assets"
              type="number"
              min="0"
              value={totalAssets}
              onChange={(e) => setTotalAssets(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="liabilities">Total Liabilities</Label>
            <Input
              id="liabilities"
              type="number"
              min="0"
              value={totalLiabilities}
              onChange={(e) => setTotalLiabilities(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shares">Outstanding Shares</Label>
            <Input
              id="shares"
              type="number"
              min="1"
              value={outstandingShares}
              onChange={(e) => setOutstandingShares(Number(e.target.value))}
            />
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full">Calculate Asset-Based Valuation</Button>

        {result && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <h4 className="font-semibold mb-2">Asset-Based Valuation Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-background rounded-md">
                <p className="text-sm text-muted-foreground">Book Value</p>
                <p className="text-lg font-bold">{formatCurrency(result.bookValue)}</p>
              </div>
              <div className="p-3 bg-background rounded-md border border-primary">
                <p className="text-sm text-muted-foreground">Share Price</p>
                <p className="text-lg font-bold">{formatCurrency(result.sharePrice)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Dividend Discount Model Component
const DDMTab: React.FC<{
  updateValuation: (method: string, value: number) => void
}> = ({ updateValuation }) => {
  const [currentDividend, setCurrentDividend] = useState<number>(1.0);
  const [dividendGrowthRate, setDividendGrowthRate] = useState<number>(0.05);
  const [requiredRate, setRequiredRate] = useState<number>(0.10);
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    try {
      if (requiredRate <= dividendGrowthRate) {
        toast.error("Required rate must be greater than dividend growth rate");
        return;
      }
      
      const sharePrice = calculateDDM(
        currentDividend,
        dividendGrowthRate,
        requiredRate
      );
      
      setResult(sharePrice);
      updateValuation("Dividend Discount", sharePrice);
      toast.success("Dividend discount calculation completed");
    } catch (error) {
      toast.error("Calculation error. Please check your inputs.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Dividend Discount Model
        </CardTitle>
        <CardDescription>
          Values a company based on the present value of expected future dividends
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dividend">Current Annual Dividend</Label>
            <Input
              id="dividend"
              type="number"
              step="0.01"
              min="0"
              value={currentDividend}
              onChange={(e) => setCurrentDividend(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="growthRate">Dividend Growth Rate</Label>
            <div className="flex items-center">
              <Input
                id="growthRate"
                type="number"
                step="0.01"
                min="0"
                max="0.2"
                value={dividendGrowthRate}
                onChange={(e) => setDividendGrowthRate(Number(e.target.value))}
              />
              <span className="ml-2">%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="requiredRate">Required Rate of Return</Label>
            <div className="flex items-center">
              <Input
                id="requiredRate"
                type="number"
                step="0.01"
                min="0.01"
                max="0.5"
                value={requiredRate}
                onChange={(e) => setRequiredRate(Number(e.target.value))}
              />
              <span className="ml-2">%</span>
            </div>
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full">Calculate DDM Valuation</Button>

        {result !== null && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <h4 className="font-semibold mb-2">Dividend Discount Model Results</h4>
            <div className="p-3 bg-background rounded-md border border-primary">
              <p className="text-sm text-muted-foreground">Share Price</p>
              <p className="text-lg font-bold">{formatCurrency(result)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Combined Valuation Component
const CombinedValuationTab: React.FC<{
  valuations: {method: string, value: number}[]
}> = ({ valuations }) => {
  const [weights, setWeights] = useState<{[key: string]: number}>({
    "DCF Model": 0.4,
    "Comparable Company": 0.3,
    "Asset-Based": 0.2,
    "Dividend Discount": 0.1
  });
  
  const [result, setResult] = useState<{
    weightedAverage: number,
    breakdown: {method: string, value: number, weight: number, contribution: number}[]
  } | null>(null);

  const updateWeight = (method: string, value: number) => {
    setWeights(prev => ({
      ...prev,
      [method]: value
    }));
  };

  const handleCalculate = () => {
    try {
      // Create array of valuations with weights
      const valuationsWithWeights = valuations.map(v => ({
        ...v,
        weight: weights[v.method] || 0
      }));
      
      const result = calculateWeightedValuation(valuationsWithWeights);
      
      setResult(result);
      toast.success("Combined valuation calculated");
    } catch (error) {
      toast.error("Calculation error. Please check your inputs.");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    const downloadData = {
      valuationMethods: result.breakdown,
      weightedAverage: result.weightedAverage,
      calculatedOn: new Date().toISOString()
    };
    
    downloadData(downloadData, "company-valuation.json");
    toast.success("Valuation data downloaded");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Combined Valuation
          </span>
          {result && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleDownload}
            >
              <FileDown className="h-4 w-4" /> Export
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Weight different valuation methods to calculate a final company valuation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Weighting Factors</h3>
            <p className="text-sm text-muted-foreground">
              Adjust the weights for each valuation method (total should equal 1)
            </p>
            
            {valuations.map(v => (
              <div key={v.method} className="flex items-center space-x-4">
                <Label htmlFor={`weight-${v.method}`} className="w-1/3">
                  {v.method}
                </Label>
                <Input
                  id={`weight-${v.method}`}
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={weights[v.method] || 0}
                  onChange={(e) => updateWeight(v.method, Number(e.target.value))}
                  className="w-1/3"
                />
                <div className="w-1/3">
                  <span className="text-sm">Value: </span>
                  <span className="font-medium">{formatCurrency(v.value)}</span>
                </div>
              </div>
            ))}
          </div>
          
          <Button onClick={handleCalculate} className="w-full">Calculate Combined Valuation</Button>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="p-6 bg-muted rounded-md text-center">
              <p className="text-sm text-muted-foreground mb-1">Final Share Value</p>
              <p className="text-3xl font-bold">{formatCurrency(result.weightedAverage)}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Contribution Breakdown</h4>
              <div className="space-y-2">
                {result.breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-background rounded-md">
                    <span>{item.method}</span>
                    <div className="text-right">
                      <span className="text-muted-foreground mr-2">
                        {formatCurrency(item.value)} × {item.weight}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.contribution)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Component
const CompanyValuation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dcf");
  const [valuations, setValuations] = useState<{method: string, value: number}[]>([]);
  
  const updateValuation = (method: string, value: number) => {
    // Update or add valuation
    const existingIndex = valuations.findIndex(v => v.method === method);
    
    if (existingIndex >= 0) {
      const updated = [...valuations];
      updated[existingIndex] = { method, value };
      setValuations(updated);
    } else {
      setValuations([...valuations, { method, value }]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Company Valuation</h2>
          <p className="text-muted-foreground">
            Calculate company and share value using multiple valuation methods
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => downloadData(valuations, 'valuation-data.json')}
          disabled={valuations.length === 0}
        >
          <FileDown className="h-4 w-4 mr-2" /> Export Data
        </Button>
      </div>

      <Tabs defaultValue="dcf" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex justify-start flex-wrap">
          <TabsTrigger value="dcf">DCF Model</TabsTrigger>
          <TabsTrigger value="comparable">Comparable Company</TabsTrigger>
          <TabsTrigger value="asset">Asset Based</TabsTrigger>
          <TabsTrigger value="ddm">Dividend Model</TabsTrigger>
          <TabsTrigger value="combined" disabled={valuations.length === 0}>
            Combined Valuation
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dcf">
          <DCFModelTab updateValuation={updateValuation} />
        </TabsContent>
        <TabsContent value="comparable">
          <ComparableCompanyTab updateValuation={updateValuation} />
        </TabsContent>
        <TabsContent value="asset">
          <AssetBasedTab updateValuation={updateValuation} />
        </TabsContent>
        <TabsContent value="ddm">
          <DDMTab updateValuation={updateValuation} />
        </TabsContent>
        <TabsContent value="combined">
          <CombinedValuationTab valuations={valuations} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyValuation;

