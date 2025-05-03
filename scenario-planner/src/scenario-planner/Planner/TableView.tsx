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
import { ExpandMore, ExpandLess, UnfoldMore, UnfoldLess } from "@mui/icons-material";
import {
  useTableData,
  MockDataItem,
  GroupLevel,
  GroupedByBrand,
  GroupedBySubBrand,
  GroupedByPPG,
  GroupedByOSKU,
} from "./hooks/useTableData";
import "./TableView.css";

// Props interface
interface TableViewProps {
  level: GroupLevel;
}

// PromoType component to display promo type with appropriate styling
const PromoTypeChip: React.FC<{ promoType: string }> = ({ promoType }) => {
  let color:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" = "default";

  switch (promoType) {
    case "Display":
      color = "primary";
      break;
    case "Feature":
      color = "secondary";
      break;
    case "Discount":
      color = "error";
      break;
    case "No Promo":
    default:
      color = "default";
  }

  return (
    <Chip
      sx={{ borderRadius: "4px" }}
      label={promoType}
      color={color}
      size="small"
      className="promo-chip"
    />
  );
};

// Helper function to sort items by promo type
const sortByPromoType = (items: MockDataItem[]): MockDataItem[] => {
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

// Extracted row component for better readability
const DataRow: React.FC<{
  item: MockDataItem;
  indentLevel: number;
  showPromoType?: boolean;
}> = ({ item, indentLevel, showPromoType = true }) => {
  return (
    <TableRow key={item.pid} className="table-row">
      <TableCell
        className={`body-cell`}
        sx={{ paddingLeft: `${indentLevel * 23}px` }}
      >
        {showPromoType && <PromoTypeChip promoType={item.promoType} />}
        {!showPromoType && item.osku}
      </TableCell>
      <TableCell className="body-cell text-right">{item.ppk.toFixed(2)}</TableCell>
      <TableCell className="body-cell text-right">{item.ppka.toFixed(2)}</TableCell>
      <TableCell className="body-cell text-right">
        {item.deltaPpk.toFixed(2)}
      </TableCell>
      <TableCell className="body-cell text-right">{item.vpk}</TableCell>
      <TableCell className="body-cell text-right">{item.vpka}</TableCell>
      <TableCell className="body-cell text-right">{item.deltaVpk}</TableCell>
      <TableCell className="body-cell text-right">{item.r.toFixed(2)}</TableCell>
      <TableCell className="body-cell text-right">{item.ra.toFixed(2)}</TableCell>
      <TableCell className="body-cell text-right">
        {item.deltaRev.toFixed(2)}
      </TableCell>
    </TableRow>
  );
};

// Group row components
const GroupRow: React.FC<{
  id: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  paddingLeft?: number;
  itemCount?: number;
  className?: string;
}> = ({ id, isExpanded, onToggle, paddingLeft = 16, itemCount, className }) => (
  <TableRow className={`group-row ${className || ""}`}>
    <TableCell
      colSpan={10}
      className="group-header"
      style={{ paddingLeft: `${paddingLeft}px` }}
    >
      <IconButton size="small" onClick={() => onToggle(id)}>
        {isExpanded ? (
          <ExpandLess fontSize="small" />
        ) : (
          <ExpandMore fontSize="small" />
        )}
      </IconButton>
      {id}
      {itemCount !== undefined && (
        <Typography variant="caption" component="span" className="group-count">
          ({itemCount})
        </Typography>
      )}
    </TableCell>
  </TableRow>
);

// Table header component
const TableHeader: React.FC<{
  allExpanded: boolean;
  toggleAllGroups: () => void;
}> = ({ allExpanded, toggleAllGroups }) => (
  <TableHead>
    <TableRow>
      <TableCell
        className="header-cell-base header-cell product-header-cell"
        rowSpan={3}
      >
        <Box className="product-header-content">
          <Tooltip title={allExpanded ? "Collapse All" : "Expand All"}>
            <IconButton size="small" onClick={toggleAllGroups}>
              {allExpanded ? <UnfoldLess /> : <UnfoldMore />}
            </IconButton>
          </Tooltip>
          <span>Product</span>
        </Box>
      </TableCell>
      <TableCell
        className="header-cell-base group-header-cell no-bottom-border"
        colSpan={3}
      >
        Price (£)
      </TableCell>
      <TableCell
        className="header-cell-base group-header-cell no-bottom-border"
        colSpan={3}
      >
        Volume
      </TableCell>
      <TableCell
        className="header-cell-base group-header-cell no-bottom-border"
        colSpan={3}
      >
        Revenue (£)
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell className="header-cell-base header-cell text-right">
        Price Per Pack
      </TableCell>
      <TableCell className="header-cell-base header-cell text-right">
        Price Per Pack After
      </TableCell>
      <TableCell className="header-cell-base header-cell text-right">
        Delta PPK
      </TableCell>
      <TableCell className="header-cell-base header-cell text-right">
        Volume Per Pack
      </TableCell>
      <TableCell className="header-cell-base header-cell text-right">
        Volume Per Pack After
      </TableCell>
      <TableCell className="header-cell-base header-cell text-right">
        Delta VPK
      </TableCell>
      <TableCell className="header-cell-base header-cell text-right">
        Revenue
      </TableCell>
      <TableCell className="header-cell-base header-cell text-right">
        Revenue After
      </TableCell>
      <TableCell className="header-cell-base header-cell text-right">
        Delta Rev
      </TableCell>
    </TableRow>
  </TableHead>
);

// Main TableView component
const TableView: React.FC<TableViewProps> = ({ level }) => {
  const {
    groupedData,
    expandedGroups,
    expandedSubGroups,
    expandedPPGs,
    expandedOSKUs,
    toggleGroup,
    toggleSubGroup,
    togglePPG,
    toggleOSKU,
    expandAll,
    collapseAll,
  } = useTableData(level);

  const [allExpanded, setAllExpanded] = useState(false);

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
          isExpanded={expandedGroups[brand]}
          onToggle={toggleGroup}
        />
        {expandedGroups[brand] &&
          Object.entries(subGroups).map(([subBrand, ppgGroups]) => (
            <React.Fragment key={subBrand}>
              <GroupRow
                id={subBrand}
                isExpanded={expandedSubGroups[subBrand]}
                onToggle={toggleSubGroup}
                paddingLeft={32}
              />
              {expandedSubGroups[subBrand] &&
                Object.entries(ppgGroups).map(([ppg, oskuGroups]) => (
                  <React.Fragment key={ppg}>
                    <GroupRow
                      id={ppg}
                      isExpanded={expandedPPGs[ppg]}
                      onToggle={togglePPG}
                      paddingLeft={48}
                    />
                    {expandedPPGs[ppg] &&
                      typeof oskuGroups === "object" &&
                      !Array.isArray(oskuGroups) &&
                      Object.entries(oskuGroups).map(([osku, items]) => (
                        <React.Fragment key={osku}>
                          <GroupRow
                            id={osku}
                            isExpanded={expandedOSKUs[osku]}
                            onToggle={toggleOSKU}
                            paddingLeft={64}
                            itemCount={items.length}
                            className="osku-row"
                          />
                          {expandedOSKUs[osku] &&
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
          isExpanded={expandedGroups[subBrand]}
          onToggle={toggleGroup}
          paddingLeft={16}
        />
        {expandedGroups[subBrand] &&
          Object.entries(ppgGroups).map(([ppg, oskuGroups]) => (
            <React.Fragment key={ppg}>
              <GroupRow
                id={ppg}
                isExpanded={expandedPPGs[ppg]}
                onToggle={togglePPG}
                paddingLeft={32}
              />
              {expandedPPGs[ppg] &&
                typeof oskuGroups === "object" &&
                !Array.isArray(oskuGroups) &&
                Object.entries(oskuGroups).map(([osku, items]) => (
                  <React.Fragment key={osku}>
                    <GroupRow
                      id={osku}
                      isExpanded={expandedOSKUs[osku]}
                      onToggle={toggleOSKU}
                      paddingLeft={48}
                      itemCount={items.length}
                      className="osku-row"
                    />
                    {expandedOSKUs[osku] &&
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
          isExpanded={expandedPPGs[ppg]}
          onToggle={togglePPG}
          paddingLeft={16}
        />
        {expandedPPGs[ppg] &&
          typeof oskuGroups === "object" &&
          !Array.isArray(oskuGroups) &&
          Object.entries(oskuGroups).map(([osku, items]) => (
            <React.Fragment key={osku}>
              <GroupRow
                id={osku}
                isExpanded={expandedOSKUs[osku]}
                onToggle={toggleOSKU}
                paddingLeft={32}
                itemCount={items.length}
                className="osku-row"
              />
              {expandedOSKUs[osku] &&
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
          isExpanded={expandedOSKUs[osku]}
          onToggle={toggleOSKU}
          paddingLeft={16}
          itemCount={items.length}
          className="osku-row"
        />
        {expandedOSKUs[osku] &&
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
    <Box className="table-view-container">
      <Typography variant="h5" className="table-title">
        Scenario Planner Table
      </Typography>
      <TableContainer component={Paper} className="table-container">
        <Table stickyHeader size="small">
          <TableHeader allExpanded={allExpanded} toggleAllGroups={toggleAllGroups} />
          <TableBody>{renderGroupedData()}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableView;
