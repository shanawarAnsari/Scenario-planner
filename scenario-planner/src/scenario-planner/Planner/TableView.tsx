import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useTableData } from "./hooks/useTableData";
import "./TableView.css";

// Common styles
const headerCellStyles = {
  backgroundColor: "#fff", // MUI blue
  color: "gray",
  fontWeight: "bold",
  fontSize: "0.8rem",
  whiteSpace: "nowrap",
};

const bodyCellStyles = {
  whiteSpace: "nowrap",
  padding: "6px 20px",
  fontSize: "0.9rem",
  color: "#555",
  borderRight: "1px solid #ddd",
  fontWeight: "600",
};

interface MockDataItem {
  osku: string;
  brd: string;
  subBrd: string;
  ppg: string;
  pid: string;
  ppk: number;
  vpk: number;
}

interface TableViewProps {
  level: "Brand" | "SubBrand" | "PPG" | "OSKU";
}

// Updated grouping and rendering logic to strictly follow the hierarchy for each selected level
const TableView: React.FC<TableViewProps> = ({ level }) => {
  const {
    groupedData,
    expandedGroups,
    expandedSubGroups,
    expandedPPGs,
    toggleGroup,
    toggleSubGroup,
    togglePPG,
  } = useTableData(level);

  const renderRow = (item: MockDataItem, indentLevel: number) => (
    <TableRow key={item.pid} className="table-row">
      <TableCell
        sx={{ ...bodyCellStyles, paddingLeft: `${indentLevel * 18 + 8}px` }}
      >
        {item.osku}
      </TableCell>
      <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
        £{item.ppk}
      </TableCell>
      <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
        {item.vpk}
      </TableCell>
    </TableRow>
  );

  const renderGroupedData = () => {
    switch (level) {
      case "Brand":
        return Object.entries(groupedData).map(([brand, subGroups]) => (
          <React.Fragment key={brand}>
            <TableRow className="group-row">
              <TableCell colSpan={3} className="group-header">
                <IconButton size="small" onClick={() => toggleGroup(brand)}>
                  {expandedGroups[brand] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                {brand}
              </TableCell>
            </TableRow>
            {expandedGroups[brand] &&
              Object.entries(
                subGroups as Record<string, Record<string, MockDataItem[]>>
              ).map(([subBrand, ppgGroups]) => (
                <React.Fragment key={subBrand}>
                  <TableRow className="subgroup-row">
                    <TableCell
                      colSpan={3}
                      className="subgroup-header"
                      style={{ paddingLeft: "32px" }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => toggleSubGroup(subBrand)}
                      >
                        {expandedSubGroups[subBrand] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                      {subBrand}
                    </TableCell>
                  </TableRow>
                  {expandedSubGroups[subBrand] &&
                    Object.entries(ppgGroups).map(([ppg, items]) => (
                      <React.Fragment key={ppg}>
                        <TableRow className="ppg-row">
                          <TableCell
                            colSpan={3}
                            className="ppg-header"
                            style={{ paddingLeft: "48px" }}
                          >
                            <IconButton size="small" onClick={() => togglePPG(ppg)}>
                              {expandedPPGs[ppg] ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                            {ppg}
                            <Typography
                              variant="caption"
                              component="span"
                              sx={{ marginLeft: 1, color: "gray" }}
                            >
                              ({(items as MockDataItem[]).length})
                            </Typography>
                          </TableCell>
                        </TableRow>
                        {expandedPPGs[ppg] &&
                          (items as MockDataItem[]).map((item) =>
                            renderRow(item, 3)
                          )}
                      </React.Fragment>
                    ))}
                </React.Fragment>
              ))}
          </React.Fragment>
        ));
      case "SubBrand":
        return Object.entries(groupedData).map(([subBrand, ppgGroups]) => (
          <React.Fragment key={subBrand}>
            <TableRow className="subgroup-row">
              <TableCell
                colSpan={3}
                className="subgroup-header"
                style={{ paddingLeft: "16px" }}
              >
                <IconButton size="small" onClick={() => toggleGroup(subBrand)}>
                  {expandedGroups[subBrand] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                {subBrand}
              </TableCell>
            </TableRow>
            {expandedGroups[subBrand] &&
              Object.entries(ppgGroups).map(([ppg, items]) => (
                <React.Fragment key={ppg}>
                  <TableRow className="ppg-row">
                    <TableCell
                      colSpan={3}
                      className="ppg-header"
                      style={{ paddingLeft: "32px" }}
                    >
                      <IconButton size="small" onClick={() => togglePPG(ppg)}>
                        {expandedPPGs[ppg] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                      {ppg}
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{ marginLeft: 1, color: "gray" }}
                      >
                        ({(items as MockDataItem[]).length})
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {expandedPPGs[ppg] &&
                    (items as MockDataItem[]).map((item) => renderRow(item, 2))}
                </React.Fragment>
              ))}
          </React.Fragment>
        ));
      case "PPG":
        return Object.entries(groupedData).map(([ppg, items]) => (
          <React.Fragment key={ppg}>
            <TableRow className="ppg-row">
              <TableCell
                colSpan={3}
                className="ppg-header"
                style={{ paddingLeft: "16px" }}
              >
                <IconButton size="small" onClick={() => togglePPG(ppg)}>
                  {expandedPPGs[ppg] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                {ppg}
                <Typography
                  variant="caption"
                  component="span"
                  sx={{ marginLeft: 1, color: "gray" }}
                >
                  ({(items as MockDataItem[]).length})
                </Typography>
              </TableCell>
            </TableRow>
            {expandedPPGs[ppg] &&
              (items as MockDataItem[]).map((item) => renderRow(item, 1))}
          </React.Fragment>
        ));
      case "OSKU":
        return (groupedData as any).map((item: any) => renderRow(item, 0));
      default:
        return null;
    }
  };

  return (
    <Box className="table-view-container">
      <Typography variant="h5" className="table-title">
        Scenario Planner Table
      </Typography>
      <TableContainer component={Paper} className="table-container">
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerCellStyles }}>Product</TableCell>
              <TableCell sx={{ ...headerCellStyles, textAlign: "right" }}>
                Price Per Pack
              </TableCell>
              <TableCell sx={{ ...headerCellStyles, textAlign: "right" }}>
                Average Volume Per Pack
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderGroupedData()}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableView;
