import React from "react";
import { Box, Typography } from "@mui/material";
import { KPI, Scenario } from "../types";
import { getTrendIcon, getTrendColor, formatValue } from "../utils";
import BarChart from "./BarChart";

interface KPIRowProps {
  kpi: KPI;
  scenarios: Scenario[];
  isLast: boolean;
}

const KPIRow: React.FC<KPIRowProps> = ({ kpi, scenarios, isLast }) => {
  return (
    <Box
      sx={{
        display: "flex",
        borderBottom: !isLast ? "1px solid #f3f4f6" : "none",
        "&:hover": { backgroundColor: "#f9fafb" },
      }}
    >
      {" "}
      <Box
        sx={{
          width: 280,
          p: 2, // Reduced from 3 to 2
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" fontWeight={700} sx={{ color: "#374151" }}>
          {kpi.label}
        </Typography>
      </Box>
      {scenarios.map((scenario, index) => {
        const value = scenario.kcTotals[kpi.key];
        const displayValue = formatValue(value, kpi.unit);
        const trendValue = kpi.trendKey ? scenario.kcTotals[kpi.trendKey] : null;

        // Determine if we should show a bar chart (for volume, revenue, profit)
        const showBarChart =
          kpi.key === "uvpk" || kpi.key === "ra" || kpi.key === "pa";
        let beforeValue = 0;

        if (showBarChart) {
          if (kpi.key === "uvpk") beforeValue = scenario.kcTotals.vpk;
          else if (kpi.key === "ra") beforeValue = scenario.kcTotals.rb;
          else if (kpi.key === "pa") beforeValue = scenario.kcTotals.pb;
        }

        return (
          <Box
            key={`${scenario.name}-${kpi.key}`}
            sx={{
              flex: 1,
              minWidth: 200,
              p: 2, // Reduced from 3 to 2
              borderRight:
                index < scenarios.length - 1 ? "1px solid #e5e7eb" : "none",
              display: "flex",
              flexDirection: showBarChart ? "column" : "row",
              alignItems: showBarChart ? "stretch" : "center",
              justifyContent: showBarChart ? "flex-start" : "space-between",
              gap: showBarChart ? 1 : 0,
            }}
          >
            {" "}
            {showBarChart ? (
              <>
                <BarChart
                  beforeValue={beforeValue}
                  afterValue={value}
                  label={kpi.label}
                  unit={kpi.unit}
                  percentageChange={trendValue || 0}
                />
              </>
            ) : (
              <>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{
                    color: value < 0 ? "#dc2626" : "#059669",
                    fontSize: "16px",
                  }}
                >
                  {displayValue}
                </Typography>
                {kpi.showTrend && trendValue !== null && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {getTrendIcon(trendValue)}
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{ color: getTrendColor(trendValue) }}
                    >
                      {Math.abs(trendValue)}%
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default KPIRow;
