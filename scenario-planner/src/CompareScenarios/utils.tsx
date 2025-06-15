import React from "react";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
} from "@ant-design/icons";

export const getTrendIcon = (value: number): React.ReactElement => {
  if (value > 0)
    return <ArrowUpOutlined style={{ color: "#22c55e", fontSize: 14 }} />;
  if (value < 0)
    return <ArrowDownOutlined style={{ color: "#ef4444", fontSize: 14 }} />;
  return <MinusOutlined style={{ color: "#6b7280", fontSize: 14 }} />;
};

export const getTrendColor = (value: number): string => {
  if (value > 0) return "#22c55e";
  if (value < 0) return "#ef4444";
  return "#6b7280";
};

export const formatValue = (value: number, unit?: string): string => {
  return typeof value === "number"
    ? `${value.toLocaleString()}${unit ?? ""}`
    : String(value);
};
