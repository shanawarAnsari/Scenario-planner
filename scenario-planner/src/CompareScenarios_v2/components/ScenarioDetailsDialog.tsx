import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  IconButton,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { Scenario } from "../types";

interface ScenarioDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  scenario: Scenario | null;
}

const ScenarioDetailsDialog: React.FC<ScenarioDetailsDialogProps> = ({
  open,
  onClose,
  scenario,
}) => {
  if (!scenario) return null;

  const startDate = `${scenario.timePeriod[0]?.weekRange.split(" - ")[0]} ${
    scenario.timePeriod[0]?.month
  } ${scenario.timePeriod[0]?.year}`;
  const endDate = `${
    scenario.timePeriod[scenario.timePeriod.length - 1]?.weekRange.split(" - ")[1]
  } ${scenario.timePeriod[scenario.timePeriod.length - 1]?.month} ${
    scenario.timePeriod[scenario.timePeriod.length - 1]?.year
  }`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
          {scenario.sn} - Scenario Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* Timeline Card */}
            <Card
              elevation={0}
              sx={{
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Timeline
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Start
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {startDate}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, mx: 2 }}>
                    <Divider sx={{ bgcolor: "primary.main", height: 2 }} />
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      End
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {endDate}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: "center", mt: 1.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      bgcolor: "primary.50",
                      color: "primary.main",
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      display: "inline-block",
                    }}
                  >
                    {scenario.timePeriod.length} week
                    {scenario.timePeriod.length > 1 ? "s" : ""}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            {/* Basic Information Card */}
            <Card
              elevation={0}
              sx={{
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Basic Information
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Created By
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {scenario.createdBy}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      User ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {scenario.userId}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Created On
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {scenario.createdOn}
                    </Typography>
                  </Box>
                  {scenario.modifiedOn && (
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        Modified On
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {scenario.modifiedOn}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            {/* Product Information Card */}
            <Card
              elevation={0}
              sx={{
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Product Information
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Manufacturer
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {scenario.mfr.join(", ")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Brand
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {scenario.brd.join(", ")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Sub-Brand
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {scenario.subBrd.join(", ")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      PPG
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {scenario.ppg.join(", ")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      OSKU
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {scenario.osku.join(", ")}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScenarioDetailsDialog;
