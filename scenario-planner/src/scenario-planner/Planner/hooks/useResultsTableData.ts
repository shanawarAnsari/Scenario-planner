import { useState, useMemo } from "react";
import { mockData } from "../../mockData_2";

// Define types to match the new data structure
export interface KPI {
  pt: string; // Promo Type
  ppk: number; // Price per unit
  uppk: number; // Updated price per unit
  ppkd: number; // Price delta
  vpk: number; // Volume
  uvpk: number; // Updated volume
  vpkd: number; // Volume delta
  rb: number; // Revenue before
  ra: number; // Revenue after
  rd: number; // Revenue delta
  pb: number; // Profit before
  pa: number; // Profit after
  pd: number; // Profit delta
}

export interface Product {
  pid: string;
  osku: string;
  brd: string;
  subBrd: string;
  ppg: string;
  mfr: string;
  cat: string;
  cust: string;
  kpis: KPI[];
}

// Flattened structure for rendering in table - each KPI becomes an item
export interface ResultsDataItem {
  osku: string;
  brd: string;
  subBrd: string;
  ppg: string;
  pid: string;
  ppk: number;
  vpk: number;
  ppka: number; // using uppk as ppka
  deltaPpk: number; // using ppkd as deltaPpk
  vpka: number; // using uvpk as vpka
  deltaVpk: number; // calculated from vpk and uvpk
  r: number; // using rb as r
  ra: number;
  deltaRev: number; // calculated from rb and ra
  promoType: string; // using pt as promoType
  pa: number;
  pb: number;
  pd: number;
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

// Function to convert the new data structure to the flat structure needed for rendering
const transformData = (products: Product[]): ResultsDataItem[] => {
  const items: ResultsDataItem[] = [];

  products.forEach((product) => {
    product.kpis.forEach((kpi) => {
      // Calculate percentage change for volume and revenue
      const deltaVpkPercent = kpi.vpk !== 0 ? (kpi.vpkd / kpi.vpk) * 100 : 0;
      const deltaRevPercent =
        kpi.rb !== 0 ? ((kpi.ra - kpi.rb) / Math.abs(kpi.rb)) * 100 : 0;

      items.push({
        osku: product.osku,
        brd: product.brd,
        subBrd: product.subBrd,
        ppg: product.ppg,
        pid: product.pid,
        ppk: kpi.ppk,
        vpk: kpi.vpk,
        ppka: kpi.uppk,
        deltaPpk: kpi.ppkd,
        vpka: kpi.uvpk,
        deltaVpk: deltaVpkPercent,
        r: kpi.rb,
        ra: kpi.ra,
        deltaRev: deltaRevPercent,
        promoType: kpi.pt,
        pa: kpi.pa,
        pb: kpi.pb,
        pd: kpi.pd,
      });
    });
  });

  return items;
};

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

  // Convert new data structure to flat structure
  const resultsData = useMemo(() => transformData(mockData.products), []);

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
  }, [level, resultsData]);

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
