"use client";

import type { Table } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import { Ban, RefreshCwIcon, UserRoundSearch, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";
import DataTableSearchFilter from "@/components/ui/data-table-search-filter";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { roles } from "@/lib/constants/auth";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	filters: string[];
	refetch?: () => void;
}

interface BooleanFilterConfig {
	column: string;
	title: string;
	icon: LucideIcon;
}

const BOOLEAN_FILTERS: BooleanFilterConfig[] = [
	{
		column: "isAnonymous",
		title: "Is Anonymous",
		icon: UserRoundSearch,
	},
	// {
	// 	column: "isDonor",
	// 	title: "Is Donor",
	// 	icon: HandCoins,
	// },
	{
		column: "banned",
		title: "Is Banned",
		icon: Ban,
	},
];

const BOOLEAN_OPTIONS = [
	{ value: "true", label: "Yes" },
	{ value: "false", label: "No" },
];

export function DataTableToolbar<TData>({
	table,
	filters,
	refetch,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;
	const columnIds = table.getAllColumns().map((col) => col.id);
	const hasRoleColumn = columnIds.includes("role");

	return (
		<div className="flex flex-wrap items-center gap-2">
			{filters.length > 0 && (
				<DataTableSearchFilter table={table} filters={filters} />
			)}

			{hasRoleColumn && (
				<DataTableFacetedFilter
					column={table.getColumn("role")}
					title="Role"
					options={roles.map((r) => ({
						value: r,
						label: r,
					}))}
				/>
			)}

			{BOOLEAN_FILTERS.map(({ column, title, icon }) => {
				const hasColumn = columnIds.includes(column);
				return hasColumn ? (
					<DataTableFacetedFilter
						key={column}
						column={table.getColumn(column)}
						title={title}
						icon={icon}
						options={BOOLEAN_OPTIONS}
					/>
				) : null;
			})}

			{isFiltered && (
				<Button
					variant="outline"
					onClick={() => table.resetColumnFilters()}
					className="h-8 px-2 lg:px-3"
				>
					Reset
					<X />
				</Button>
			)}

			<div className="ml-auto flex items-center gap-2">
				{refetch && (
					<Button size="icon" onClick={() => refetch()} variant="outline">
						<RefreshCwIcon />
					</Button>
				)}

				<DataTableViewOptions table={table} />
			</div>
		</div>
	);
}
