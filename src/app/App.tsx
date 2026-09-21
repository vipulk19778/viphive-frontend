import { QueryProvider } from "./providers/QueryProvider";
import { RouterProvider } from "@tanstack/react-router";

import { router } from "../router";

function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;
