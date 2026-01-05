<script lang="ts">
	import jsPDF from 'jspdf';
	import autoTable from 'jspdf-autotable';
	import { Button } from '$lib/components/ui/button/index';
	import { FileDown, Download, Grid3x3 } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';

	import { page } from '$app/state';

	let pageName = page.url.pathname + ' File';

	const { fileName = pageName, tableId, data } = $props();

	function generatedPdf() {
		const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

		autoTable(doc, {
			html: tableId,
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
				fillColor: [245, 245, 245] // Light gray for alternating rows
			},
			tableLineColor: [200, 200, 200], // Table border color
			tableLineWidth: 0.1, // Table border width
			margin: { top: 20 } // Top margin of the table
		});

		doc.save(fileName);
	}

	import Papa from 'papaparse';

	function exportJSONtoCSV() {
		const csv = Papa.unparse(data);

		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		link.click();

		URL.revokeObjectURL(url); // Clean up
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
			<Button onclick={generatedPdf}>
				<FileDown /> Download in PDF</Button
			>
		</DropdownMenu.Item>
		<DropdownMenu.Item class="capitalize">
			<Button onclick={exportJSONtoCSV}>
				<Grid3x3 />
				Export to CSV</Button
			>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
