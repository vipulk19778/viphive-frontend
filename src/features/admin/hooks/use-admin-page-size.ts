import { useState } from "react";

function getDefaultPageSize() {
  return typeof window !== "undefined" && window.innerWidth >= 1900 ? 10 : 5;
}

export function useAdminPageSize() {
  return useState(getDefaultPageSize)[0];
}
