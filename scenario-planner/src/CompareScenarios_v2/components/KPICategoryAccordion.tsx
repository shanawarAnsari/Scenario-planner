import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { Category, Scenario, KPIConfig } from "../types";
import KPITableRow from "./KPITableRow";
import ScenarioDetailsDialog from "./ScenarioDetailsDialog";

interface KPICategoryAccordionProps {
  category: Category;
  scenarios: Scenario[];
  kpiConfigs: KPIConfig[];
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const KPICategoryAccordion: React.FC<KPICategoryAccordionProps> = ({
  category,
  scenarios,
  kpiConfigs,
  expanded,
  onChange,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const categoryKPIs = kpiConfigs.filter(
    (config) => config.category === category.key
  );

  const limitedScenarios = scenarios.slice(0, 5);

  const handleScenarioClick = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedScenario(null);
  };

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={onChange}
        sx={{
          mb: 2,
          "&:before": { display: "none" },
          "&.Mui-expanded": {
            margin: "0 0 16px 0",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            "&.Mui-expanded": {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: category.color,
                  mr: 2,
                }}
              >
                {category.icon}
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                }}
              >
                {category.label}
              </Typography>
            </Box>
            <Chip
              label={`${categoryKPIs.length} KPIs`}
              size="small"
              sx={{
                ml: 2,
                fontWeight: 500,
              }}
            />
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem",
                      width: "50px",
                      minWidth: "50px",
                      maxWidth: "50px",
                    }}
                  >
                    KPI Metric
                  </TableCell>
                  {limitedScenarios.map((scenario) => (
                    <TableCell
                      key={scenario.id}
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        minWidth: 150,
                        p: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            backgroundColor: "action.hover",
                            borderRadius: 1,
                            transform: "scale(1.1)",
                          },
                          p: 1,
                          borderRadius: 1,
                        }}
                        onClick={() => handleScenarioClick(scenario)}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {scenario.sn}
                        </Typography>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryKPIs.map((config) => (
                  <KPITableRow
                    key={config.key}
                    config={config}
                    scenarios={limitedScenarios}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* Scenario Details Dialog */}
      <ScenarioDetailsDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        scenario={selectedScenario}
      />
    </>
  );
};

export default KPICategoryAccordion;
