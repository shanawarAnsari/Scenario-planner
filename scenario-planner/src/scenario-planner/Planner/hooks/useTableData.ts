import { useState } from "react";
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
}

export const useTableData = (level: "Brand" | "SubBrand" | "PPG") => {
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

  const groupedData =
    level === "Brand"
      ? mockData.reduce((acc, item) => {
          if (!acc[item.brd]) acc[item.brd] = {};
          if (!acc[item.brd][item.subBrd]) acc[item.brd][item.subBrd] = [];
          acc[item.brd][item.subBrd].push(item);
          return acc;
        }, {} as Record<string, Record<string, MockDataItem[]>>)
      : level === "SubBrand"
      ? mockData.reduce((acc, item) => {
          if (!acc[item.subBrd]) acc[item.subBrd] = [];
          acc[item.subBrd].push(item);
          return acc;
        }, {} as Record<string, MockDataItem[]>)
      : mockData;

  const calculateAggregates = (items: MockDataItem[]) => {
    const totalPacks = items.reduce(
      (sum, item) => sum + item["AvgBaseVolume(Packs)"],
      0
    );
    const totalPieces = items.reduce(
      (sum, item) => sum + item["AvgBaseVolume(Piece)"],
      0
    );
    const totalPredictedVolume = items.reduce(
      (sum, item) => sum + item["predicted volume per week"],
      0
    );
    const totalUplifts = items.reduce(
      (sum, item) => sum + item["uplifts vs base"],
      0
    );

    return {
      totalPacks,
      totalPieces,
      totalPredictedVolume,
      totalUplifts,
    };
  };

  return {
    groupedData,
    expandedGroups,
    expandedSubGroups,
    toggleGroup,
    toggleSubGroup,
    calculateAggregates,
  };
};
