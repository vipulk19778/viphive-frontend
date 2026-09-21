import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { RouteLoadingFallback } from "./components/common/RouteLoadingFallback";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: RouteLoadingFallback,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
