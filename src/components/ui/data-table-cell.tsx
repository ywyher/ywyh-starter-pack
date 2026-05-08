import type { Row } from "@tanstack/react-table";
import { format, isValid } from "date-fns";
import { Copy } from "lucide-react";
import { useState } from "react";
import DialogWrapper from "@/components/dialog-wrapper";
import { Button } from "@/components/ui/button";

interface DataTableCellProps<TData> {
	row: Row<TData>;
	value: string;
	max?: number;
}

export default function DataTableCell<TData>({
	row,
	value,
	max,
}: DataTableCellProps<TData>) {
	const [isRevealed, setIsRevealed] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const cellValue = row.getValue(value);

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	if (cellValue === null) {
		return <span className="text-muted-foreground">Empty</span>;
	}

	if (typeof cellValue === "boolean") {
		return cellValue === true ? "Yes" : "No";
	}

	if (typeof cellValue === "number") {
		return String(cellValue);
	}

	if (cellValue instanceof Date && isValid(cellValue)) {
		return format(cellValue, "MMM dd, yyyy hh:mm a");
	}

	if (value === "email") {
		return (
			<button
				onClick={() => setIsRevealed(!isRevealed)}
				className="relative inline-flex items-center gap-2 px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors cursor-pointer group"
				type="button"
			>
				{isRevealed ? (
					<span className="font-mono text-sm">{cellValue as string}</span>
				) : (
					<span
						className="font-mono text-sm blur-xs select-none"
						style={{
							filter: "blur(5px)",
							WebkitFilter: "blur(5px)",
						}}
					>
						{cellValue as string}
					</span>
				)}
			</button>
		);
	}

	if (typeof cellValue === "string") {
		const shouldTruncate = max && cellValue.length > max;

		if (shouldTruncate) {
			const truncatedValue = `${cellValue.slice(0, max)}...`;

			// Try to parse and pretty-print JSON, otherwise show as-is
			let displayValue = cellValue;
			try {
				const parsed = JSON.parse(cellValue);
				displayValue = JSON.stringify(parsed, null, 2);
			} catch {
				// Not JSON or already a string, use as-is
				displayValue = cellValue;
			}

			return (
				<DialogWrapper
					open={isDialogOpen}
					setOpen={setIsDialogOpen}
					title={value.charAt(0).toUpperCase() + value.slice(1)}
					description="Full content"
					trigger={
						<button
							className="text-left hover:text-primary transition-colors cursor-pointer"
							type="button"
						>
							{truncatedValue}
						</button>
					}
					footer={
						<Button
							variant="outline"
							size="sm"
							onClick={() => copyToClipboard(cellValue)}
							className="w-full"
						>
							<Copy className="w-4 h-4 mr-2" />
							Copy to Clipboard
						</Button>
					}
				>
					<div className="max-h-[60vh] overflow-y-auto p-4 bg-background rounded-md">
						<pre className="whitespace-pre-wrap break-words font-mono text-sm">
							{displayValue}
						</pre>
					</div>
				</DialogWrapper>
			);
		}

		return cellValue;
	}

	return null;
}
