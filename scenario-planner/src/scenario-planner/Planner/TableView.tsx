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
  Tooltip,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  UnfoldMore,
  UnfoldLess,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import {
  useTableData,
  ResultsDataItem,
  GroupLevel,
  GroupedByBrand,
  GroupedBySubBrand,
  GroupedByPPG,
  GroupedByOSKU,
} from "./hooks/useTableData";
import "./ResultsTableView.css";

// Props interface
interface TableViewProps {
  level: GroupLevel;
}

// Helper function to sort items by promo type
const sortByPromoType = (items: ResultsDataItem[]): ResultsDataItem[] => {
  const promoOrder: Record<string, number> = {
    "No Promo": 1,
    Display: 2,
    Feature: 3,
    Discount: 4,
  };

  return [...items].sort((a, b) => {
    const orderA = promoOrder[a.promoType] || 999;
    const orderB = promoOrder[b.promoType] || 999;
    return orderA - orderB;
  });
};

// Format delta values to show + sign for positive values and include colored trend arrows
const formatDeltaValue = (value: number, showPercentage = false) => {
  const formattedValue = showPercentage
    ? `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
    : `${value > 0 ? "+" : ""}${value.toFixed(2)}`;

  const arrowClass = value > 0 ? "trend-up" : value < 0 ? "trend-down" : "";
  const textClass =
    value > 0
      ? "delta-text-positive"
      : value < 0
      ? "delta-text-negative"
      : "delta-text-neutral";

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {value > 0 ? (
        <ArrowUpward fontSize="small" className={arrowClass} sx={{ mr: 0.5 }} />
      ) : value < 0 ? (
        <ArrowDownward fontSize="small" className={arrowClass} sx={{ mr: 0.5 }} />
      ) : null}
      <span className={textClass}>{formattedValue}</span>
    </Box>
  );
};

const DataRow: React.FC<{
  item: ResultsDataItem;
  indentLevel: number;
  showPromoType?: boolean;
}> = ({ item, indentLevel, showPromoType = true }) => {
  // For DataRow, always indent one level more than the grouping row
  const dataIndentClass = `data-indent-${indentLevel}`;

  return (
    <TableRow key={item.pid} className="data-row">
      <TableCell className={dataIndentClass}>
        {showPromoType && <span>{item.promoType}</span>}
        {!showPromoType && item.osku}
      </TableCell>
      <TableCell>{item.ppk.toFixed(2)}</TableCell>
      <TableCell>{item.ppka.toFixed(2)}</TableCell>
      <TableCell>{formatDeltaValue(item.deltaPpk)}</TableCell>
      <TableCell>{item.vpk.toLocaleString()}</TableCell>
      <TableCell>{item.vpka.toLocaleString()}</TableCell>
      <TableCell>{formatDeltaValue(item.deltaVpk, true)}</TableCell>
      <TableCell>
        {item.r.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </TableCell>
      <TableCell>
        {item.ra.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </TableCell>
      <TableCell>{formatDeltaValue(item.deltaRev, true)}</TableCell>
      <TableCell>
        {item.pb.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </TableCell>
      <TableCell>
        {item.pa.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </TableCell>
      <TableCell>{formatDeltaValue(item.pd, true)}</TableCell>
    </TableRow>
  );
};

// Group row components
const GroupRow: React.FC<{
  id: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  indentLevel: number;
}> = ({ id, isExpanded, onToggle, indentLevel }) => {
  const groupIndentClass = `group-indent-${indentLevel}`;

  return (
    <TableRow className="group-row">
      <TableCell colSpan={13} className={groupIndentClass}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton size="small" onClick={() => onToggle(id)}>
            {isExpanded ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </IconButton>
          <Typography variant="body2" component="span" sx={{ ml: 1 }}>
            {id}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

// Table header component
const TableHeader: React.FC<{
  allExpanded: boolean;
  toggleAllGroups: () => void;
}> = ({ allExpanded, toggleAllGroups }) => (
  <TableHead>
    <TableRow>
      <TableCell rowSpan={3}>
        <Box>
          <Tooltip title={allExpanded ? "Collapse All" : "Expand All"}>
            <IconButton size="small" onClick={toggleAllGroups}>
              {allExpanded ? <UnfoldLess /> : <UnfoldMore />}
            </IconButton>
          </Tooltip>
          <span style={{ marginLeft: "12px" }}>Product</span>
        </Box>
      </TableCell>
      <TableCell colSpan={3}>Price (£)</TableCell>
      <TableCell colSpan={3}>Volume</TableCell>
      <TableCell colSpan={3}>Revenue (£)</TableCell>
      <TableCell colSpan={3}>Profits (£)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Price</TableCell>
      <TableCell>New Price</TableCell>
      <TableCell>△</TableCell>
      <TableCell>Volume</TableCell>
      <TableCell>New Volume</TableCell>
      <TableCell>△ %</TableCell>
      <TableCell>Revenue</TableCell>
      <TableCell>New Revenue</TableCell>
      <TableCell>△ %</TableCell>
      <TableCell>Profit</TableCell>
      <TableCell>New Profit</TableCell>
      <TableCell>△ %</TableCell>
    </TableRow>
  </TableHead>
);

// Main TableView component
const TableView: React.FC<TableViewProps> = ({ level }) => {
  const { groupedData, expansionState, toggleExpansion, expandAll, collapseAll } =
    useTableData(level);

  const [allExpanded, setAllExpanded] = useState(false);
  const totals = {
    avgPpk: 10.5,
    avgPpka: 11.0,
    deltaPpk: 4.76, // Calculated as ((11.00 - 10.50) / 10.50) * 100
    totalVpk: 150000,
    totalVpka: 155000,
    deltaVpk: 3.33, // Calculated as ((155000 - 150000) / 150000) * 100
    totalRev: 1575000,
    totalRevA: 1705000,
    deltaRev: 8.25, // Calculated as ((1705000 - 1575000) / 1575000) * 100
    totalProfit: 300000,
    totalProfitA: 315000,
    deltaProfit: 5.0, // Calculated as ((315000 - 300000) / 300000) * 100
  };

  // Toggle all groups function
  const toggleAllGroups = () => {
    setAllExpanded(!allExpanded);

    if (allExpanded) {
      collapseAll();
    } else {
      expandAll();
    }
  };

  // Render functions for each level
  const renderBrandLevel = () => {
    const data = groupedData as GroupedByBrand;
    return Object.entries(data).map(([brand, subGroups]) => (
      <React.Fragment key={brand}>
        <GroupRow
          id={brand}
          isExpanded={!!expansionState[brand]}
          onToggle={toggleExpansion}
          indentLevel={0}
        />
        {expansionState[brand] &&
          Object.entries(subGroups).map(([subBrand, ppgGroups]) => (
            <React.Fragment key={subBrand}>
              <GroupRow
                id={subBrand}
                isExpanded={!!expansionState[subBrand]}
                onToggle={toggleExpansion}
                indentLevel={1}
              />
              {expansionState[subBrand] &&
                Object.entries(ppgGroups).map(([ppg, oskuGroups]) => (
                  <React.Fragment key={ppg}>
                    <GroupRow
                      id={ppg}
                      isExpanded={!!expansionState[ppg]}
                      onToggle={toggleExpansion}
                      indentLevel={2}
                    />
                    {expansionState[ppg] &&
                      typeof oskuGroups === "object" &&
                      !Array.isArray(oskuGroups) &&
                      Object.entries(oskuGroups).map(([osku, items]) => (
                        <React.Fragment key={osku}>
                          <GroupRow
                            id={osku}
                            isExpanded={!!expansionState[osku]}
                            onToggle={toggleExpansion}
                            indentLevel={3}
                          />
                          {expansionState[osku] &&
                            sortByPromoType(items).map((item) => (
                              <DataRow key={item.pid} item={item} indentLevel={4} />
                            ))}
                        </React.Fragment>
                      ))}
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
      </React.Fragment>
    ));
  };

  const renderSubBrandLevel = () => {
    const data = groupedData as GroupedBySubBrand;
    return Object.entries(data).map(([subBrand, ppgGroups]) => (
      <React.Fragment key={subBrand}>
        <GroupRow
          id={subBrand}
          isExpanded={!!expansionState[subBrand]}
          onToggle={toggleExpansion}
          indentLevel={0}
        />
        {expansionState[subBrand] &&
          Object.entries(ppgGroups).map(([ppg, oskuGroups]) => (
            <React.Fragment key={ppg}>
              <GroupRow
                id={ppg}
                isExpanded={!!expansionState[ppg]}
                onToggle={toggleExpansion}
                indentLevel={1}
              />
              {expansionState[ppg] &&
                typeof oskuGroups === "object" &&
                !Array.isArray(oskuGroups) &&
                Object.entries(oskuGroups).map(([osku, items]) => (
                  <React.Fragment key={osku}>
                    <GroupRow
                      id={osku}
                      isExpanded={!!expansionState[osku]}
                      onToggle={toggleExpansion}
                      indentLevel={2}
                    />
                    {expansionState[osku] &&
                      sortByPromoType(items).map((item) => (
                        <DataRow key={item.pid} item={item} indentLevel={3} />
                      ))}
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
      </React.Fragment>
    ));
  };

  const renderPPGLevel = () => {
    const data = groupedData as GroupedByPPG;
    return Object.entries(data).map(([ppg, oskuGroups]) => (
      <React.Fragment key={ppg}>
        <GroupRow
          id={ppg}
          isExpanded={!!expansionState[ppg]}
          onToggle={toggleExpansion}
          indentLevel={0}
        />
        {expansionState[ppg] &&
          typeof oskuGroups === "object" &&
          !Array.isArray(oskuGroups) &&
          Object.entries(oskuGroups).map(([osku, items]) => (
            <React.Fragment key={osku}>
              <GroupRow
                id={osku}
                isExpanded={!!expansionState[osku]}
                onToggle={toggleExpansion}
                indentLevel={1}
              />
              {expansionState[osku] &&
                sortByPromoType(items).map((item) => (
                  <DataRow key={item.pid} item={item} indentLevel={2} />
                ))}
            </React.Fragment>
          ))}
      </React.Fragment>
    ));
  };

  const renderOSKULevel = () => {
    const data = groupedData as GroupedByOSKU;
    return Object.entries(data).map(([osku, items]) => (
      <React.Fragment key={osku}>
        <GroupRow
          id={osku}
          isExpanded={!!expansionState[osku]}
          onToggle={toggleExpansion}
          indentLevel={0}
        />
        {expansionState[osku] &&
          sortByPromoType(items).map((item) => (
            <DataRow key={item.pid} item={item} indentLevel={1} />
          ))}
      </React.Fragment>
    ));
  };

  // Main render function
  const renderGroupedData = () => {
    switch (level) {
      case "Brand":
        return renderBrandLevel();
      case "SubBrand":
        return renderSubBrandLevel();
      case "PPG":
        return renderPPGLevel();
      case "OSKU":
        return renderOSKULevel();
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, color: "#2a3142", fontWeight: 700 }}>
        Scenario Planner Table
      </Typography>
      <TableContainer component={Paper} className="table-container">
        <Table stickyHeader size="small" className="scenario-table">
          <TableHeader allExpanded={allExpanded} toggleAllGroups={toggleAllGroups} />
          <TableBody>
            {/* Total row at the top of the table - Using hardcoded values */}
            <TableRow className="total-row">
              <TableCell align={"right"} colSpan={1}>
                <Typography variant="subtitle1" sx={{ fontSize: "0.9rem" }}>
                  Total
                </Typography>
              </TableCell>
              <TableCell>
                <span>{totals.avgPpk.toFixed(2)}</span>
              </TableCell>
              <TableCell>
                <span>{totals.avgPpka.toFixed(2)}</span>
              </TableCell>
              <TableCell>{formatDeltaValue(totals.deltaPpk)}</TableCell>
              <TableCell>
                <span>{totals.totalVpk.toLocaleString()}</span>
              </TableCell>
              <TableCell>
                <span>{totals.totalVpka.toLocaleString()}</span>
              </TableCell>
              <TableCell>{formatDeltaValue(totals.deltaVpk, true)}</TableCell>
              <TableCell>
                <span>
                  {totals.totalRev.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </TableCell>
              <TableCell>
                <span>
                  {totals.totalRevA.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </TableCell>
              <TableCell>{formatDeltaValue(totals.deltaRev, true)}</TableCell>
              <TableCell>
                <span>
                  {totals.totalProfit.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </TableCell>
              <TableCell>
                <span>
                  {totals.totalProfitA.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </TableCell>
              <TableCell>{formatDeltaValue(totals.deltaProfit, true)}</TableCell>
            </TableRow>

            {/* Grouped data rows */}
            {renderGroupedData()}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableView;
