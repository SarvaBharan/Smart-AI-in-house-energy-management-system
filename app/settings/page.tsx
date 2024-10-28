"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { fetchBuildings, createBuilding } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const settingsSchema = z.object({
  buildingName: z.string().min(2).max(50),
  targetTemp: z.string().regex(/^\d+$/, "Must be a valid temperature"),
  autoAdjust: z.boolean(),
  peakThreshold: z.string().regex(/^\d+$/, "Must be a valid number"),
});

export default function Settings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      buildingName: "Main Office",
      targetTemp: "22",
      autoAdjust: true,
      peakThreshold: "75",
    },
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const buildings = await fetchBuildings();
        if (buildings.length > 0) {
          const building = buildings[0];
          form.reset({
            buildingName: building.name,
            targetTemp: building.targetTemperature.toString(),
            autoAdjust: building.autoAdjustEnabled,
            peakThreshold: building.peakThreshold.toString(),
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      }
    }
    loadSettings();
  }, [form, toast]);

  async function onSubmit(values: z.infer<typeof settingsSchema>) {
    setIsLoading(true);
    try {
      await createBuilding({
        name: values.buildingName,
        targetTemperature: parseInt(values.targetTemp),
        autoAdjustEnabled: values.autoAdjust,
        peakThreshold: parseInt(values.peakThreshold),
      });
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Building Configuration</h2>
              <FormField
                control={form.control}
                name="buildingName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Building Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The name used to identify this building
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Energy Settings</h2>
              <FormField
                control={form.control}
                name="targetTemp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormDescription>
                      Optimal temperature for energy efficiency
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="autoAdjust"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Automatic Adjustments
                      </FormLabel>
                      <FormDescription>
                        Allow AI to automatically adjust settings
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="peakThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peak Usage Threshold (kW)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormDescription>
                      Maximum energy usage before optimization kicks in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}