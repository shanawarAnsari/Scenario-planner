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
import { useColumnVisibility } from "./hooks/useColumnVisibility";
import ColumnVisibilityControls from "./components/ColumnVisibilityControls";
import mockData from "../mockData";
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

interface TableViewProps {
  level: "Brand" | "SubBrand" | "PPG" | "OSKU";
}

// Updated grouping and rendering logic to strictly follow the hierarchy for each selected level
const TableView: React.FC<TableViewProps> = ({ level }) => {
  const {
    groupedData,
    expandedGroups,
    expandedSubGroups,
    toggleGroup,
    toggleSubGroup,
  } = useTableData(level);

  const { visibleColumns, toggleColumnVisibility, columnDisplayNames } =
    useColumnVisibility();

  const renderRow = (item: MockDataItem, level: number) => (
    <TableRow key={item.pid} className="table-row">
      {level !== 0 && (
        <TableCell sx={{ ...bodyCellStyles }} colSpan={level}></TableCell>
      )}
      {visibleColumns.ppg && (
        <TableCell sx={{ ...bodyCellStyles, textAlign: "left" }}>
          {item.ppg}
        </TableCell>
      )}
      {visibleColumns.pricePerPack && (
        <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
          £{item.priceperpack}
        </TableCell>
      )}
      {visibleColumns.pricePerPiece && (
        <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
          £{item.priceperpiece}
        </TableCell>
      )}
      {visibleColumns.avgBaseVolumePacks && (
        <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
          {item["AvgBaseVolume(Packs)"]}
        </TableCell>
      )}
      {visibleColumns.avgBaseVolumePiece && (
        <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
          {item["AvgBaseVolume(Piece)"]}
        </TableCell>
      )}
      {visibleColumns.promoPrice && (
        <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
          £{item.PromoPrice}
        </TableCell>
      )}
      {visibleColumns.retailersMargin && (
        <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
          {item.RetailersMargin}%
        </TableCell>
      )}
      {visibleColumns.predictedVolume && (
        <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
          {item["predicted volume per week"]}
        </TableCell>
      )}
      {visibleColumns.uplifts && (
        <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
          {item["uplifts vs base"]}
        </TableCell>
      )}
    </TableRow>
  );

  const renderGroupedData = () => {
    switch (level) {
      case "Brand":
        return Object.entries(groupedData).map(([brand, subGroups]) => (
          <React.Fragment key={brand}>
            <TableRow className="group-row">
              <TableCell colSpan={12} className="group-header">
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
                      colSpan={2}
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
                            {ppg}
                          </TableCell>
                        </TableRow>
                        {(items as MockDataItem[]).map((item) => renderRow(item, 3))}
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
                colSpan={2}
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
                      {ppg}
                    </TableCell>
                  </TableRow>
                  {(items as MockDataItem[]).map((item) => renderRow(item, 2))}
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
                {ppg}
              </TableCell>
            </TableRow>
            {(items as MockDataItem[]).map((item) => renderRow(item, 1))}
          </React.Fragment>
        ));
      case "OSKU":
        return (groupedData as MockDataItem[]).map((item) => renderRow(item, 0));
      default:
        return null;
    }
  };

  return (
    <Box className="table-view-container">
      <Typography variant="h5" className="table-title">
        Scenario Planner Table
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <ColumnVisibilityControls
          visibleColumns={visibleColumns}
          toggleColumnVisibility={toggleColumnVisibility}
          columnDisplayNames={columnDisplayNames}
        />
      </Box>
      <TableContainer component={Paper} className="table-container">
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {level !== "PPG" && (
                <TableCell
                  sx={{
                    ...headerCellStyles,
                    padding: "6px 8px",
                  }}
                  colSpan={level === "SubBrand" ? 1 : 2}
                ></TableCell>
              )}
              {visibleColumns.ppg && (
                <TableCell sx={{ ...headerCellStyles, textAlign: "left" }}>
                  PPG
                </TableCell>
              )}
              {visibleColumns.pricePerPack && (
                <TableCell sx={{ ...headerCellStyles, textAlign: "right" }}>
                  Price Per Pack
                </TableCell>
              )}
              {visibleColumns.pricePerPiece && (
                <TableCell sx={{ ...headerCellStyles, textAlign: "right" }}>
                  Price Per Piece
                </TableCell>
              )}
              {visibleColumns.avgBaseVolumePacks && (
                <TableCell sx={{ ...headerCellStyles, textAlign: "right" }}>
                  AvgBaseVolume (Packs)
                </TableCell>
              )}
              {visibleColumns.avgBaseVolumePiece && (
                <TableCell sx={{ ...headerCellStyles, textAlign: "right" }}>
                  AvgBaseVolume (Piece)
                </TableCell>
              )}
              {visibleColumns.promoPrice && (
                <TableCell sx={{ ...headerCellStyles, textAlign: "right" }}>
                  Promo Price
                </TableCell>
              )}
              {visibleColumns.retailersMargin && (
                <TableCell sx={{ ...headerCellStyles, textAlign: "right" }}>
                  Retailers Margin
                </TableCell>
              )}
              {visibleColumns.predictedVolume && (
                <TableCell sx={{ ...headerCellStyles, textAlign: "right" }}>
                  Predicted Volume/Week
                </TableCell>
              )}
              {visibleColumns.uplifts && (
                <TableCell sx={{ ...headerCellStyles, textAlign: "right" }}>
                  Uplifts vs Base
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>{renderGroupedData()}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableView;
