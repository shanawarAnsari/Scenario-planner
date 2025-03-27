import { useState } from "react";

export const useColumnVisibility = () => {
  const columnDisplayNames: Record<string, string> = {
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
  };
};
