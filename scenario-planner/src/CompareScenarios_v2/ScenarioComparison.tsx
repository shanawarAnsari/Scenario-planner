import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { scenariosData } from "./data";
import { categories, kpiConfigs } from "./config";
import KPICategoryAccordion from "./components/KPICategoryAccordion";

const ScenarioComparison: React.FC = () => {
  const scenarios = scenariosData;
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["volume"]);

  const handleCategoryChange =
    (category: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      if (isExpanded) {
        setExpandedCategories((prev) => [...prev, category]);
      } else {
        setExpandedCategories((prev) => prev.filter((cat) => cat !== category));
      }
    };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 2,
      }}
    >
      <Container maxWidth="xl">
        {/* KPI Categories */}
        {categories.map((category) => (
          <KPICategoryAccordion
            key={category.key}
            category={category}
            scenarios={scenarios}
            kpiConfigs={kpiConfigs}
            expanded={expandedCategories.includes(category.key)}
            onChange={handleCategoryChange(category.key)}
          />
        ))}
      </Container>
    </Box>
  );
};

export default ScenarioComparison;
