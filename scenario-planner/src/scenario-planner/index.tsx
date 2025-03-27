import { Box, useTheme } from "@mui/material";
import React from "react";
import TableView from "./Planner/TableView";

const ScenarioPlanner: React.FC = () => {
  const theme = useTheme();
  return (
    <>
      <Box>
        <TableView level={"Brand"} />
      </Box>
    </>
  );
};

export default ScenarioPlanner;
