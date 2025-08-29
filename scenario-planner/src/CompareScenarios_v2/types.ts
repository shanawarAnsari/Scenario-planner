// KPI Configuration and Types
export interface KPIConfig {
  key: string;
  label: string;
  unit?: string;
  isPercentage?: boolean;
  isCurrency?: boolean;
  category: "volume" | "kc" | "retailer" | "profit";
  icon: React.ReactElement;
  color: string;
}

export interface Category {
  key: "volume" | "kc" | "retailer" | "profit";
  label: string;
  icon: React.ReactElement;
  color: string;
}

export interface Scenario {
  id: string;
  sn: string;
  createdBy: string;
  userId: string;
  createdOn: string;
  modifiedOn: string | null;
  lvl: string;
  cust: string;
  cat: string;
  timePeriod: Array<{
    month: string;
    week: number;
    weekRange: string;
    year: number;
  }>;
  currentWeek: number;
  rolling52Enabled: boolean;
  mfr: string[];
  brd: string[];
  subBrd: string[];
  ppg: string[];
  osku: string[];
  inputs: any;
  results: {
    kcTotals: Record<string, number>;
    products: any[];
    totals: Record<string, number>;
  };
}
