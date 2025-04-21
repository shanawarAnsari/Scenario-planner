import { useState, useMemo } from "react";
import { mockData } from "../../mockData";

interface MockDataItem {
  osku: string;
  brd: string;
  subBrd: string;
  ppg: string;
  pid: string;
  ppk: number;
  vpk: number;
}

// Updated grouping logic to strictly follow the hierarchy for each selected level
export const useTableData = (level: "Brand" | "SubBrand" | "PPG" | "OSKU") => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedSubGroups, setExpandedSubGroups] = useState<
    Record<string, boolean>
  >({});
  const [expandedPPGs, setExpandedPPGs] = useState<Record<string, boolean>>({});

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const toggleSubGroup = (subGroup: string) => {
    setExpandedSubGroups((prev) => ({ ...prev, [subGroup]: !prev[subGroup] }));
  };

  const togglePPG = (ppg: string) => {
    setExpandedPPGs((prev) => ({ ...prev, [ppg]: !prev[ppg] }));
  };

  const groupedData = useMemo(() => {
    switch (level) {
      case "Brand":
        return mockData.reduce((acc, item) => {
          if (!acc[item.brd]) {
            acc[item.brd] = {};
          }
          if (!acc[item.brd][item.subBrd]) {
            acc[item.brd][item.subBrd] = {};
          }
          if (!acc[item.brd][item.subBrd][item.ppg]) {
            acc[item.brd][item.subBrd][item.ppg] = [];
          }
          acc[item.brd][item.subBrd][item.ppg].push(item);
          return acc;
        }, {} as Record<string, Record<string, Record<string, MockDataItem[]>>>);
      case "SubBrand":
        return mockData.reduce((acc, item) => {
          if (!acc[item.subBrd]) {
            acc[item.subBrd] = {};
          }
          if (!acc[item.subBrd][item.ppg]) {
            acc[item.subBrd][item.ppg] = [];
          }
          acc[item.subBrd][item.ppg].push(item);
          return acc;
        }, {} as Record<string, Record<string, MockDataItem[]>>);
      case "PPG":
        return mockData.reduce((acc, item) => {
          if (!acc[item.ppg]) {
            acc[item.ppg] = [];
          }
          acc[item.ppg].push(item);
          return acc;
        }, {} as Record<string, MockDataItem[]>);
      case "OSKU":
        return mockData;
      default:
        return {};
    }
  }, [level]);

  return {
    groupedData,
    expandedGroups,
    expandedSubGroups,
    expandedPPGs,
    toggleGroup,
    toggleSubGroup,
    togglePPG,
  };
};
