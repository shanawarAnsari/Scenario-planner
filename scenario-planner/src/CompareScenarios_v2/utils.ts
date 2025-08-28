import { KPIConfig } from "./types";

export const formatValue = (value: number, config: KPIConfig): string => {
  if (config.isCurrency) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: value < 1 ? 2 : 0,
      maximumFractionDigits: value < 1 ? 2 : 0,
    }).format(value);
  }

  if (config.isPercentage) {
    return `${value.toFixed(1)}%`;
  }

  return value.toLocaleString("en-GB");
};
