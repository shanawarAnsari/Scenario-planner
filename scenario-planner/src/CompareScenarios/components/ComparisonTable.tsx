import React, { useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { BarChartOutlined, TableOutlined } from "@ant-design/icons";
import ScenarioHeader from "./ScenarioHeader";
import KPIRow from "./KPIRow";
import { KPI } from "../types";

interface ComparisonTableProps {
  scenarios: any[];
  kpis: KPI[];
  onRemoveScenario?: (index: number) => void;
  viewType: "pack" | "su";
  onViewTypeChange: (type: "pack" | "su") => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  scenarios,
  kpis,
  onRemoveScenario,
  viewType,
  onViewTypeChange,
}) => {
  const [viewMode, setViewMode] = useState<"chart" | "data">("data");

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: "chart" | "data"
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };
  const getKCTotals = (scenario: any) => {
    if (viewType === "pack") {
      return scenario.results_pack?.kcTotals || {};
    } else {
      return scenario.results_su?.kcTotals || {};
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        overflowX: "auto",
        "&::-webkit-scrollbar": {
          height: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f5f9",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#cbd5e1",
          borderRadius: "4px",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Target KPIs
        </Typography>
        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={(_, newType) => newType && onViewTypeChange(newType)}
          size="small"
        >
          <ToggleButton value="pack">Pack</ToggleButton>
          <ToggleButton value="su">SU</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ minWidth: 160 + scenarios.length * 240 }}>
        <Box sx={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
          <Box
            sx={{
              width: 180,
              minWidth: 180,
              p: 2,
              borderRight: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              left: 0,
              zIndex: 10,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ color: "#374151" }}
            >
              View Mode
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <Tooltip title="Chart View" placement="top">
                <ToggleButton value="chart" aria-label="chart view">
                  <BarChartOutlined style={{ fontSize: "16px" }} />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Data View" placement="top">
                <ToggleButton value="data" aria-label="data view">
                  <TableOutlined style={{ fontSize: "16px" }} />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          </Box>

          {scenarios.map((scenario, index) => (
            <ScenarioHeader
              key={scenario.id}
              scenario={scenario}
              index={index}
              isLast={index === scenarios.length - 1}
              onRemove={onRemoveScenario}
              totalScenarios={scenarios.length}
            />
          ))}
        </Box>

        {kpis.map((kpi, kpiIndex) => (
          <KPIRow
            key={kpi.key}
            kpi={kpi}
            scenarios={scenarios.map(getKCTotals)}
            isLast={kpiIndex === kpis.length - 1}
            viewMode={viewMode}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ComparisonTable;
