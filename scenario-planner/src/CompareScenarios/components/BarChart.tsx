import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

interface BarChartProps {
  beforeValue: number;
  afterValue: number;
  label: string;
  unit?: string;
  percentageChange: number;
}

const BarChart: React.FC<BarChartProps> = ({
  beforeValue,
  afterValue,
  label,
  unit = "",
  percentageChange,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(beforeValue, afterValue) * 1.2; // Add 20% buffer for better visibility
  const beforePercentage = (beforeValue / maxValue) * 100;
  const afterPercentage = (afterValue / maxValue) * 100;

  const isIncrease = percentageChange > 0;
  const getColorScheme = () => {
    if (label.includes("Volume")) return { light: "#e0e7ff", dark: "#3b82f6" };
    if (label.includes("Revenue")) return { light: "#f3e8ff", dark: "#9333ea" };
    if (label.includes("Profit")) return { light: "#dcfce7", dark: "#16a34a" };
    return { light: "#f3f4f6", dark: "#6b7280" };
  };

  const colors = getColorScheme();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
      {/* Compact Stacked Bar Chart */}
      <Box sx={{ flex: 1, maxWidth: "70%" }}>
        {/* Before Value Bar */}
        <Box
          sx={{
            width: "100%",
            height: 34,
            backgroundColor: "#f8fafc",
            borderRadius: 0.5,
            overflow: "hidden",
            mb: 0.3,
            position: "relative",
          }}
        >
          {" "}
          <Box
            sx={{
              width: isLoaded ? `${Math.max(beforePercentage, 8)}%` : "0%", // Start from 0% and animate to final width
              height: "100%",
              backgroundColor: colors.light,
              transition: "width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Exponential easing
              display: "flex",
              alignItems: "center",
              paddingLeft: 0.5,
            }}
          >
            {" "}
            <Typography
              variant="caption"
              sx={{
                color: "#4b5563",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {beforeValue.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* After Value Bar */}
        <Box
          sx={{
            width: "100%",
            height: 34,
            backgroundColor: "#f8fafc",
            borderRadius: 0.5,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {" "}
          <Box
            sx={{
              width: isLoaded ? `${Math.max(afterPercentage, 8)}%` : "0%", // Start from 0% and animate to final width
              height: "100%",
              backgroundColor: colors.dark,
              transition: "width 1.5s cubic-bezier(0.19, 1, 0.22, 1)", // Different exponential easing for variety
              display: "flex",
              alignItems: "center",
              paddingLeft: 0.5,
            }}
          >
            {" "}
            <Typography
              variant="caption"
              sx={{
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {afterValue.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Percentage Change */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "100px", // Double the width from 50px to 100px
          height: "32px",
          borderRadius: 1,
          backgroundColor: isIncrease ? "#f0f9f3" : "#fef2f2",
          border: `1px solid ${isIncrease ? "#d1fae5" : "#fecaca"}`,
        }}
      >
        {" "}
        <Typography
          variant="caption"
          sx={{
            color: isIncrease ? "#16a34a" : "#dc2626",
            fontSize: "13px", // Increased from 11px
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {isIncrease ? (
            <ArrowUpOutlined style={{ fontSize: "12px" }} /> // Increased from 10px
          ) : (
            <ArrowDownOutlined style={{ fontSize: "12px" }} /> // Increased from 10px
          )}
          {Math.abs(percentageChange).toFixed(1)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default BarChart;
