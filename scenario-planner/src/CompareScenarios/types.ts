export interface KCTotals {
  vpk: number;
  uvpk: number;
  vpkd_per: number | null;
  rb: number;
  ra: number;
  rd_per: number;
  pb: number;
  pa: number;
  pd_per: number | null;
  gp_per: number;
  uppk?: number;
  ppk?: number;
  ppkd_abs?: number;
  ppkd_per?: number;
  rd_abs?: number;
  pd_abs?: number;
  vpkd_abs?: number;
}

export interface ResultData {
  kcTotals: KCTotals;
  products?: any[];
  totals?: any;
}

export interface Scenario {
  id: string;
  sn: string;
  results_pack: ResultData;
  results_su: ResultData;
  createdBy?: string;
  createdOn?: string;
  modifiedOn?: string | null;
  lvl?: string;
  cust?: string;
  cat?: string;
  yr?: string;
  mfr?: string[];
  brd?: string[];
  subBrd?: string[];
  ppg?: string[];
  osku?: string[];
}

export interface KPI {
  label: string;
  key: keyof KCTotals;
  unit?: string;
  showTrend?: boolean;
  trendKey?: keyof KCTotals;
}
