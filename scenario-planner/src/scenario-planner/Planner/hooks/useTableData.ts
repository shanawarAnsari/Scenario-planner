import { useState, useMemo } from "react";
import mockData from "../../mockData";

interface MockDataItem {
  mfr: string;
  cust: string;
  cat: string;
  brd: string;
  subBrd: string;
  pid: string;
  ppg: string;
  section: string;
  priceperpiece: number;
  priceperpack: number;
  "AvgBaseVolume(Packs)": number;
  "AvgBaseVolume(Piece)": number;
  PromoPeriod: string;
  PromoPrice: number;
  RetailersMargin: number;
  "predicted volume per week": number;
  "uplifts vs base": number;
  osku: string; // Add osku field
}

// Updated grouping logic to strictly follow the hierarchy for each selected level
export const useTableData = (level: "Brand" | "SubBrand" | "PPG" | "OSKU") => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedSubGroups, setExpandedSubGroups] = useState<
    Record<string, boolean>
  >({});

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const toggleSubGroup = (subGroup: string) => {
    setExpandedSubGroups((prev) => ({ ...prev, [subGroup]: !prev[subGroup] }));
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
    toggleGroup,
    toggleSubGroup,
  };
};
