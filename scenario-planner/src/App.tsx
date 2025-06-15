import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "./theme";
import ScenarioComparison from "./CompareScenarios/index";

const theme = getTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box>
        {/* <ScenarioPlanner /> */}
        <ScenarioComparison />
      </Box>
    </ThemeProvider>
  );
}

export default App;
