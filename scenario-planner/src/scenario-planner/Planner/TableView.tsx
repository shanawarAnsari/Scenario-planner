import React, { useState } from "react";
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
  level: "Brand" | "SubBrand" | "PPG";
}

const TableView: React.FC<TableViewProps> = ({ level }) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedSubGroups, setExpandedSubGroups] = useState<
    Record<string, boolean>
  >({});
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
          marginBottom: "8px",
          borderBottom: "1px solid #ddd",
          paddingBottom: "8px",
        }}
      >
        <Box
          sx={{
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
              onClick={() =>
                toggleColumnVisibility(column as keyof typeof visibleColumns)
              }
              style={{
                border: "none",
                background: visibleColumns[column as keyof typeof visibleColumns]
                  ? "#1976d2"
                  : "#e0e0e0",
                color: visibleColumns[column as keyof typeof visibleColumns]
                  ? "#fff"
                  : "#000",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              {column}
            </button>
          ))}
        </Box>
      </Box>
      <TableContainer component={Paper} className="table-container">
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {level !== "PPG" && (
                <TableCell
                  sx={{
                    ...headerCellStyles,
                    padding: "6px 8px", // Adjusted padding to remove gaps
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
          <TableBody>
            {level === "PPG"
              ? (groupedData as MockDataItem[]).map((item) => renderRow(item, 0))
              : level === "SubBrand"
              ? Object.entries(groupedData).map(([subGroup, items]) => {
                  const aggregates = calculateAggregates(items as MockDataItem[]);
                  return (
                    <React.Fragment key={subGroup}>
                      <TableRow className="group-row">
                        <TableCell
                          colSpan={1}
                          className="group-header"
                          style={{ paddingLeft: "16px" }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => toggleGroup(subGroup)}
                          >
                            {expandedGroups[subGroup] ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                          {subGroup}
                        </TableCell>
                        {visibleColumns.ppg && (
                          <TableCell sx={{ ...bodyCellStyles, textAlign: "left" }}>
                            <Box
                              display={"flex"}
                              flexDirection={"row"}
                              justifyContent={"space-between"}
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                color="textSecondary"
                              >
                                Total
                              </Typography>
                              <Typography
                                sx={{ fontSize: "12px" }}
                                color="textSecondary"
                              >
                                ({items.length})
                              </Typography>
                            </Box>
                          </TableCell>
                        )}
                        {visibleColumns.pricePerPack && (
                          <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
                            {/* Empty for Price Per Pack */}
                          </TableCell>
                        )}
                        {visibleColumns.pricePerPiece && (
                          <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
                            {/* Empty for Price Per Piece */}
                          </TableCell>
                        )}
                        {visibleColumns.avgBaseVolumePacks && (
                          <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
                            {aggregates.totalPacks}
                          </TableCell>
                        )}
                        {visibleColumns.avgBaseVolumePiece && (
                          <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
                            {aggregates.totalPieces}
                          </TableCell>
                        )}
                        {visibleColumns.promoPrice && (
                          <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
                            {/* Empty for Promo Price */}
                          </TableCell>
                        )}
                        {visibleColumns.retailersMargin && (
                          <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
                            {/* Empty for Retailers Margin */}
                          </TableCell>
                        )}
                        {visibleColumns.predictedVolume && (
                          <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
                            {aggregates.totalPredictedVolume}
                          </TableCell>
                        )}
                        {visibleColumns.uplifts && (
                          <TableCell sx={{ ...bodyCellStyles, textAlign: "right" }}>
                            {aggregates.totalUplifts}
                          </TableCell>
                        )}
                      </TableRow>
                      {expandedGroups[subGroup] &&
                        (items as MockDataItem[]).map((item) => renderRow(item, 1))}
                    </React.Fragment>
                  );
                })
              : Object.entries(groupedData).map(([brand, subGroups]) => (
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
                        subGroups as Record<string, MockDataItem[]>
                      ).map(([subGroup, items]) => {
                        const aggregates = calculateAggregates(
                          items as MockDataItem[]
                        );
                        return (
                          <React.Fragment key={subGroup}>
                            <TableRow className="subgroup-row">
                              <TableCell
                                colSpan={2} // Adjusted colSpan to align with the Brand level
                                className="subgroup-header"
                                style={{ paddingLeft: "32px" }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => toggleSubGroup(subGroup)}
                                >
                                  {expandedSubGroups[subGroup] ? (
                                    <ExpandLess />
                                  ) : (
                                    <ExpandMore />
                                  )}
                                </IconButton>
                                {subGroup}
                              </TableCell>
                              {visibleColumns.ppg && (
                                <TableCell
                                  sx={{ ...bodyCellStyles, textAlign: "left" }}
                                >
                                  <Typography
                                    sx={{ fontSize: "12px" }}
                                    color="textSecondary"
                                  >
                                    ({items.length})
                                  </Typography>
                                </TableCell>
                              )}
                              {visibleColumns.pricePerPack && (
                                <TableCell
                                  sx={{ ...bodyCellStyles, textAlign: "right" }}
                                >
                                  {/* Empty for Price Per Pack */}
                                </TableCell>
                              )}
                              {visibleColumns.pricePerPiece && (
                                <TableCell
                                  sx={{ ...bodyCellStyles, textAlign: "right" }}
                                >
                                  {/* Empty for Price Per Piece */}
                                </TableCell>
                              )}
                              {visibleColumns.avgBaseVolumePacks && (
                                <TableCell
                                  sx={{ ...bodyCellStyles, textAlign: "right" }}
                                >
                                  {aggregates.totalPacks}
                                </TableCell>
                              )}
                              {visibleColumns.avgBaseVolumePiece && (
                                <TableCell
                                  sx={{ ...bodyCellStyles, textAlign: "right" }}
                                >
                                  {aggregates.totalPieces}
                                </TableCell>
                              )}
                              {visibleColumns.promoPrice && (
                                <TableCell
                                  sx={{ ...bodyCellStyles, textAlign: "right" }}
                                >
                                  {/* Empty for Promo Price */}
                                </TableCell>
                              )}
                              {visibleColumns.retailersMargin && (
                                <TableCell
                                  sx={{ ...bodyCellStyles, textAlign: "right" }}
                                >
                                  {/* Empty for Retailers Margin */}
                                </TableCell>
                              )}
                              {visibleColumns.predictedVolume && (
                                <TableCell
                                  sx={{ ...bodyCellStyles, textAlign: "right" }}
                                >
                                  {aggregates.totalPredictedVolume}
                                </TableCell>
                              )}
                              {visibleColumns.uplifts && (
                                <TableCell
                                  sx={{ ...bodyCellStyles, textAlign: "right" }}
                                >
                                  {aggregates.totalUplifts}
                                </TableCell>
                              )}
                            </TableRow>
                            {expandedSubGroups[subGroup] &&
                              (items as MockDataItem[]).map((item) =>
                                renderRow(item, 2)
                              )}
                          </React.Fragment>
                        );
                      })}
                  </React.Fragment>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableView;
