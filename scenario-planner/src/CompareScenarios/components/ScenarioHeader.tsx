import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { Scenario } from "../types";

interface ScenarioHeaderProps {
  scenario: Scenario;
  index: number;
  isLast: boolean;
}

const ScenarioHeader: React.FC<ScenarioHeaderProps> = ({
  scenario,
  index,
  isLast,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 200,
        p: 2,
        borderRight: !isLast ? "1px solid #e5e7eb" : "none",
        backgroundColor: "#f9fafb",
        position: "relative",
      }}
    >
      <Chip
        label={scenario.name}
        variant="outlined"
        sx={{
          borderRadius: "2px",
          borderColor: "primary.main",
          color: "primary.main",
          fontSize: "16px",
          height: "auto",
          "& .MuiChip-label": {
            padding: "4px 8px",
          },
        }}
      />
    </Box>
  );
};

export default ScenarioHeader;
