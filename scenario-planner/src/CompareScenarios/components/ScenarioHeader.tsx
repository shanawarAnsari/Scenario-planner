import React from "react";
import { Box, Typography, Chip, IconButton } from "@mui/material";
import { MinusCircleTwoTone } from "@ant-design/icons";
import { Scenario } from "../types";

interface ScenarioHeaderProps {
  scenario: Scenario;
  index: number;
  isLast: boolean;
  onRemove?: (index: number) => void;
  totalScenarios: number;
}

const ScenarioHeader: React.FC<ScenarioHeaderProps> = ({
  scenario,
  index,
  isLast,
  onRemove,
  totalScenarios,
}) => {
  // Calculate dynamic width based on number of scenarios
  // For 1-4 scenarios, expand to fill space. For 5+, use fixed 300px
  const getColumnWidth = () => {
    if (totalScenarios <= 4) {
      // Calculate available width after left column (180px)
      // Distribute remaining space equally among scenarios
      return `calc((100% - 180px) / ${totalScenarios})`;
    }
    return "300px"; // Fixed width for 5+ scenarios
  };

  return (
    <Box
      sx={{
        width: getColumnWidth(),
        minWidth: totalScenarios <= 4 ? "200px" : "300px",
        p: 2,
        borderRight: !isLast ? "1px solid #e5e7eb" : "none",
        backgroundColor: "#f9fafb",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Chip
        label={scenario.name}
        variant="outlined"
        sx={{
          borderRadius: "2px",
          borderColor: "primary.main",
          color: "primary.main",
          fontSize: "14px",
          height: "auto",
          maxWidth: "220px", // Leave space for the minus icon
          "& .MuiChip-label": {
            padding: "4px 8px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }}
      />
      {onRemove && (
        <IconButton
          size="small"
          onClick={() => onRemove(index)}
          sx={{
            color: "#6b7280",
            "&:hover": {
              color: "#dc2626",
              backgroundColor: "#fef2f2",
            },
          }}
        >
          <MinusCircleTwoTone style={{ fontSize: "16px" }} />
        </IconButton>
      )}
    </Box>
  );
};

export default ScenarioHeader;
