import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import mockData from "../mockData";
import "./TableView.css";

// Common styles
const headerCellStyles = {
  backgroundColor: "#1976d2", // MUI blue
  color: "white",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const bodyCellStyles = {
  whiteSpace: "nowrap",
  padding: "6px 8px",
  fontSize: "0.9rem",
  color: "#555",
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

const TableView = () => {
  const [groupBy, setGroupBy] = useState("brd"); // Default grouping by Brand
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedSubGroups, setExpandedSubGroups] = useState<
    Record<string, boolean>
  >({});

  const handleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupBy(event.target.value);
    setExpandedGroups({});
    setExpandedSubGroups({});
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const toggleSubGroup = (subGroup: string) => {
    setExpandedSubGroups((prev) => ({ ...prev, [subGroup]: !prev[subGroup] }));
  };

  const groupedData =
    groupBy === "brd"
      ? mockData.reduce((acc, item) => {
          if (!acc[item.brd]) acc[item.brd] = {};
          if (!acc[item.brd][item.subBrd]) acc[item.brd][item.subBrd] = [];
          acc[item.brd][item.subBrd].push(item);
          return acc;
        }, {} as Record<string, Record<string, MockDataItem[]>>)
      : groupBy === "subBrd"
      ? mockData.reduce((acc, item) => {
          if (!acc[item.subBrd]) acc[item.subBrd] = [];
          acc[item.subBrd].push(item);
          return acc;
        }, {} as Record<string, MockDataItem[]>)
      : {};

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
      {groupBy !== "ppg" && (
        <TableCell sx={{ ...bodyCellStyles }} colSpan={level}></TableCell>
      )}
      <TableCell sx={{ ...bodyCellStyles }}>{item.ppg}</TableCell>
      <TableCell sx={{ ...bodyCellStyles }}>{item.priceperpack}</TableCell>
      <TableCell sx={{ ...bodyCellStyles }}>{item.priceperpiece}</TableCell>
      <TableCell sx={{ ...bodyCellStyles }}>
        {item["AvgBaseVolume(Packs)"]}
      </TableCell>
      <TableCell sx={{ ...bodyCellStyles }}>
        {item["AvgBaseVolume(Piece)"]}
      </TableCell>
      <TableCell sx={{ ...bodyCellStyles }}>{item.PromoPeriod}</TableCell>
      <TableCell sx={{ ...bodyCellStyles }}>{item.PromoPrice}</TableCell>
      <TableCell sx={{ ...bodyCellStyles }}>{item.RetailersMargin}</TableCell>
      <TableCell sx={{ ...bodyCellStyles }}>
        {item["predicted volume per week"]}
      </TableCell>
      <TableCell sx={{ ...bodyCellStyles }}>{item["uplifts vs base"]}</TableCell>
    </TableRow>
  );

  return (
    <Box className="table-view-container">
      <Typography variant="h5" className="table-title">
        Scenario Planner Table
      </Typography>
      <TextField
        select
        label="Group By"
        value={groupBy}
        onChange={handleGroupChange}
        variant="outlined"
        className="group-by-dropdown"
        size="small"
      >
        <MenuItem value="brd">Brand</MenuItem>
        <MenuItem value="subBrd">SubBrand</MenuItem>
        <MenuItem value="ppg">PPG</MenuItem>
      </TextField>

      <TableContainer component={Paper} className="table-container">
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {groupBy !== "ppg" && (
                <TableCell
                  sx={{ ...headerCellStyles }}
                  colSpan={groupBy === "subBrd" ? 1 : 2}
                ></TableCell>
              )}
              <TableCell sx={{ ...headerCellStyles }}>PPG</TableCell>
              <TableCell sx={{ ...headerCellStyles }}>Price Per Pack</TableCell>
              <TableCell sx={{ ...headerCellStyles }}>Price Per Piece</TableCell>
              <TableCell sx={{ ...headerCellStyles }}>
                AvgBaseVolume (Packs)
              </TableCell>
              <TableCell sx={{ ...headerCellStyles }}>
                AvgBaseVolume (Piece)
              </TableCell>
              <TableCell sx={{ ...headerCellStyles }}>Promo Period</TableCell>
              <TableCell sx={{ ...headerCellStyles }}>Promo Price</TableCell>
              <TableCell sx={{ ...headerCellStyles }}>Retailers Margin</TableCell>
              <TableCell sx={{ ...headerCellStyles }}>
                Predicted Volume/Week
              </TableCell>
              <TableCell sx={{ ...headerCellStyles }}>Uplifts vs Base</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupBy === "ppg"
              ? mockData.map((item) => renderRow(item, 0))
              : groupBy === "subBrd"
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
                        <TableCell sx={{ ...bodyCellStyles }}>
                          <Typography
                            sx={{ fontSize: "12px" }}
                            color="textSecondary"
                          >
                            ({items.length})
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ ...bodyCellStyles }}>
                          {/* Empty for Price Per Pack */}
                        </TableCell>
                        <TableCell sx={{ ...bodyCellStyles }}>
                          {/* Empty for Price Per Piece */}
                        </TableCell>
                        <TableCell sx={{ ...bodyCellStyles }}>
                          {aggregates.totalPacks}
                        </TableCell>
                        <TableCell sx={{ ...bodyCellStyles }}>
                          {aggregates.totalPieces}
                        </TableCell>
                        <TableCell sx={{ ...bodyCellStyles }}>
                          {/* Empty for Promo Period */}
                        </TableCell>
                        <TableCell sx={{ ...bodyCellStyles }}>
                          {/* Empty for Promo Price */}
                        </TableCell>
                        <TableCell sx={{ ...bodyCellStyles }}>
                          {/* Empty for Retailers Margin */}
                        </TableCell>
                        <TableCell sx={{ ...bodyCellStyles }}>
                          {aggregates.totalPredictedVolume}
                        </TableCell>
                        <TableCell sx={{ ...bodyCellStyles }}>
                          {aggregates.totalUplifts}
                        </TableCell>
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
                              <TableCell sx={{ ...bodyCellStyles }}>
                                <Typography
                                  sx={{ fontSize: "12px" }}
                                  color="textSecondary"
                                >
                                  ({items.length})
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ ...bodyCellStyles }}>
                                {/* Empty for Price Per Pack */}
                              </TableCell>
                              <TableCell sx={{ ...bodyCellStyles }}>
                                {/* Empty for Price Per Piece */}
                              </TableCell>
                              <TableCell sx={{ ...bodyCellStyles }}>
                                {aggregates.totalPacks}
                              </TableCell>
                              <TableCell sx={{ ...bodyCellStyles }}>
                                {aggregates.totalPieces}
                              </TableCell>
                              <TableCell sx={{ ...bodyCellStyles }}>
                                {/* Empty for Promo Period */}
                              </TableCell>
                              <TableCell sx={{ ...bodyCellStyles }}>
                                {/* Empty for Promo Price */}
                              </TableCell>
                              <TableCell sx={{ ...bodyCellStyles }}>
                                {/* Empty for Retailers Margin */}
                              </TableCell>
                              <TableCell sx={{ ...bodyCellStyles }}>
                                {aggregates.totalPredictedVolume}
                              </TableCell>
                              <TableCell sx={{ ...bodyCellStyles }}>
                                {aggregates.totalUplifts}
                              </TableCell>
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
