import type { Table } from "@tanstack/react-table";
import { Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface DataTableSearchFilterProps<TData> {
	filters: string[];
	table: Table<TData>;
}

export default function DataTableSearchFilter<TData>({
	filters,
	table,
}: DataTableSearchFilterProps<TData>) {
	const [activeFilter, setActiveFilter] = useState(filters[0]);

	return (
		<>
			<Input
				placeholder={`Filter Via ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}...`}
				value={(table.getColumn(activeFilter)?.getFilterValue() as string) ?? ""}
				onChange={(event) =>
					table.getColumn(activeFilter)?.setFilterValue(event.target.value)
				}
				className="h-8 w-[150px] lg:w-[250px]"
			/>
			{filters.length > 1 && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="h-8 px-2">
							<Settings className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						{filters.map((filter) => (
							<DropdownMenuCheckboxItem
								key={filter}
								className="flex flex-row gap-4 capitalize"
								checked={filter === activeFilter}
								onCheckedChange={() => setActiveFilter(filter)}
							>
								{filter}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</>
	);
}
