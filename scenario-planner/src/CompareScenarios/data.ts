import { Scenario } from "./types";

export const mockScenarios: Scenario[] = [
  {
    name: "Tesco - Andrex pricing discount",
    kcTotals: {
      vpk: 1897743,
      uvpk: 1913613,
      vpkd_per: 1,
      rb: 14538405,
      ra: 14777977,
      rd_per: 2,
      pb: 50850,
      pa: 53246,
      pd_per: -5,
      gp_per: -0.36,
    },
  },
  {
    name: "Promo price discount (5% ↑)",
    kcTotals: {
      vpk: 1800000,
      uvpk: 1897743,
      vpkd_per: 5.4,
      rb: 13500000,
      ra: 14538405,
      rd_per: 7.7,
      pb: 48000,
      pa: 50850,
      pd_per: 5.9,
      gp_per: 0.3,
    },
  },
];
