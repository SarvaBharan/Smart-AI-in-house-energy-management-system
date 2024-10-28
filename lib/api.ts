type Building = {
  _id?: string;
  name: string;
  targetTemperature: number;
  autoAdjustEnabled: boolean;
  peakThreshold: number;
};

type EnergyData = {
  _id?: string;
  buildingId: string;
  timestamp: Date;
  consumption: number;
  predictedConsumption: number;
  temperature: number;
  optimizationEnabled: boolean;
};

export async function fetchBuildings() {
  const response = await fetch('/api/buildings');
  if (!response.ok) throw new Error('Failed to fetch buildings');
  return response.json();
}

export async function createBuilding(building: Building) {
  const response = await fetch('/api/buildings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(building),
  });
  if (!response.ok) throw new Error('Failed to create building');
  return response.json();
}

export async function fetchEnergyData(buildingId: string, startDate?: string, endDate?: string) {
  const params = new URLSearchParams({ buildingId });
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await fetch(`/api/energy-data?${params}`);
  if (!response.ok) throw new Error('Failed to fetch energy data');
  return response.json();
}

export async function fetchPredictions(buildingId: string) {
  const response = await fetch(`/api/predictions?buildingId=${buildingId}`);
  if (!response.ok) throw new Error('Failed to fetch predictions');
  return response.json();
}

export async function optimizeEnergy(buildingId: string) {
  const response = await fetch('/api/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ buildingId }),
  });
  if (!response.ok) throw new Error('Failed to optimize energy');
  return response.json();
}