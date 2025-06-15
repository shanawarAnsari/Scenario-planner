import React, { useState } from "react";
import { Box } from "@mui/material";
import { mockScenarios } from "./data";
import { kpis } from "./config";
import ComparisonHeader from "./components/ComparisonHeader";
import ComparisonTable from "./components/ComparisonTable";

const ScenarioComparison: React.FC = () => {
  const [scenariosToCompare, setScenariosToCompare] = useState(mockScenarios);

  const handleRemoveScenario = (index: number) => {
    setScenariosToCompare((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <ComparisonHeader
        title="Detailed comparison"
        subtitle={`Comparing ${scenariosToCompare.length} solutions`}
      />
      <ComparisonTable
        scenarios={scenariosToCompare}
        kpis={kpis}
        onRemoveScenario={handleRemoveScenario}
      />
    </Box>
  );
};

export default ScenarioComparison;
