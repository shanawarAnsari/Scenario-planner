import { useState } from "react";

export interface ColumnGroup {
  name: string;
  columns: string[];
}

export const useColumnVisibility = () => {
  // Define column groups
  const columnGroups: ColumnGroup[] = [
    {
      name: "Price",
      columns: ["ppk", "ppka", "deltaPpk"],
    },
    {
      name: "Volume",
      columns: ["vpk", "vpka", "deltaVpk"],
    },
    {
      name: "Revenue",
      columns: ["r", "ra", "deltaRev"],
    },
  ];

  const columnDisplayNames: Record<string, string> = {
    ppk: "Price Per Pack",
    ppka: "Price Per Pack After",
    deltaPpk: "Delta PPK",
    vpk: "Volume Per Pack",
    vpka: "Volume Per Pack After",
    deltaVpk: "Delta VPK",
    r: "Revenue",
    ra: "Revenue After",
    deltaRev: "Delta Rev",

    // Legacy column names kept for compatibility
    ppg: "PPG",
    pricePerPack: "Price Per Pack",
    pricePerPiece: "Price Per Piece",
    avgBaseVolumePacks: "Avg Base Volume (Packs)",
    avgBaseVolumePiece: "Avg Base Volume (Piece)",
    promoPrice: "Promo Price",
    retailersMargin: "Retailer's Margin",
    predictedVolume: "Predicted Volume",
    uplifts: "Uplifts",
  };

  const [visibleColumns, setVisibleColumns] = useState({
    // Price group
    ppk: true,
    ppka: true,
    deltaPpk: true,

    // Volume group
    vpk: true,
    vpka: true,
    deltaVpk: true,

    // Revenue group
    r: true,
    ra: true,
    deltaRev: true,

    // Legacy columns kept for compatibility
    ppg: true,
    pricePerPack: true,
    pricePerPiece: true,
    avgBaseVolumePacks: true,
    avgBaseVolumePiece: true,
    promoPrice: true,
    retailersMargin: true,
    predictedVolume: true,
    uplifts: true,
  });

  const toggleColumnVisibility = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const toggleColumnGroupVisibility = (groupName: string) => {
    const group = columnGroups.find((g) => g.name === groupName);
    if (!group) return;

    const allColumnsInGroup = group.columns;
    const areAllVisible = allColumnsInGroup.every(
      (col) => visibleColumns[col as keyof typeof visibleColumns]
    );

    const newState = !areAllVisible;

    setVisibleColumns((prev) => {
      const updated = { ...prev };
      allColumnsInGroup.forEach((col) => {
        updated[col as keyof typeof visibleColumns] = newState;
      });
      return updated;
    });
  };

  const setColumnVisibility = (
    column: keyof typeof visibleColumns,
    isVisible: boolean
  ) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: isVisible,
    }));
  };

  return {
    visibleColumns,
    toggleColumnVisibility,
    setColumnVisibility,
    columnDisplayNames,
    columnGroups,
    toggleColumnGroupVisibility,
  };
};
