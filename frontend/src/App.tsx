import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import { useState, useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Tailwind 다크모드 class 처리
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <div className="p-4 bg-white text-black dark:bg-gray-900 dark:text-white">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="px-4 py-2 rounded bg-gray-200 text-black dark:bg-gray-700 dark:text-white border"
        >
          Toggle Theme
        </button>
        
        <RouterProvider router={router} />
      </div> */}
        <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
