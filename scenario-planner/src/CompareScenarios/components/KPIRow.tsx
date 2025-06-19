import React from "react";
import { Box, Typography } from "@mui/material";
import { KPI } from "../types";
import { getTrendIcon, getTrendColor, formatValue } from "../utils";
import BarChart from "./BarChart";

interface KPIRowProps {
  kpi: KPI;
  scenarios: any[]; // Now each scenario is a KC_totals object
  isLast: boolean;
  viewMode: "chart" | "data";
}

const KPIRow: React.FC<KPIRowProps> = ({ kpi, scenarios, isLast, viewMode }) => {
  const getColumnWidth = () => {
    if (scenarios.length <= 4) {
      return `calc((100% - 160px) / ${scenarios.length})`;
    }
    return "240px";
  };

  return (
    <Box
      sx={{
        display: "flex",
        borderBottom: !isLast ? "1px solid #f3f4f6" : "none",
        "&:hover": { backgroundColor: "#f9fafb" },
      }}
    >
      <Box
        sx={{
          width: 180,
          minWidth: 180,
          p: 1,
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          position: "sticky",
          left: 0,
          zIndex: 5,
        }}
      >
        <Typography variant="body2" fontWeight={700} sx={{ color: "#374151" }}>
          {kpi.label}
        </Typography>
      </Box>

      {scenarios.map((kcTotals, index) => {
        const value = kcTotals[kpi.key];
        const displayValue = formatValue(value, kpi.unit);
        const trendValue = kpi.trendKey ? kcTotals[kpi.trendKey] : null;

        const showBarChart =
          (kpi.key === "uvpk" || kpi.key === "ra" || kpi.key === "pa") &&
          viewMode === "chart";

        let beforeValue = 0;
        if (showBarChart) {
          if (kpi.key === "uvpk") beforeValue = kcTotals.vpk;
          else if (kpi.key === "ra") beforeValue = kcTotals.rb;
          else if (kpi.key === "pa") beforeValue = kcTotals.pb;
        }

        return (
          <Box
            key={`${kpi.key}-${index}`}
            sx={{
              width: getColumnWidth(),
              minWidth: scenarios.length <= 4 ? "160px" : "240px",
              p: viewMode === "data" ? 2 : 1,
              borderRight:
                index < scenarios.length - 1 ? "1px solid #e5e7eb" : "none",
              display: "flex",
              flexDirection: showBarChart ? "column" : "row",
              alignItems: showBarChart ? "stretch" : "center",
              justifyContent: showBarChart ? "flex-start" : "space-between",
              gap: showBarChart ? 1 : 0,
            }}
          >
            {showBarChart ? (
              <BarChart
                beforeValue={beforeValue}
                afterValue={value}
                label={kpi.label}
                unit={kpi.unit}
                percentageChange={trendValue || 0}
              />
            ) : (
              <>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{ color: "#374151", fontSize: "14px" }}
                >
                  {displayValue}
                </Typography>
                {kpi.showTrend && trendValue !== null && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 1,
                    }}
                  >
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
