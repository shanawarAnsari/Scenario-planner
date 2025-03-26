import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "./theme";
import ScenarioPlanner from "./scenario-planner";

const theme = getTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <ScenarioPlanner />
      </Box>
    </ThemeProvider>
  );
}

export default App;
