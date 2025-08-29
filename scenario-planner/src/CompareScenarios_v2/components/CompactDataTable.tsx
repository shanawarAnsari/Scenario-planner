import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { Scenario, KPIConfig } from "../types";
import { formatValue } from "../utils";

interface CompactDataTableProps {
  scenarios: Scenario[];
  kpiConfigs: KPIConfig[];
  categoryColor: string;
  onScenarioClick?: (scenario: Scenario) => void;
  useShorthand?: boolean;
}

const CompactDataTable: React.FC<CompactDataTableProps> = ({
  scenarios,
  kpiConfigs,
  categoryColor,
  onScenarioClick,
  useShorthand = true,
}) => {
  const limitedScenarios = scenarios.slice(0, 5);

  return (
    <Paper
      elevation={0}
      sx={{ overflow: "hidden" }}
      role="region"
      aria-label="KPI comparison table"
    >
      <TableContainer
        sx={{
          maxHeight: 400,
          "& .MuiTable-root": {
            borderCollapse: "separate",
            borderSpacing: 0,
          },
        }}
      >
        <Table
          stickyHeader
          size="small"
          aria-label={`${kpiConfigs.length} metrics across ${limitedScenarios.length} scenarios`}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  width: "220px",
                  minWidth: "220px",
                  bgcolor: "grey.50",
                  py: 1,
                  position: "sticky",
                  left: 0,
                  zIndex: 3,
                }}
                role="columnheader"
              ></TableCell>

              {limitedScenarios.map((scenario) => (
                <TableCell
                  key={scenario.id}
                  align="center"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    minWidth: 120,
                    bgcolor: "grey.50",
                    py: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: "#1F2937", // Darker modern grey for headers
                      cursor: onScenarioClick ? "pointer" : "default",
                      fontSize: "0.75rem",
                    }}
                    onClick={() => onScenarioClick?.(scenario)}
                  >
                    {scenario.sn}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {kpiConfigs.map((config, index) => (
              <TableRow
                key={config.key}
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                  bgcolor: index % 2 === 0 ? "transparent" : "grey.50",
                }}
              >
                <TableCell
                  sx={{
                    py: 1,
                    width: "220px",
                    minWidth: "220px",
                    position: "sticky",
                    left: 0,
                    bgcolor: index % 2 === 0 ? "background.paper" : "grey.50",
                    zIndex: 2,
                    borderRight: "1px solid",
                    borderColor: "grey.200",
                    // Ensure smooth scrolling alignment
                    transform: "translateZ(0)",
                    willChange: "transform",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        lineHeight: 1.2,
                        color: "#374151", // Modern dark grey
                      }}
                    >
                      {config.label}
                    </Typography>
                  </Box>
                </TableCell>

                {limitedScenarios.map((scenario) => {
                  const value = scenario.results.kcTotals[config.key] as number;

                  return (
                    <TableCell key={scenario.id} align="center" sx={{ py: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 400,
                          fontSize: "0.75rem",
                          color:
                            value < 0
                              ? "#EF4444" // Modern red
                              : value > 0
                              ? "#374151" // Modern dark gray
                              : "#374151", // Modern dark grey
                        }}
                      >
                        {formatValue(value, config, useShorthand)}
                      </Typography>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CompactDataTable;
