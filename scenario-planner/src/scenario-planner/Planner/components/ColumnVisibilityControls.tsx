import React from "react";
import { TextField, MenuItem, Checkbox, FormControlLabel } from "@mui/material";

interface ColumnVisibilityControlsProps {
  visibleColumns: Record<string, boolean>;
  toggleColumnVisibility: (column: any) => void;
  columnDisplayNames: Record<string, string>;
}

const ColumnVisibilityControls: React.FC<ColumnVisibilityControlsProps> = ({
  visibleColumns,
  toggleColumnVisibility,
  columnDisplayNames,
}) => {
  const selectedColumns = Object.keys(visibleColumns).filter(
    (column) => visibleColumns[column]
  );

  return (
    <TextField
      select
      label="Column Visibility"
      variant="outlined"
      fullWidth
      size="small"
      value={selectedColumns} // Pass the array of selected columns
      SelectProps={{
        multiple: true,
        renderValue: () =>
          `${selectedColumns.length} of ${
            Object.keys(visibleColumns).length
          } selected`, // Show selected count
      }}
      style={{ backgroundColor: "#fff", borderRadius: "4px", maxWidth: "180px" }}
    >
      {Object.keys(visibleColumns).map((column) => (
        <MenuItem key={column} value={column}>
          <FormControlLabel
            control={
              <Checkbox
                checked={visibleColumns[column]}
                onChange={() => toggleColumnVisibility(column)}
              />
            }
            label={columnDisplayNames[column] || column} // Use display name
          />
        </MenuItem>
      ))}
    </TextField>
  );
};

export default ColumnVisibilityControls;
