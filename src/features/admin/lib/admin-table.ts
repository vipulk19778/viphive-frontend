import {
  createColumnHelper,
  rowSortingFeature,
  tableFeatures,
  type ColumnDef,
} from "@tanstack/react-table";

export const adminTableFeatures = tableFeatures({ rowSortingFeature });

export const createAdminColumnHelper = <TData extends object>() =>
  createColumnHelper<typeof adminTableFeatures, TData>();

export type AdminColumnDef<TData extends object> = ColumnDef<
  typeof adminTableFeatures,
  TData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;
