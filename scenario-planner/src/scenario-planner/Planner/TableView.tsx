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

  const renderRow = (item: MockDataItem, level: number) => (
    <TableRow key={item.pid} className="table-row">
      <TableCell className="table-cell blank-cell" colSpan={level}></TableCell>
      <TableCell className="table-cell">{item.ppg}</TableCell>
      <TableCell className="table-cell">{item.priceperpack}</TableCell>
      <TableCell className="table-cell">{item.priceperpiece}</TableCell>
      <TableCell className="table-cell">{item["AvgBaseVolume(Packs)"]}</TableCell>
      <TableCell className="table-cell">{item["AvgBaseVolume(Piece)"]}</TableCell>
      <TableCell className="table-cell">{item.PromoPeriod}</TableCell>
      <TableCell className="table-cell">{item.PromoPrice}</TableCell>
      <TableCell className="table-cell">{item.RetailersMargin}</TableCell>
      <TableCell className="table-cell">
        {item["predicted volume per week"]}
      </TableCell>
      <TableCell className="table-cell">{item["uplifts vs base"]}</TableCell>
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
                  className="table-header blank-header"
                  colSpan={1}
                ></TableCell>
              )}
              <TableCell className="table-header">PPG</TableCell>
              <TableCell className="table-header">Price Per Pack</TableCell>
              <TableCell className="table-header">Price Per Piece</TableCell>
              <TableCell className="table-header">AvgBaseVolume (Packs)</TableCell>
              <TableCell className="table-header">AvgBaseVolume (Piece)</TableCell>
              <TableCell className="table-header">Promo Period</TableCell>
              <TableCell className="table-header">Promo Price</TableCell>
              <TableCell className="table-header">Retailers Margin</TableCell>
              <TableCell className="table-header">Predicted Volume/Week</TableCell>
              <TableCell className="table-header">Uplifts vs Base</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupBy === "ppg"
              ? mockData.map((item) => renderRow(item, 0))
              : groupBy === "subBrd"
              ? Object.entries(groupedData).map(([subGroup, items]) => (
                  <React.Fragment key={subGroup}>
                    <TableRow className="group-row">
                      <TableCell
                        colSpan={11}
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
                    </TableRow>
                    {expandedGroups[subGroup] &&
                      (items as MockDataItem[]).map((item) => renderRow(item, 1))}
                  </React.Fragment>
                ))
              : Object.entries(groupedData).map(([brand, subGroups]) => (
                  <React.Fragment key={brand}>
                    <TableRow className="group-row">
                      <TableCell colSpan={11} className="group-header">
                        <IconButton size="small" onClick={() => toggleGroup(brand)}>
                          {expandedGroups[brand] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                        {brand}
                      </TableCell>
                    </TableRow>
                    {expandedGroups[brand] &&
                      Object.entries(subGroups).map(([subGroup, items]) => (
                        <React.Fragment key={subGroup}>
                          <TableRow className="subgroup-row">
                            <TableCell
                              colSpan={11}
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
                          </TableRow>
                          {expandedSubGroups[subGroup] &&
                            (items as MockDataItem[]).map((item) =>
                              renderRow(item, 2)
                            )}
                        </React.Fragment>
                      ))}
                  </React.Fragment>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableView;
