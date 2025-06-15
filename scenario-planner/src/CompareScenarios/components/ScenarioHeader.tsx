import React from "react";
import { Box, Typography, Chip, IconButton } from "@mui/material";
import { MinusOutlined } from "@ant-design/icons";
import { Scenario } from "../types";

interface ScenarioHeaderProps {
  scenario: Scenario;
  index: number;
  isLast: boolean;
  onRemove?: (index: number) => void;
}

const ScenarioHeader: React.FC<ScenarioHeaderProps> = ({
  scenario,
  index,
  isLast,
  onRemove,
}) => {
  return (
    <Box
      sx={{
        width: 250, // Fixed width to 250px
        minWidth: 250, // Prevent shrinking below 250px
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
          maxWidth: "190px", // Leave space for the minus icon
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
          <MinusOutlined style={{ fontSize: "16px" }} />
        </IconButton>
      )}
    </Box>
  );
};

export default ScenarioHeader;
