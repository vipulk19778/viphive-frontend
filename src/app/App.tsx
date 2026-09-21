import { QueryProvider } from "./providers/QueryProvider";
import { RouterProvider } from "@tanstack/react-router";

import { ThemeController } from "../components/common/ThemeController";
import { router } from "../router";

import "swiper/css";
import "swiper/css/navigation";

function App() {
  return (
    <QueryProvider>
      <ThemeController />
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;
