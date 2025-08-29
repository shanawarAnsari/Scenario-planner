import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  Box,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Checkbox,
  InputAdornment,
  Paper,
  MenuList,
  Popper,
  Grow,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  ArrowRight as ArrowRightIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { Category, KPIConfig } from "../types";

interface FilterFunnelMenuProps {
  categories: Category[];
  kpiConfigs: KPIConfig[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedKPIs: string[];
  onKPIChange: (kpis: string[]) => void;
}

const FilterFunnelMenu: React.FC<FilterFunnelMenuProps> = ({
  categories,
  kpiConfigs,
  searchTerm,
  onSearchChange,
  selectedKPIs,
  onKPIChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState<HTMLElement | null>(null);
  const [isSubmenuHovered, setIsSubmenuHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const menuOpen = Boolean(anchorEl);
  const submenuOpen = Boolean(submenuAnchorEl) && hoveredCategory !== null;
  const activeFiltersCount = selectedKPIs.length + (searchTerm ? 1 : 0);

  const clearTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      globalThis.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handleFilterClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setHoveredCategory(null);
    setSubmenuAnchorEl(null);
    setIsSubmenuHovered(false);
    clearTimeout();
  }, [clearTimeout]);

  const handleCategoryHover = useCallback(
    (categoryKey: string, element: HTMLElement) => {
      clearTimeout();
      setHoveredCategory(categoryKey);
      setSubmenuAnchorEl(element);
    },
    [clearTimeout]
  );

  const handleCategoryLeave = useCallback(() => {
    clearTimeout();
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isSubmenuHovered) {
        setHoveredCategory(null);
        setSubmenuAnchorEl(null);
      }
    }, 150);
  }, [isSubmenuHovered, clearTimeout]);

  const handleSubmenuEnter = useCallback(() => {
    clearTimeout();
    setIsSubmenuHovered(true);
  }, [clearTimeout]);

  const handleSubmenuLeave = useCallback(() => {
    setIsSubmenuHovered(false);
    setHoveredCategory(null);
    setSubmenuAnchorEl(null);
  }, []);

  const handleKPIToggle = useCallback(
    (kpiKey: string) => {
      onKPIChange(
        selectedKPIs.includes(kpiKey)
          ? selectedKPIs.filter((key) => key !== kpiKey)
          : [...selectedKPIs, kpiKey]
      );
    },
    [selectedKPIs, onKPIChange]
  );

  const getCategoryKPIs = useCallback(
    (categoryKey: string) =>
      kpiConfigs.filter((kpi) => kpi.category === categoryKey).map((kpi) => kpi.key),
    [kpiConfigs]
  );

  const handleCategoryToggle = useCallback(
    (categoryKey: string) => {
      const categoryKPIs = getCategoryKPIs(categoryKey);
      const allSelected = categoryKPIs.every((key) => selectedKPIs.includes(key));

      if (allSelected) {
        onKPIChange(selectedKPIs.filter((key) => !categoryKPIs.includes(key)));
      } else {
        const newSelected = [...selectedKPIs];
        categoryKPIs.forEach((key) => {
          if (!newSelected.includes(key)) newSelected.push(key);
        });
        onKPIChange(newSelected);
      }
    },
    [selectedKPIs, onKPIChange, getCategoryKPIs]
  );

  const handleClearAll = useCallback(() => {
    onSearchChange("");
    onKPIChange([]);
    handleMenuClose();
  }, [onSearchChange, onKPIChange, handleMenuClose]);

  const getCategorySelectionState = useCallback(
    (categoryKey: string) => {
      const categoryKPIs = getCategoryKPIs(categoryKey);
      const selectedCount = categoryKPIs.filter((key) =>
        selectedKPIs.includes(key)
      ).length;

      if (selectedCount === 0) return "none";
      if (selectedCount === categoryKPIs.length) return "all";
      return "partial";
    },
    [selectedKPIs, getCategoryKPIs]
  );

  const getFilteredKPIs = useCallback(
    (categoryKey: string) =>
      kpiConfigs.filter((kpi) => kpi.category === categoryKey),
    [kpiConfigs]
  );

  const hoveredCategoryData = useMemo(
    () =>
      hoveredCategory ? categories.find((cat) => cat.key === hoveredCategory) : null,
    [hoveredCategory, categories]
  );

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <TextField
        size="small"
        placeholder="Search KPI metrics..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onSearchChange("")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary", fontSize: "1.1rem" }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => onSearchChange("")}
                sx={{ p: 0.5 }}
              >
                <ClearIcon sx={{ fontSize: "0.875rem" }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          minWidth: 350,
          "& .MuiOutlinedInput-root": { fontSize: "0.875rem" },
        }}
      />

      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={handleFilterClick}
          sx={{
            p: 1,
            border: "1px solid",
            borderColor: activeFiltersCount > 0 ? "primary.main" : "grey.300",
            borderRadius: activeFiltersCount > 0 ? "8px 0 0 8px" : 1,
            bgcolor: activeFiltersCount > 0 ? "white" : "background.paper",
            color: activeFiltersCount > 0 ? "primary.main" : "text.secondary",
            position: "relative",
            zIndex: 2,
            "&:hover": {
              bgcolor: "primary.50",
              borderColor: "primary.main",
              color: "primary.main",
            },
          }}
        >
          <FilterIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>

        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            height: 35,
            transition: "width 0.3s ease-in-out",
            width: activeFiltersCount > 0 ? "auto" : 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: activeFiltersCount > 0 ? 2 : 0,
              py: 0.5,
              bgcolor: "primary.main",
              border: "1px solid",
              borderColor: "primary.main",
              borderLeft: "none",
              borderRadius: "0 8px 8px 0",
              height: "100%",
              minWidth: "max-content",
              transform:
                activeFiltersCount > 0 ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.3s ease-in-out",
              opacity: activeFiltersCount > 0 ? 1 : 0,
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "white",
                whiteSpace: "nowrap",
              }}
            >
              showing {selectedKPIs.length > 0 ? selectedKPIs.length : "all"} KPIs
            </Typography>

            <IconButton
              onClick={handleClearAll}
              size="small"
              sx={{
                ml: 1,
                p: 0.5,
                color: "white",
                "&:hover": { bgcolor: "primary.dark", color: "white" },
                transition: "all 0.2s ease-in-out",
              }}
              title="Reset all filters"
            >
              <RefreshIcon sx={{ fontSize: "1rem" }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{ sx: { minWidth: 250, maxHeight: 400, mt: 1 } }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        {categories.map((category) => {
          const selectionState = getCategorySelectionState(category.key);
          const categoryKPIs = getFilteredKPIs(category.key);

          return (
            <MenuItem
              key={category.key}
              onMouseEnter={(e) =>
                handleCategoryHover(category.key, e.currentTarget)
              }
              onMouseLeave={handleCategoryLeave}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.5,
                py: 1,
                bgcolor:
                  hoveredCategory === category.key
                    ? category.color + "10"
                    : "transparent",
                "&:hover": { bgcolor: category.color + "15" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
                <Checkbox
                  checked={selectionState === "all"}
                  indeterminate={selectionState === "partial"}
                  size="small"
                  sx={{ p: 0.5 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryToggle(category.key);
                  }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    {category.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "0.7rem", color: "text.secondary" }}
                  >
                    {categoryKPIs.length} KPIs
                  </Typography>
                </Box>
              </Box>
              <ArrowRightIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
            </MenuItem>
          );
        })}
      </Menu>

      <Popper
        open={submenuOpen}
        anchorEl={submenuAnchorEl}
        placement="right-start"
        transition
        disablePortal={false}
        modifiers={[{ name: "offset", options: { offset: [0, -8] } }]}
        sx={{ zIndex: 1301 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={150}>
            <Paper
              elevation={3}
              sx={{
                minWidth: 280,
                maxHeight: 350,
                overflow: "auto",
                border: "1px solid",
                borderColor: "grey.300",
              }}
              onMouseEnter={handleSubmenuEnter}
              onMouseLeave={handleSubmenuLeave}
            >
              {hoveredCategoryData && (
                <>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: hoveredCategoryData.color + "10",
                      borderBottom: "1px solid",
                      borderColor: "grey.200",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: hoveredCategoryData.color,
                      }}
                    >
                      {hoveredCategoryData.label} KPIs
                    </Typography>
                  </Box>

                  <MenuList dense sx={{ p: 0 }}>
                    {getFilteredKPIs(hoveredCategory!).map((kpi) => (
                      <MenuItem
                        key={kpi.key}
                        onClick={() => handleKPIToggle(kpi.key)}
                        sx={{
                          px: 1.5,
                          py: 0.75,
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <Checkbox
                          checked={selectedKPIs.includes(kpi.key)}
                          size="small"
                          sx={{ p: 0.5, mr: 1 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.8rem", lineHeight: 1.2 }}
                        >
                          {kpi.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </MenuList>
                </>
              )}
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};

export default FilterFunnelMenu;
