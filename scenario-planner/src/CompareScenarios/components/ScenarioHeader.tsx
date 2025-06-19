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
  const getColumnWidth = () => {
    if (totalScenarios <= 4) {
      return `calc((100% - 160px) / ${totalScenarios})`;
    }
    return "240px";
  };

  return (
    <Box
      sx={{
        width: getColumnWidth(),
        minWidth: totalScenarios <= 4 ? "160px" : "240px",
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
        label={scenario.sn}
        variant="outlined"
        sx={{
          borderRadius: "2px",
          borderColor: "#fc48de",
          color: "#fc48de",
          fontSize: "14px",
          height: "auto",
          maxWidth: "180px",
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
