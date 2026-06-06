import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import SubmissionsPage from "./pages/Submissions";
import { theme } from "./utils/theme.util";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SubmissionsPage />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
