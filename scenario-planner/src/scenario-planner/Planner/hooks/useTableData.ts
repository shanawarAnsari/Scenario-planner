import { useState, useMemo } from "react";
import { mockData as resultsData } from "../../mockData";

// Define types in a separate section for better readability
export interface MockDataItem {
  osku: string;
  brd: string;
  subBrd: string;
  ppg: string;
  pid: string;
  ppk: number;
  vpk: number;
  ppka: number;
  deltaPpk: number;
  vpka: number;
  deltaVpk: number;
  r: number;
  ra: number;
  deltaRev: number;
}

export type GroupLevel = "Brand" | "SubBrand" | "PPG" | "OSKU";

// Type definitions for grouped data structures
export type GroupedByPPG = Record<string, MockDataItem[]>;
export type GroupedBySubBrand = Record<string, GroupedByPPG>;
export type GroupedByBrand = Record<string, GroupedBySubBrand>;

// Type to properly handle all possible data structure types
export type GroupedData =
  | GroupedByBrand
  | GroupedBySubBrand
  | GroupedByPPG
  | MockDataItem[];

// Create utility function outside of hooks to avoid react-hooks/rules-of-hooks error
const createStateObject = (initialState: Record<string, boolean> = {}) => {
  return initialState;
};

export const useTableData = (level: GroupLevel) => {
  // Use separate useState hooks for each expansion state
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedSubGroups, setExpandedSubGroups] = useState<
    Record<string, boolean>
  >({});
  const [expandedPPGs, setExpandedPPGs] = useState<Record<string, boolean>>({});

  // Toggle functions
  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSubGroup = (id: string) => {
    setExpandedSubGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePPG = (id: string) => {
    setExpandedPPGs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Batch update functions
  const setGroupsBatch = (newState: Record<string, boolean>) => {
    setExpandedGroups((prev) => ({ ...prev, ...newState }));
  };

  const setSubGroupsBatch = (newState: Record<string, boolean>) => {
    setExpandedSubGroups((prev) => ({ ...prev, ...newState }));
  };

  const setPPGsBatch = (newState: Record<string, boolean>) => {
    setExpandedPPGs((prev) => ({ ...prev, ...newState }));
  };

  // Group data based on the selected level
  const groupedData: GroupedData = useMemo(() => {
    switch (level) {
      case "Brand":
        return resultsData.reduce((acc, item) => {
          // Initialize nested objects if they don't exist
          if (!acc[item.brd]) acc[item.brd] = {};
          if (!acc[item.brd][item.subBrd]) acc[item.brd][item.subBrd] = {};
          if (!acc[item.brd][item.subBrd][item.ppg])
            acc[item.brd][item.subBrd][item.ppg] = [];

          // Add the item to the appropriate group
          acc[item.brd][item.subBrd][item.ppg].push(item);
          return acc;
        }, {} as GroupedByBrand);

      case "SubBrand":
        return resultsData.reduce((acc, item) => {
          if (!acc[item.subBrd]) acc[item.subBrd] = {};
          if (!acc[item.subBrd][item.ppg]) acc[item.subBrd][item.ppg] = [];
          acc[item.subBrd][item.ppg].push(item);
          return acc;
        }, {} as GroupedBySubBrand);

      case "PPG":
        return resultsData.reduce((acc, item) => {
          if (!acc[item.ppg]) acc[item.ppg] = [];
          acc[item.ppg].push(item);
          return acc;
        }, {} as GroupedByPPG);

      case "OSKU":
        return resultsData;

      default:
        return {};
    }
  }, [level]);

  // Type guard functions to improve type safety
  const isBrandLevel = (data: GroupedData): data is GroupedByBrand => {
    return level === "Brand";
  };

  const isSubBrandLevel = (data: GroupedData): data is GroupedBySubBrand => {
    return level === "SubBrand";
  };

  const isPPGLevel = (data: GroupedData): data is GroupedByPPG => {
    return level === "PPG";
  };

  // Utility functions for bulk operations
  const expandAll = () => {
    const groups: Record<string, boolean> = {};
    const subGroups: Record<string, boolean> = {};
    const ppgs: Record<string, boolean> = {};

    // Extract all keys from the grouped data based on level
    if (isBrandLevel(groupedData)) {
      Object.keys(groupedData).forEach((brand) => {
        groups[brand] = true;

        const brandData = groupedData[brand];
        Object.keys(brandData).forEach((subBrand) => {
          subGroups[subBrand] = true;

          const subBrandData = brandData[subBrand];
          Object.keys(subBrandData).forEach((ppg) => {
            ppgs[ppg] = true;
          });
        });
      });
    } else if (isSubBrandLevel(groupedData)) {
      Object.keys(groupedData).forEach((subBrand) => {
        groups[subBrand] = true;

        const subBrandData = groupedData[subBrand];
        Object.keys(subBrandData).forEach((ppg) => {
          ppgs[ppg] = true;
        });
      });
    } else if (isPPGLevel(groupedData)) {
      Object.keys(groupedData).forEach((ppg) => {
        ppgs[ppg] = true;
      });
    }

    // Update all states at once
    setGroupsBatch(groups);
    setSubGroupsBatch(subGroups);
    setPPGsBatch(ppgs);
  };

  const collapseAll = () => {
    const groups: Record<string, boolean> = {};
    const subGroups: Record<string, boolean> = {};
    const ppgs: Record<string, boolean> = {};

    // Extract all keys from the grouped data based on level
    if (isBrandLevel(groupedData)) {
      Object.keys(groupedData).forEach((brand) => {
        groups[brand] = false;

        const brandData = groupedData[brand];
        Object.keys(brandData).forEach((subBrand) => {
          subGroups[subBrand] = false;

          const subBrandData = brandData[subBrand];
          Object.keys(subBrandData).forEach((ppg) => {
            ppgs[ppg] = false;
          });
        });
      });
    } else if (isSubBrandLevel(groupedData)) {
      Object.keys(groupedData).forEach((subBrand) => {
        groups[subBrand] = false;

        const subBrandData = groupedData[subBrand];
        Object.keys(subBrandData).forEach((ppg) => {
          ppgs[ppg] = false;
        });
      });
    } else if (isPPGLevel(groupedData)) {
      Object.keys(groupedData).forEach((ppg) => {
        ppgs[ppg] = false;
      });
    }

    // Update all states at once
    setGroupsBatch(groups);
    setSubGroupsBatch(subGroups);
    setPPGsBatch(ppgs);
  };

  return {
    groupedData,
    expandedGroups,
    expandedSubGroups,
    expandedPPGs,
    toggleGroup,
    toggleSubGroup,
    togglePPG,
    expandAll,
    collapseAll,
  };
};
