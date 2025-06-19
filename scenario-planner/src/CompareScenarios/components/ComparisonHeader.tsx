import React from "react";
import { Box, Typography } from "@mui/material";

interface ComparisonHeaderProps {
  title: string;
  subtitle: string;
}

const ComparisonHeader: React.FC<ComparisonHeaderProps> = ({ title, subtitle }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={600} sx={{ color: "#1f2937", mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b7280" }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default ComparisonHeader;
