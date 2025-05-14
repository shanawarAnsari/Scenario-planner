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
  Chip,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  UnfoldMore,
  UnfoldLess,
  ArrowUpward,
  ArrowDownward,
  StorefrontOutlined,
  LocalOfferOutlined,
  ExtensionOutlined,
  Settings,
  GetApp,
  Save,
} from "@mui/icons-material";
import {
  useResultsTableData,
  ResultsDataItem,
  GroupLevel,
  GroupedByBrand,
  GroupedBySubBrand,
  GroupedByPPG,
  GroupedByOSKU,
} from "./hooks/useResultsTableData";
import "./ResultsTableView.css";
import { mockData } from "../mockData_2";

// Props interface
interface ResultsTableViewProps {
  level: GroupLevel;
}

// Helper function to sort items by promo type
const sortByPromoType = (items: ResultsDataItem[]): ResultsDataItem[] => {
  const promoOrder: Record<string, number> = {
    "No Promo": 1,
    Display: 2,
    Feature: 3,
    Discount: 4,
    "Cross Impact": 5, // Added for new data structure
  };

  return [...items].sort((a, b) => {
    const orderA = promoOrder[a.promoType] || 999;
    const orderB = promoOrder[b.promoType] || 999;
    return orderA - orderB;
  });
};

// Helper function to calculate aggregated metrics for an OSKU
const calculateOskuAggregates = (items: ResultsDataItem[]) => {
  if (!items || items.length === 0) return null;

  // Calculate aggregated values
  const aggregates = items.reduce(
    (acc, item) => {
      // Sum up values
      acc.totalVpk += item.vpk;
      acc.totalVpka += item.vpka;
      acc.totalR += item.r;
      acc.totalRa += item.ra;
      acc.totalPb += item.pb;
      acc.totalPa += item.pa;

      return acc;
    },
    {
      totalVpk: 0,
      totalVpka: 0,
      totalR: 0,
      totalRa: 0,
      totalPb: 0,
      totalPa: 0,
    }
  );

  // Calculate deltas
  const deltaVpkPercent =
    aggregates.totalVpk !== 0
      ? ((aggregates.totalVpka - aggregates.totalVpk) /
          Math.abs(aggregates.totalVpk)) *
        100
      : 0;

  const deltaRevPercent =
    aggregates.totalR !== 0
      ? ((aggregates.totalRa - aggregates.totalR) / Math.abs(aggregates.totalR)) *
        100
      : 0;

  const deltaProfitPercent =
    aggregates.totalPb !== 0
      ? ((aggregates.totalPa - aggregates.totalPb) / Math.abs(aggregates.totalPb)) *
        100
      : 0;

  // Calculate average price (weighted by volume)
  const totalVolume = Math.abs(items.reduce((acc, item) => acc + item.vpk, 0));
  const avgPrice =
    totalVolume !== 0
      ? items.reduce((acc, item) => acc + item.ppk * Math.abs(item.vpk), 0) /
        totalVolume
      : 0;

  const totalVolumeAfter = Math.abs(items.reduce((acc, item) => acc + item.vpka, 0));
  const avgPriceAfter =
    totalVolumeAfter !== 0
      ? items.reduce((acc, item) => acc + item.ppka * Math.abs(item.vpka), 0) /
        totalVolumeAfter
      : 0;

  const deltaPpk = avgPriceAfter - avgPrice;

  return {
    avgPrice,
    avgPriceAfter,
    deltaPpk,
    ...aggregates,
    deltaVpkPercent,
    deltaRevPercent,
    deltaProfitPercent,
  };
};

// Helper function to get promo chip details (returns class names)
const getPromoChipDetails = (
  promoType: string
): { icon: any; className: string } => {
  switch (promoType) {
    case "Display":
      return {
        icon: <StorefrontOutlined fontSize="small" />,
        className: "promo-chip-display",
      };
    case "Feature":
      return {
        icon: <ExtensionOutlined fontSize="small" />,
        className: "promo-chip-feature",
      };
    case "Discount":
      return {
        icon: <LocalOfferOutlined fontSize="small" />,
        className: "promo-chip-discount",
      };
    case "Cross Impact":
      return {
        icon: <LocalOfferOutlined fontSize="small" />,
        className: "promo-chip-discount",
      };
    case "No Promo":
    default:
      return { icon: undefined, className: "promo-chip-none" };
  }
};

// Format delta values to show + sign for positive values and include colored trend arrows
const formatDeltaValue = (value: number, showPercentage = false) => {
  const formattedValue = showPercentage
    ? `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
    : `${value > 0 ? "+" : ""}${value.toFixed(2)}`;

  let colorClass = "delta-text-neutral";
  if (value > 0) colorClass = "delta-text-positive";
  else if (value < 0) colorClass = "delta-text-negative";

  return (
    <Box className="delta-value-box">
      <span className={colorClass}>
        {parseFloat(formattedValue) == 0 ? "⠀" + formattedValue : formattedValue}
      </span>
      {value > 0 ? (
        <ArrowUpward fontSize="small" className={`delta-arrow-icon ${colorClass}`} />
      ) : value < 0 ? (
        <ArrowDownward
          fontSize="small"
          className={`delta-arrow-icon ${colorClass}`}
        />
      ) : null}
    </Box>
  );
};

const DataRow: React.FC<{
  item: ResultsDataItem;
  indentLevel: number;
  showPromoType?: boolean;
}> = ({ item, indentLevel, showPromoType = true }) => {
  const paddingLeft = 50 + indentLevel * 24;
  const { icon, className: chipClassName } = getPromoChipDetails(item.promoType);

  return (
    <TableRow key={item.pid} className="data-row">
      <TableCell className="no-wrap" style={{ paddingLeft }}>
        {showPromoType ? (
          <Chip
            icon={icon}
            label={item.promoType}
            size="small"
            className={`promo-chip ${chipClassName}`}
          />
        ) : (
          item.osku
        )}
      </TableCell>
      <TableCell className="no-wrap">{item.ppk.toFixed(2)}</TableCell>
      <TableCell className="no-wrap">{item.ppka.toFixed(2)}</TableCell>
      <TableCell className="no-wrap">{formatDeltaValue(item.deltaPpk)}</TableCell>
      <TableCell className="no-wrap">{item.vpk.toLocaleString()}</TableCell>
      <TableCell className="no-wrap">{item.vpka.toLocaleString()}</TableCell>
      <TableCell className="no-wrap">
        {formatDeltaValue(item.deltaVpk, true)}
      </TableCell>
      <TableCell className="no-wrap">
        {item.r.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </TableCell>
      <TableCell className="no-wrap">
        {item.ra.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </TableCell>
      <TableCell className="no-wrap">
        {formatDeltaValue(item.deltaRev, true)}
      </TableCell>
      <TableCell className="no-wrap">
        {item.pb.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </TableCell>
      <TableCell className="no-wrap">
        {item.pa.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </TableCell>
      <TableCell className="no-wrap">{formatDeltaValue(item.pd, true)}</TableCell>
    </TableRow>
  );
};

// Group row components
const GroupRow: React.FC<{
  id: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  indentLevel: number;
  items?: ResultsDataItem[]; // Add optional items parameter for OSKU rows
  isOskuLevel?: boolean; // Flag to identify OSKU level rows
}> = ({ id, isExpanded, onToggle, indentLevel, items, isOskuLevel = false }) => {
  const paddingLeft = 16 + indentLevel * 24;

  // Calculate aggregated metrics for OSKU level rows
  const aggregates = isOskuLevel && items ? calculateOskuAggregates(items) : null;

  // If this is an OSKU row and we have aggregated data, render with metrics
  if (isOskuLevel && aggregates) {
    return (
      <TableRow className="group-row">
        <TableCell style={{ paddingLeft }}>
          <Box className="group-row-content">
            <IconButton
              size="small"
              onClick={() => onToggle(id)}
              className="expand-collapse-button"
            >
              {isExpanded ? (
                <ExpandLess fontSize="small" />
              ) : (
                <ExpandMore fontSize="small" />
              )}
            </IconButton>
            <Typography variant="body2" component="span" className="group-row-text">
              {id}
            </Typography>
          </Box>
        </TableCell>
        {/* Display aggregated metrics for OSKU row */}
        <TableCell className="no-wrap">{aggregates.avgPrice.toFixed(2)}</TableCell>
        <TableCell className="no-wrap">
          {aggregates.avgPriceAfter.toFixed(2)}
        </TableCell>
        <TableCell className="no-wrap">
          {formatDeltaValue(aggregates.deltaPpk)}
        </TableCell>
        <TableCell className="no-wrap">
          {aggregates.totalVpk.toLocaleString()}
        </TableCell>
        <TableCell className="no-wrap">
          {aggregates.totalVpka.toLocaleString()}
        </TableCell>
        <TableCell className="no-wrap">
          {formatDeltaValue(aggregates.deltaVpkPercent, true)}
        </TableCell>
        <TableCell className="no-wrap">
          {aggregates.totalR.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </TableCell>
        <TableCell className="no-wrap">
          {aggregates.totalRa.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </TableCell>
        <TableCell className="no-wrap">
          {formatDeltaValue(aggregates.deltaRevPercent, true)}
        </TableCell>
        <TableCell className="no-wrap">
          {aggregates.totalPb.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </TableCell>
        <TableCell className="no-wrap">
          {aggregates.totalPa.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </TableCell>
        <TableCell className="no-wrap">
          {formatDeltaValue(aggregates.deltaProfitPercent, true)}
        </TableCell>
      </TableRow>
    );
  }

  // Default rendering for non-OSKU rows or when aggregates are not available
  return (
    <TableRow className="group-row">
      <TableCell colSpan={13} style={{ paddingLeft }}>
        <Box className="group-row-content">
          <IconButton
            size="small"
            onClick={() => onToggle(id)}
            className="expand-collapse-button"
          >
            {isExpanded ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </IconButton>
          <Typography variant="body2" component="span" className="group-row-text">
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
      <TableCell className="no-wrap" rowSpan={3}>
        <Box className="table-header-product-cell">
          <Box className="table-header-icons">
            <Tooltip title="Settings">
              <IconButton
                size="small"
                sx={{ border: "1px solid gray" }}
                className="settings-button"
              >
                <Settings fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download Excel">
              <IconButton
                size="small"
                sx={{ border: "1px solid gray" }}
                className="download-button"
              >
                <GetApp fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save">
              <IconButton
                sx={{ border: "1px solid gray" }}
                size="small"
                className="save-button"
              >
                <Save fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box className="table-header-bottom-row">
            <Tooltip title={allExpanded ? "Collapse All" : "Expand All"}>
              <IconButton
                size="small"
                onClick={toggleAllGroups}
                className="expand-collapse-all-button"
              >
                {allExpanded ? <UnfoldLess /> : <UnfoldMore />}
              </IconButton>
            </Tooltip>
            <span className="table-header-product-text">Product</span>
          </Box>
        </Box>
      </TableCell>
      <TableCell className="no-wrap" colSpan={3}>
        Price (£)
      </TableCell>
      <TableCell className="no-wrap" colSpan={3}>
        Volume
      </TableCell>
      <TableCell className="no-wrap" colSpan={3}>
        Revenue (£)
      </TableCell>
      <TableCell className="no-wrap" colSpan={3}>
        Profits (£)
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="no-wrap">Price</TableCell>
      <TableCell className="no-wrap">New Price</TableCell>
      <TableCell className="no-wrap">△</TableCell>
      <TableCell className="no-wrap">Volume</TableCell>
      <TableCell className="no-wrap">New Volume</TableCell>
      <TableCell className="no-wrap">△ %</TableCell>
      <TableCell className="no-wrap">Revenue</TableCell>
      <TableCell className="no-wrap">New Revenue</TableCell>
      <TableCell className="no-wrap">△ %</TableCell>
      <TableCell className="no-wrap">Profit</TableCell>
      <TableCell className="no-wrap">New Profit</TableCell>
      <TableCell className="no-wrap">△ %</TableCell>
    </TableRow>
  </TableHead>
);

// Main ResultsTableView component
const ResultsTableView: React.FC<ResultsTableViewProps> = ({ level }) => {
  const { groupedData, expansionState, toggleExpansion, expandAll, collapseAll } =
    useResultsTableData(level);

  const [allExpanded, setAllExpanded] = useState(false);

  // Use totals from mockData_2.js
  const totals = mockData.totals;

  // Calculate percentage changes for totals
  const deltaVpkPercent =
    totals.vpk !== 0 ? (totals.vpkd / Math.abs(totals.vpk)) * 100 : 0;

  const deltaRevPercent =
    totals.rb !== 0 ? ((totals.ra - totals.rb) / Math.abs(totals.rb)) * 100 : 0;

  const deltaProfitPercent =
    totals.pb !== 0 ? ((totals.pa - totals.pb) / Math.abs(totals.pb)) * 100 : 0;

  const toggleAllGroups = () => {
    setAllExpanded(!allExpanded);

    if (allExpanded) {
      collapseAll();
    } else {
      expandAll();
    }
  };

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
                            items={items}
                            isOskuLevel={true}
                          />
                          {expansionState[osku] &&
                            sortByPromoType(items).map((item, idx) => (
                              <DataRow
                                key={`${item.pid}-${idx}`}
                                item={item}
                                indentLevel={4}
                              />
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
                      items={items}
                      isOskuLevel={true}
                    />
                    {expansionState[osku] &&
                      sortByPromoType(items).map((item, idx) => (
                        <DataRow
                          key={`${item.pid}-${idx}`}
                          item={item}
                          indentLevel={3}
                        />
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
                items={items}
                isOskuLevel={true}
              />
              {expansionState[osku] &&
                sortByPromoType(items).map((item, idx) => (
                  <DataRow key={`${item.pid}-${idx}`} item={item} indentLevel={2} />
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
          items={items}
          isOskuLevel={true}
        />
        {expansionState[osku] &&
          sortByPromoType(items).map((item, idx) => (
            <DataRow key={`${item.pid}-${idx}`} item={item} indentLevel={1} />
          ))}
      </React.Fragment>
    ));
  };

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
      <TableContainer component={Paper} className="table">
        <Table stickyHeader size="small">
          <TableHeader allExpanded={allExpanded} toggleAllGroups={toggleAllGroups} />
          <TableBody>
            <TableRow className="total-row">
              <TableCell className="no-wrap" align={"right"} colSpan={1}>
                <Typography variant="subtitle1" className="total-row-label">
                  Total:
                </Typography>
              </TableCell>
              <TableCell className="no-wrap">
                <span>{totals.ppk.toFixed(2)}</span>
              </TableCell>
              <TableCell className="no-wrap">
                <span>{totals.uppk.toFixed(2)}</span>
              </TableCell>
              <TableCell className="no-wrap">
                {formatDeltaValue(totals.ppkd)}
              </TableCell>
              <TableCell className="no-wrap">
                <span>{totals.vpk.toLocaleString()}</span>
              </TableCell>
              <TableCell className="no-wrap">
                <span>{totals.uvpk.toLocaleString()}</span>
              </TableCell>
              <TableCell className="no-wrap">
                {formatDeltaValue(deltaVpkPercent, true)}
              </TableCell>
              <TableCell className="no-wrap">
                <span>
                  {totals.rb.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </TableCell>
              <TableCell className="no-wrap">
                <span>
                  {totals.ra.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </TableCell>
              <TableCell className="no-wrap">
                {formatDeltaValue(deltaRevPercent, true)}
              </TableCell>
              <TableCell className="no-wrap">
                <span>
                  {totals.pb.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </TableCell>
              <TableCell className="no-wrap">
                <span>
                  {totals.pa.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </TableCell>
              <TableCell className="no-wrap">
                {formatDeltaValue(deltaProfitPercent, true)}
              </TableCell>
            </TableRow>
            {renderGroupedData()}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ResultsTableView;
