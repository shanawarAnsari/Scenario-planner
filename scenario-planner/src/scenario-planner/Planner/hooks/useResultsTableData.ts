import { useState, useMemo } from "react";
import { mockData as resultsData } from "../../mockData";

// Define types in a separate section for better readability
export interface ResultsDataItem {
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
  promoType: string;
  pa: number; // Profit After
  pb: number; // Profit Before
  pd: number; // Profit Delta
}

export type GroupLevel = "Brand" | "SubBrand" | "PPG" | "OSKU";

// Type definitions for grouped data structures
export type GroupedByOSKU = Record<string, ResultsDataItem[]>;
export type GroupedByPPG = Record<string, GroupedByOSKU>;
export type GroupedBySubBrand = Record<string, GroupedByPPG>;
export type GroupedByBrand = Record<string, GroupedBySubBrand>;

// Type to properly handle all possible data structure types
export type GroupedData =
  | GroupedByBrand
  | GroupedBySubBrand
  | GroupedByPPG
  | GroupedByOSKU
  | ResultsDataItem[];

// Create utility function outside of hooks to avoid react-hooks/rules-of-hooks error
const createStateObject = (initialState: Record<string, boolean> = {}) => {
  return initialState;
};

export const useResultsTableData = (level: GroupLevel) => {
  // Single state object for managing expansion of all levels
  const [expansionState, setExpansionState] = useState<Record<string, boolean>>({});

  // Unified toggle function
  const toggleExpansion = (id: string) => {
    setExpansionState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Batch update function for the single state
  const setExpansionStateBatch = (newState: Record<string, boolean>) => {
    setExpansionState((prev) => ({ ...prev, ...newState }));
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
            acc[item.brd][item.subBrd][item.ppg] = {};
          if (!acc[item.brd][item.subBrd][item.ppg][item.osku])
            acc[item.brd][item.subBrd][item.ppg][item.osku] = [];

          // Add the item to the appropriate group
          acc[item.brd][item.subBrd][item.ppg][item.osku].push(item);
          return acc;
        }, {} as GroupedByBrand);

      case "SubBrand":
        return resultsData.reduce((acc, item) => {
          if (!acc[item.subBrd]) acc[item.subBrd] = {};
          if (!acc[item.subBrd][item.ppg]) acc[item.subBrd][item.ppg] = {};
          if (!acc[item.subBrd][item.ppg][item.osku])
            acc[item.subBrd][item.ppg][item.osku] = [];
          acc[item.subBrd][item.ppg][item.osku].push(item);
          return acc;
        }, {} as GroupedBySubBrand);

      case "PPG":
        return resultsData.reduce((acc, item) => {
          if (!acc[item.ppg]) acc[item.ppg] = {};
          if (!acc[item.ppg][item.osku]) acc[item.ppg][item.osku] = [];
          acc[item.ppg][item.osku].push(item);
          return acc;
        }, {} as GroupedByPPG);

      case "OSKU":
        return resultsData.reduce((acc, item) => {
          if (!acc[item.osku]) acc[item.osku] = [];
          acc[item.osku].push(item);
          return acc;
        }, {} as GroupedByOSKU);

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

  const isOSKULevel = (data: GroupedData): data is GroupedByOSKU => {
    return level === "OSKU";
  };

  // Utility functions for bulk operations
  const expandAll = () => {
    const allKeysToExpand: Record<string, boolean> = {};

    // Function to recursively find all keys
    const findAllKeys = (data: any, currentLevel: number) => {
      if (typeof data !== "object" || data === null || currentLevel > 4) {
        return;
      }

      Object.keys(data).forEach((key) => {
        // Add the key for the current group level
        allKeysToExpand[key] = true;
        // Recurse into the next level
        if (!Array.isArray(data[key])) {
          // Don't recurse into the final array of items
          findAllKeys(data[key], currentLevel + 1);
        }
      });
    };

    // Start recursion from the top level of groupedData
    findAllKeys(groupedData, 0);

    // Update the single state object
    setExpansionStateBatch(allKeysToExpand);
  };

  const collapseAll = () => {
    const allKeysToCollapse: Record<string, boolean> = {};

    // Function to recursively find all keys
    const findAllKeys = (data: any, currentLevel: number) => {
      if (typeof data !== "object" || data === null || currentLevel > 4) {
        return;
      }

      Object.keys(data).forEach((key) => {
        // Add the key for the current group level
        allKeysToCollapse[key] = false; // Set to false for collapsing
        // Recurse into the next level
        if (!Array.isArray(data[key])) {
          // Don't recurse into the final array of items
          findAllKeys(data[key], currentLevel + 1);
        }
      });
    };

    // Start recursion from the top level of groupedData
    findAllKeys(groupedData, 0);

    // Update the single state object
    setExpansionStateBatch(allKeysToCollapse);
  };

  return {
    groupedData,
    expansionState, // Return the single state object
    toggleExpansion, // Return the unified toggle function
    expandAll,
    collapseAll,
  };
};
