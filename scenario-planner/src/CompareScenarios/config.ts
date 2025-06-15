import { KPI } from "./types";

export const kpis: KPI[] = [
  {
    label: "Volume/Units",
    key: "uvpk",
    unit: "",
    showTrend: true,
    trendKey: "vpkd_per",
  },
  {
    label: "Revenue(£)",
    key: "ra",
    unit: "",
    showTrend: true,
    trendKey: "rd_per",
  },
  {
    label: "Profit(£)",
    key: "pa",
    unit: "",
    showTrend: true,
    trendKey: "pd_per",
  },
  { label: "Gross Profit %", key: "gp_per", unit: "" },
];
