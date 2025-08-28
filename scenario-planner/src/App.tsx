import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "./theme";
import ScenarioComparison from "./CompareScenarios_v2/ScenarioComparison";

const theme = getTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box className="App">
        <ScenarioComparison />
      </Box>
    </ThemeProvider>
  );
}

export default App;
