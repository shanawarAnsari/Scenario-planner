import React, { useState } from "react";
import { Box } from "@mui/material";
import { mockScenarios } from "./data";
import { kpis } from "./config";
import ComparisonHeader from "./components/ComparisonHeader";
import ComparisonTable from "./components/ComparisonTable";

const ScenarioComparison: React.FC = () => {
  const [scenariosToCompare] = useState(mockScenarios);

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <ComparisonHeader
        title="Detailed comparison"
        subtitle={`Comparing ${mockScenarios.length} solutions`}
      />
      <ComparisonTable scenarios={scenariosToCompare} kpis={kpis} />
    </Box>
  );
};

export default ScenarioComparison;
