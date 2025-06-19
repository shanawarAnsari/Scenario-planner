import React from "react";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
} from "@ant-design/icons";

export const getTrendIcon = (value: number): React.ReactElement => {
  if (value > 0)
    return <ArrowUpOutlined style={{ color: "#16a34a", fontSize: 12 }} />;
  if (value < 0)
    return <ArrowDownOutlined style={{ color: "#ef4444", fontSize: 12 }} />;
  return <MinusOutlined style={{ color: "#6b7280", fontSize: 12 }} />;
};

export const getTrendColor = (value: number): string => {
  if (value > 0) return "#16a34a";
  if (value < 0) return "#ef4444";
  return "#6b7280";
};

export const formatValue = (value: number, unit?: string): string => {
  if (value === null || value === undefined) {
    return "-";
  }
  return typeof value === "number"
    ? `${value.toLocaleString()}${unit ?? ""}`
    : String(value);
};
