import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, LineChart, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="flex-1 w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Smart Energy Management with AI
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Optimize your building's energy consumption using advanced AI predictions and real-time adjustments.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  <LineChart className="w-4 h-4" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card className="flex flex-col items-center space-y-4 p-6">
              <div className="p-3 rounded-full bg-primary/10">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Smart Building Integration</h3>
              <p className="text-muted-foreground text-center">
                Seamlessly connect your building's systems for comprehensive energy monitoring.
              </p>
            </Card>
            <Card className="flex flex-col items-center space-y-4 p-6">
              <div className="p-3 rounded-full bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Real-time Optimization</h3>
              <p className="text-muted-foreground text-center">
                AI-driven adjustments to minimize energy waste and maximize efficiency.
              </p>
            </Card>
            <Card className="flex flex-col items-center space-y-4 p-6">
              <div className="p-3 rounded-full bg-primary/10">
                <LineChart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Predictive Analytics</h3>
              <p className="text-muted-foreground text-center">
                Advanced forecasting to anticipate and optimize energy consumption patterns.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}