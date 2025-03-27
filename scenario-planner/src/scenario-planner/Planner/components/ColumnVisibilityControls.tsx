import React from "react";

interface ColumnVisibilityControlsProps {
  visibleColumns: Record<string, boolean>;
  toggleColumnVisibility: (column: any) => void;
}

const ColumnVisibilityControls: React.FC<ColumnVisibilityControlsProps> = ({
  visibleColumns,
  toggleColumnVisibility,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        backgroundColor: "#fff",
        borderRadius: "4px",
        padding: "4px 8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      {Object.keys(visibleColumns).map((column) => (
        <button
          key={column}
          onClick={() => toggleColumnVisibility(column)}
          style={{
            border: "none",
            background: visibleColumns[column] ? "#1976d2" : "#e0e0e0",
            color: visibleColumns[column] ? "#fff" : "#000",
            padding: "4px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          {column}
        </button>
      ))}
    </div>
  );
};

export default ColumnVisibilityControls;
