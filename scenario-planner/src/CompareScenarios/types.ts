export interface KCTotals {
  vpk: number;
  uvpk: number;
  vpkd_per: number;
  rb: number;
  ra: number;
  rd_per: number;
  pb: number;
  pa: number;
  pd_per: number;
  gp_per: number;
}

export interface Scenario {
  name: string;
  kcTotals: KCTotals;
}

export interface KPI {
  label: string;
  key: keyof KCTotals;
  unit?: string;
  showTrend?: boolean;
  trendKey?: keyof KCTotals;
}
