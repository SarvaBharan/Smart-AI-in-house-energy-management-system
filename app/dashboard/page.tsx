"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchBuildings, fetchEnergyData, fetchPredictions, optimizeEnergy } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export default function Dashboard() {
  const { toast } = useToast();
  const [optimizationEnabled, setOptimizationEnabled] = useState(true);
  const [currentBuilding, setCurrentBuilding] = useState<string | null>(null);
  const [energyData, setEnergyData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const buildings = await fetchBuildings();
        if (buildings.length > 0) {
          setCurrentBuilding(buildings[0]._id);
          const data = await fetchEnergyData(buildings[0]._id);
          const predictionsData = await fetchPredictions(buildings[0]._id);
          setEnergyData(data);
          setPredictions(predictionsData);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, [toast]);

  async function handleOptimization() {
    if (!currentBuilding) return;
    
    try {
      setOptimizationEnabled(!optimizationEnabled);
      if (!optimizationEnabled) {
        await optimizeEnergy(currentBuilding);
        const newData = await fetchEnergyData(currentBuilding);
        setEnergyData(newData);
        toast({
          title: "Success",
          description: "Energy optimization applied successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle optimization",
        variant: "destructive",
      });
      setOptimizationEnabled(optimizationEnabled);
    }
  }

  const formattedData = energyData.map((item: any) => ({
    ...item,
    time: format(new Date(item.timestamp), "HH:mm"),
  }));

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Energy Dashboard</h1>
        <Button
          variant={optimizationEnabled ? "default" : "outline"}
          onClick={handleOptimization}
        >
          {optimizationEnabled ? "Optimization Active" : "Optimization Paused"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Current Usage</h3>
          <p className="text-3xl font-bold">
            {energyData[energyData.length - 1]?.consumption.toFixed(1) || "0"} kW
          </p>
          <p className="text-sm text-muted-foreground">-12% from average</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Daily Savings</h3>
          <p className="text-3xl font-bold">18.5%</p>
          <p className="text-sm text-muted-foreground">+2.3% from yesterday</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">AI Predictions</h3>
          <p className="text-3xl font-bold">
            {predictions[0]?.predictedConsumption.toFixed(1) || "0"} kW
          </p>
          <p className="text-sm text-muted-foreground">Expected peak at 14:00</p>
        </Card>
      </div>

      <Tabs defaultValue="consumption">
        <TabsList>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>
        <TabsContent value="consumption" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Energy Consumption vs. Predictions</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="consumption"
                    stroke="hsl(var(--primary))"
                    name="Actual"
                  />
                  <Line
                    type="monotone"
                    dataKey="predictedConsumption"
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="5 5"
                    name="Predicted"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="savings" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Optimization Impact</h3>
            <p>Detailed savings analysis will be shown here.</p>
          </Card>
        </TabsContent>
        <TabsContent value="predictions" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">AI Predictions</h3>
            <p>Future consumption predictions will be shown here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}