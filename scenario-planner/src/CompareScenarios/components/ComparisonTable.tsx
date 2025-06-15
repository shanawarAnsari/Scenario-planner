import React from "react";
import { Box, Typography } from "@mui/material";
import { Scenario, KPI } from "../types";
import ScenarioHeader from "./ScenarioHeader";
import KPIRow from "./KPIRow";

interface ComparisonTableProps {
  scenarios: Scenario[];
  kpis: KPI[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ scenarios, kpis }) => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header Row */}
      <Box sx={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
        {/* Left Column Header */}{" "}
        <Box
          sx={{
            width: 280,
            p: 2,
            borderRight: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: "#374151" }}>
            Target KPIs
          </Typography>
        </Box>
        {/* Scenario Headers */}
        {scenarios.map((scenario, index) => (
          <ScenarioHeader
            key={scenario.name}
            scenario={scenario}
            index={index}
            isLast={index === scenarios.length - 1}
          />
        ))}
      </Box>

      {/* KPI Rows */}
      {kpis.map((kpi, kpiIndex) => (
        <KPIRow
          key={kpi.key}
          kpi={kpi}
          scenarios={scenarios}
          isLast={kpiIndex === kpis.length - 1}
        />
      ))}
    </Box>
  );
};

export default ComparisonTable;
