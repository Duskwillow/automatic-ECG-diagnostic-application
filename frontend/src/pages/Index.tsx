import React, { useState } from "react";
import { ECGInput } from "../components/ECGInput";
import { ECGChart } from "../components/ECGChart";
import { PredictionResults } from "../components/PredictionResults";
import { Heart, Stethoscope } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const Index = () => {
  const [chartData, setChartData] = useState<number[][]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDataSubmit = async (ecgData: number[][]) => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ecg_data: ecgData }),
      });

      if (!response.ok) {
        throw new Error("Failed to get predictions");
      }

      const result = await response.json();
      console.log("Backend result:", result);

      // Handle both array and object formats
      let predictionArray;
      if (Array.isArray(result.predictions)) {
        predictionArray = result.predictions;
      } else if (
        typeof result.predictions === "object" &&
        result.predictions !== null
      ) {
        // Convert object to array
        predictionArray = [result.predictions];
      } else {
        throw new Error("Invalid prediction format");
      }

      setPredictions(predictionArray);

      toast({
        title: "Analysis Complete",
        description: result.message,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Connection Error",
        description: "Could not connect to backend. Using demo data.",
        variant: "destructive",
      });

      // Fallback to mock data
      const mockPredictions = [
        {
          "1dAVb": Math.random() * 0.8,
          RBBB: Math.random() * 0.6,
          LBBB: Math.random() * 0.4,
          SB: Math.random() * 0.7,
          AF: Math.random() * 0.5,
          ST: Math.random() * 0.3,
        },
      ];

      //setPredictions(mockPredictions);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChartData = (data: number[][]) => {
    setChartData(data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-medical">
              <Heart className="h-8 w-8" />
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                ECG Analysis Platform
              </h1>
              <p className="text-sm text-muted-foreground">
                Advanced cardiac condition prediction system
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Input Section */}
        <div className="grid gap-8">
          <ECGInput
            onDataSubmit={handleDataSubmit}
            onChartData={handleChartData}
            isLoading={isLoading}
          />
        </div>

        {/* Charts Section - Show all 12 leads */}
        {chartData.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl  font-bold">ECG Leads</h2>
            <ECGChart data={chartData} />
          </div>
        )}

        {/* Results Section */}
        <PredictionResults predictions={predictions} isLoading={isLoading} />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            ECG Analysis Platform - For research and educational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
