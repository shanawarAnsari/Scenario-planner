import { Scenario } from "./types";

export const mockScenarios: Scenario[] = [
  {
    name: "Tesco - Andrex pricing discount",
    kcTotals: {
      vpk: 1913613,
      uvpk: 1897743,
      vpkd_per: -0.8,
      rb: 14777977,
      ra: 14538405,
      rd_per: -1.6,
      pb: 53246,
      pa: 50850,
      pd_per: -4.5,
      gp_per: -0.36,
    },
  },
  {
    name: "Promo price discount (5% ↑)",
    kcTotals: {
      vpk: 1700000,
      uvpk: 1800000,
      vpkd_per: 5.9,
      rb: 12800000,
      ra: 13500000,
      rd_per: 5.5,
      pb: 45500,
      pa: 48000,
      pd_per: 5.5,
      gp_per: 0.3,
    },
  },
  {
    name: "New Product Launch",
    kcTotals: {
      vpk: 1750000,
      uvpk: 1800000,
      vpkd_per: 2.9,
      rb: 14000000,
      ra: 14200000,
      rd_per: 1.4,
      pb: 52000,
      pa: 54000,
      pd_per: 3.8,
      gp_per: 0.2,
    },
  },
];
