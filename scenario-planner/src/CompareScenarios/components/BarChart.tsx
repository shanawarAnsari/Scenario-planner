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

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(beforeValue, afterValue) * 1.1;
  const beforePercentage = (beforeValue / maxValue) * 100;
  const afterPercentage = (afterValue / maxValue) * 100;

  const isIncrease = percentageChange > 0;
  const getColorScheme = () => {
    if (label.includes("Volume")) return { light: "#fcd19d", dark: "#ff9412" };;
    if (label.includes("NSV")) return { light: "#f3e8ff", dark: "#9333ea" };
    if (label.includes("Profit")) return { light: "#e0e7ff", dark: "#3b82f6" };
    return { light: "#f3f4f6", dark: "#6b7280" };
  };

  const colors = getColorScheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            width: "100%",
            height: 30,
            backgroundColor: "#f8fafc",
            borderRadius: 0.5,
            overflow: "hidden",
            mb: 0.3,
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: isLoaded ? `${Math.max(beforePercentage, 8)}%` : "0%",
              height: "100%",
              backgroundColor: colors.light,
              transition: "width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              display: "flex",
              alignItems: "center",
              paddingLeft: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#4b5563",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {beforeValue.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: isLoaded ? `${Math.max(afterPercentage, 8)}%` : "0%",
            height: "100%",
            backgroundColor: colors.dark,
            transition: "width 1.5s cubic-bezier(0.19, 1, 0.22, 1)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "white",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {afterValue.toLocaleString()}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: isIncrease ? "#16a34a" : "#dc2626",
            fontSize: "12px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {isIncrease ? (
            <ArrowUpOutlined style={{ fontSize: "12px" }} />
          ) : (
            <ArrowDownOutlined style={{ fontSize: "12px" }} />
          )}
          {Math.abs(percentageChange).toFixed(1)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default BarChart;
