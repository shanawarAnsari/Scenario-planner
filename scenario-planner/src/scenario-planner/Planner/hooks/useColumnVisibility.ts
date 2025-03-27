import { useState } from "react";

export const useColumnVisibility = () => {
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

  return { visibleColumns, toggleColumnVisibility };
};
