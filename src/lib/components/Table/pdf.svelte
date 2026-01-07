<script lang="ts">
	import jsPDF from 'jspdf';
	import autoTable from 'jspdf-autotable';
	import { Button } from '$lib/components/ui/button/index';
	import { FileDown, Download, Grid3x3 } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { page } from '$app/state';
	import Papa from 'papaparse';

	// Svelte 5 Props
	const { fileName = page.url.pathname.split('/').pop() || 'export', tableId, data } = $props();

	function generatedPdf() {
		const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

		autoTable(doc, {
			html: tableId, // Uses the ID (e.g., "#my-table")
			styles: {
				font: 'helvetica',
				fontSize: 10,
				textColor: [40, 40, 40],
				halign: 'left',
				valign: 'middle',
				cellPadding: 4
			},
			headStyles: {
				fillColor: [0, 0, 0],
				textColor: 255,
				fontStyle: 'bold'
			},
			alternateRowStyles: {
				fillColor: [245, 245, 245]
			},
			margin: { top: 20 }
		});

		doc.save(`${fileName}.pdf`);
	}

	function exportTableToCSV() {
		let csvData;

		// If tableId is provided, parse the DOM table
		if (tableId) {
			const tableElement = document.querySelector(tableId) as HTMLTableElement;

			if (!tableElement) {
				console.error(`Table with selector ${tableId} not found.`);
				return;
			}

			// Convert HTML table rows to a 2D array
			const rows = Array.from(tableElement.querySelectorAll('tr'));
			csvData = rows.map((row) => {
				const cells = Array.from(row.querySelectorAll('th, td'));
				return cells.map((cell) => (cell as HTMLElement).innerText.trim());
			});
		} else {
			// Fallback to the JSON data prop if no tableId is provided
			csvData = data;
		}

		// Convert to CSV string
		const csv = Papa.unparse(csvData);

		// Download logic
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${fileName}.csv`;
		link.click();

		URL.revokeObjectURL(url);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" class="ml-auto">
				<Download class="size-5" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item class="capitalize">
			<Button variant="default" class="w-full justify-start gap-2" onclick={generatedPdf}>
				<FileDown class="size-4 text-white dark:text-black" /> Download in PDF
			</Button>
		</DropdownMenu.Item>
		<DropdownMenu.Item class="capitalize">
			<Button variant="default" class="w-full justify-start gap-2" onclick={exportTableToCSV}>
				<Grid3x3 class="size-4 text-white dark:text-black" /> Export to CSV
			</Button>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
