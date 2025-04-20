import {
  Box,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import React from "react";
import TableView from "./Planner/TableView";

const ScenarioPlanner: React.FC = () => {
  const theme = useTheme();
  const [level, setLevel] = React.useState<"Brand" | "SubBrand" | "PPG" | "OSKU">(
    "SubBrand"
  );

  return (
    <>
      <Box>
        <FormControl className="group-by-dropdown" size="small">
          <InputLabel id="level-select-label">Group By</InputLabel>
          <Select
            labelId="level-select-label"
            value={level}
            label="Group By"
            onChange={(e) => setLevel(e.target.value as any)}
          >
            <MenuItem value="Brand">Brand</MenuItem>
            <MenuItem value="SubBrand">SubBrand</MenuItem>
            <MenuItem value="PPG">PPG</MenuItem>
            <MenuItem value="OSKU">OSKU</MenuItem>
          </Select>
        </FormControl>
        <TableView level={level} />
      </Box>
    </>
  );
};

export default ScenarioPlanner;
