import React, { useState, useMemo } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import {
  ExpandMore as ExpandAllIcon,
  ExpandLess as CollapseAllIcon,
  Functions as FunctionsIcon,
  Numbers as NumbersIcon,
} from "@mui/icons-material";
import { scenariosData } from "./data";
import { categories, kpiConfigs } from "./config";
import CollapsibleTableSection from "./components/CollapsibleTableSection";
import FilterFunnelMenu from "./components/FilterFunnelMenu";

const ScenarioComparison: React.FC = () => {
  const scenarios = scenariosData;
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["volume"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>([]);
  const [useShorthand, setUseShorthand] = useState(true);

  // Filter categories and KPIs based on search and selections
  const filteredData = useMemo(() => {
    let filteredCategories = categories;
    let filteredKPIConfigs = kpiConfigs;

    // Filter by selected KPIs
    if (selectedKPIs.length > 0) {
      filteredKPIConfigs = kpiConfigs.filter((kpi) =>
        selectedKPIs.includes(kpi.key)
      );

      // Only show categories that have selected KPIs
      const categoriesWithKPIs = Array.from(
        new Set(filteredKPIConfigs.map((kpi) => kpi.category))
      );
      filteredCategories = categories.filter((cat) =>
        categoriesWithKPIs.includes(cat.key)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filteredKPIConfigs = filteredKPIConfigs.filter(
        (kpi) =>
          kpi.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          kpi.key.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Only show categories that have matching KPIs
      const categoriesWithSearchResults = Array.from(
        new Set(filteredKPIConfigs.map((kpi) => kpi.category))
      );
      filteredCategories = filteredCategories.filter((cat) =>
        categoriesWithSearchResults.includes(cat.key)
      );
    }

    return { filteredCategories, filteredKPIConfigs };
  }, [searchTerm, selectedKPIs]);

  const handleCategoryToggle = (categoryKey: string) => {
    if (expandedCategories.includes(categoryKey)) {
      setExpandedCategories((prev) => prev.filter((cat) => cat !== categoryKey));
    } else {
      setExpandedCategories((prev) => [...prev, categoryKey]);
    }
  };

  const allExpanded =
    expandedCategories.length === filteredData.filteredCategories.length;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 1.5,
        bgcolor: "grey.50",
      }}
    >
      <Container maxWidth="xl">
        {/* Header Row with Title/Subtitle on left and Filters on right */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            mb: 3,
            pt: 1,
          }}
        >
          {/* Left: Title and Subtitle */}
          <Box sx={{ flex: "0 0 auto" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: "1.5rem",
                mb: 0.5,
              }}
            >
              Scenario Comparison Dashboard
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.875rem" }}
            >
              Compare KPI metrics across scenarios with advanced filtering and search
            </Typography>
          </Box>

          {/* Right: Search and Filter Controls */}
          <Box
            sx={{
              flex: "1 1 auto",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2,
            }}
          >
            <FilterFunnelMenu
              categories={categories}
              kpiConfigs={kpiConfigs}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedKPIs={selectedKPIs}
              onKPIChange={setSelectedKPIs}
            />
          </Box>
        </Box>
        {/* Second Row: Results Summary on left, Toggle Buttons on right */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          {/* Left: Results Summary */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          >
            Showing {filteredData.filteredCategories.length} categories •{" "}
            {filteredData.filteredKPIConfigs.length} KPIs • {scenarios.length}{" "}
            scenarios
            {(selectedKPIs.length > 0 || searchTerm) && (
              <> • {selectedKPIs.length + (searchTerm ? 1 : 0)} filters active</>
            )}
          </Typography>

          {/* Right: Toggle Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Number Format Toggle */}
            <Button
              variant="outlined"
              size="small"
              startIcon={useShorthand ? <FunctionsIcon /> : <NumbersIcon />}
              onClick={() => setUseShorthand(!useShorthand)}
              sx={{
                fontSize: "0.75rem",
                py: 0.5,
                px: 1.5,
                minWidth: "auto",
                textTransform: "none",
                borderColor: "grey.300",
                color: "text.secondary",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "primary.50",
                },
              }}
              title={
                useShorthand
                  ? "Switch to exact values"
                  : "Switch to shorthand (K, M, B)"
              }
            >
              {useShorthand ? "K/M/B" : "Exact"}
            </Button>

            {/* Expand/Collapse Toggle */}
            {filteredData.filteredCategories.length > 0 && (
              <Button
                variant="outlined"
                size="small"
                startIcon={allExpanded ? <CollapseAllIcon /> : <ExpandAllIcon />}
                onClick={() => {
                  if (allExpanded) {
                    setExpandedCategories([]);
                  } else {
                    const allCategoryKeys = filteredData.filteredCategories.map(
                      (cat) => cat.key
                    );
                    setExpandedCategories(allCategoryKeys);
                  }
                }}
                sx={{
                  fontSize: "0.75rem",
                  py: 0.5,
                  px: 1.5,
                  minWidth: "auto",
                  textTransform: "none",
                  borderColor: "grey.300",
                  color: "text.secondary",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "primary.50",
                  },
                }}
              >
                {allExpanded ? "Collapse All" : "Expand All"}
              </Button>
            )}
          </Box>
        </Box>{" "}
        {/* KPI Categories */}
        {filteredData.filteredCategories.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "text.secondary",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: "1.1rem", mb: 1 }}>
              No results found
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        ) : (
          filteredData.filteredCategories.map((category) => (
            <CollapsibleTableSection
              key={category.key}
              category={category}
              scenarios={scenarios}
              kpiConfigs={filteredData.filteredKPIConfigs}
              expanded={expandedCategories.includes(category.key)}
              onChange={() => handleCategoryToggle(category.key)}
              useShorthand={useShorthand}
            />
          ))
        )}
      </Container>
    </Box>
  );
};

export default ScenarioComparison;
