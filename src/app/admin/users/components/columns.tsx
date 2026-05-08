"use client";
import type { User } from "@bettermelon/database";
import type { Column, ColumnDef, Row } from "@tanstack/react-table";
import UsersTableAcitons from "@/app/admin/users/components/table-actions";
import { Checkbox } from "@/components/ui/checkbox";
import DataTableCell from "@/components/ui/data-table-cell";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

const userColumns = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "displayName", label: "Display Name" },
  { value: "email", label: "Email" },
  { value: "role", label: "Role" },
  { value: "isAnonymous", label: "Is Anonymous" },
  { value: "isDonor", label: "Is Donor" },
  { value: "banned", label: "Is Banned" },
  { value: "createdAt", label: "Created At" },
];

// Boolean columns that need special filter handling
const booleanColumns = ["isAnonymous", "isDonor", "banned"];

export const userTableColumns: ColumnDef<Partial<User>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  ...userColumns.map(({ value, label }) => ({
    accessorKey: value,
    header: ({ column }: { column: Column<Partial<User>> }) => (
      <DataTableColumnHeader column={column} title={label} />
    ),
    cell: ({ row }: { row: Row<Partial<User>> }) => (
      <DataTableCell row={row} value={value} />
    ),
    // Add custom filter function for boolean columns
    ...(booleanColumns.includes(value) && {
      filterFn: (
        row: Row<Partial<User>>,
        columnId: string,
        filterValue: string[],
      ) => {
        if (!filterValue || filterValue.length === 0) return true;

        const rowValue = row.getValue(columnId) as boolean;
        const filterBooleans = filterValue.map((v: string) => v === "true");

        return filterBooleans.includes(rowValue);
      },
    }),
  })),
  {
    id: "actions",
    cell: ({ row }) => <UsersTableAcitons user={row.original as User} />,
  },
];
