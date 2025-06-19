import React, { useState } from "react";
import { Box } from "@mui/material";
import { kpis } from "./config";
import { mockScenarios } from "./data";
import ComparisonTable from "./components/ComparisonTable";

const ScenarioComparison: React.FC = () => {
  const [scenariosToCompare, setScenariosToCompare] = useState(mockScenarios);
  const [viewType, setViewType] = useState<"pack" | "su">("pack");

  const handleRemoveScenario = (index: number) => {
    setScenariosToCompare((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "40vh" }}>
      <ComparisonTable
        scenarios={scenariosToCompare}
        kpis={kpis}
        onRemoveScenario={handleRemoveScenario}
        viewType={viewType}
        onViewTypeChange={setViewType}
      />
    </Box>
  );
};

export default ScenarioComparison;
