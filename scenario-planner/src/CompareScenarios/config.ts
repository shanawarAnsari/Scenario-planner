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
    label: "NSV(£)",
    key: "ra",
    unit: "",
    showTrend: true,
    trendKey: "rd_per",
  },
  {
    label: "NSV/SU",
    key: "rb", //TODO: need to change one we have nuv/su value
    unit: "",
    showTrend: true,
    trendKey: "rd_per", //TODO: need to change one we have nuv/su_per value
  },
  {
    label: "Gross Profit(£)",
    key: "pa",
    unit: "",
    showTrend: true,
    trendKey: "pd_per",
  },
  {
    label: "Gross Profit %",
    key: "gp_per",
    unit: "%",
    showTrend: false,
  },
];
