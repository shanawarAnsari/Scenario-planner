import React, { useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { BarChartOutlined, TableOutlined } from "@ant-design/icons";
import { Scenario, KPI } from "../types";
import ScenarioHeader from "./ScenarioHeader";
import KPIRow from "./KPIRow";

interface ComparisonTableProps {
  scenarios: Scenario[];
  kpis: KPI[];
  onRemoveScenario?: (index: number) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  scenarios,
  kpis,
  onRemoveScenario,
}) => {
  const [viewMode, setViewMode] = useState<"chart" | "data">("chart");

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: "chart" | "data"
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
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
      {" "}
      <Box
        sx={{
          width: "100%", // Take full width of container
          minWidth: 180 + scenarios.length * 300, // Ensure minimum width for all columns
        }}
      >
        {/* Header Row */}
        <Box sx={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
          {/* Left Column Header */}
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
              Target KPIs
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
              sx={{
                height: "28px",
                "& .MuiToggleButton-root": {
                  border: "1px solid #d1d5db",
                  padding: "2px",
                  minWidth: "36px",
                  "&.Mui-selected": {
                    backgroundColor: "#3b82f6",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#2563eb",
                    },
                  },
                  "&:not(.Mui-selected)": {
                    backgroundColor: "white",
                    color: "#6b7280",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  },
                },
              }}
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
          </Box>{" "}
          {scenarios.map((scenario, index) => (
            <ScenarioHeader
              key={scenario.name}
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
            scenarios={scenarios}
            isLast={kpiIndex === kpis.length - 1}
            viewMode={viewMode}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ComparisonTable;
