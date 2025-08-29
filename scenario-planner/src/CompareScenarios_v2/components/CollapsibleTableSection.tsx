import React, { useState } from "react";
import { Box, Typography, IconButton, Chip, Collapse, Paper } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { Category, Scenario, KPIConfig } from "../types";
import CompactDataTable from "./CompactDataTable";
import ScenarioDetailsDialog from "./ScenarioDetailsDialog";

interface CollapsibleTableSectionProps {
  category: Category;
  scenarios: Scenario[];
  kpiConfigs: KPIConfig[];
  expanded: boolean;
  onChange: () => void;
  useShorthand?: boolean;
}

const CollapsibleTableSection: React.FC<CollapsibleTableSectionProps> = ({
  category,
  scenarios,
  kpiConfigs,
  expanded,
  onChange,
  useShorthand = true,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const categoryKPIs = kpiConfigs.filter(
    (config) => config.category === category.key
  );

  const handleScenarioClick = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedScenario(null);
  };

  if (categoryKPIs.length === 0) return null;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          mb: 1,
          border: "1px solid",
          borderColor: "grey.200",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1.5,
            bgcolor: expanded ? `${category.color}08` : "grey.50",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: expanded ? `${category.color}15` : "grey.100",
            },
          }}
          onClick={onChange}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: category.color,
                fontSize: "1.1rem",
              }}
            >
              {category.icon}
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "text.primary",
              }}
            >
              {category.label}
            </Typography>
            <Chip
              label={`${categoryKPIs.length} KPIs`}
              size="small"
              sx={{
                fontSize: "0.7rem",
                height: 20,
                bgcolor: `${category.color}15`,
                color: category.color,
                fontWeight: 500,
              }}
            />
          </Box>

          <IconButton
            size="small"
            sx={{
              transition: "transform 0.2s ease-in-out",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <ExpandMoreIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton>
        </Box>

        {/* Collapsible Content */}
        <Collapse in={expanded} timeout={200}>
          <Box sx={{ borderTop: "1px solid", borderColor: "grey.200" }}>
            <CompactDataTable
              scenarios={scenarios}
              kpiConfigs={categoryKPIs}
              categoryColor={category.color}
              onScenarioClick={handleScenarioClick}
              useShorthand={useShorthand}
            />
          </Box>
        </Collapse>
      </Paper>

      {/* Scenario Details Dialog */}
      <ScenarioDetailsDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        scenario={selectedScenario}
      />
    </>
  );
};

export default CollapsibleTableSection;
