import React from "react";
import { Box, Typography, TableCell, TableRow } from "@mui/material";
import { Scenario, KPIConfig } from "../types";
import { formatValue } from "../utils";

interface KPITableRowProps {
  config: KPIConfig;
  scenarios: Scenario[];
}

const KPITableRow: React.FC<KPITableRowProps> = ({ config, scenarios }) => {
  return (
    <TableRow
      sx={{
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <TableCell
        sx={{ py: 2, width: "250px", minWidth: "250px", maxWidth: "250px" }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              color: config.color,
              mr: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            {config.icon}
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {config.label}
          </Typography>
        </Box>
      </TableCell>

      {scenarios.map((scenario) => (
        <TableCell key={scenario.id} align="center" sx={{ py: 2 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            {formatValue(
              (scenario.results.kcTotals as any)[config.key] as number,
              config
            )}
          </Typography>
        </TableCell>
      ))}
    </TableRow>
  );
};

export default KPITableRow;
