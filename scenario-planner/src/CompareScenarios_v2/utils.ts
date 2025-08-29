import { KPIConfig } from "./types";

export const formatValue = (
  value: number,
  config: KPIConfig,
  useShorthand: boolean = true
): string => {
  // Handle undefined, null, or NaN values
  if (value === undefined || value === null || isNaN(value)) {
    return "N/A";
  }

  if (config.isCurrency) {
    if (useShorthand) {
      // Format large numbers with K, M, B suffixes for compact display
      if (Math.abs(value) >= 1000000000) {
        return `£${(value / 1000000000).toFixed(1)}B`;
      } else if (Math.abs(value) >= 1000000) {
        return `£${(value / 1000000).toFixed(1)}M`;
      } else if (Math.abs(value) >= 1000) {
        return `£${(value / 1000).toFixed(1)}K`;
      }
    }

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

  if (useShorthand) {
    // Format large numbers with K, M, B suffixes for regular numbers
    if (Math.abs(value) >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
  }

  return value.toLocaleString("en-GB");
};
