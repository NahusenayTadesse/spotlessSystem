<script lang="ts">
	import { jsPDF } from 'jspdf';
	import html2PDF from 'jspdf-html2canvas';

	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Download, Printer } from '@lucide/svelte';

	// Svelte 5 Props
	let { staff } = $props();

	let downloadElement: HTMLElement;

	function download() {
		html2PDF(downloadElement, {
			jsPDF: {
				unit: 'mm',
				format: [54, 86], // Width is now smaller than Height
				orientation: 'portrait'
			},
			imageType: 'image/jpeg',
			success: function (pdf) {
				pdf.save(`${staff.firstName}_ID_Card.pdf`);
			}
		});
	}

	async function generatePDF() {
		if (!downloadElement) return;

		// 1. Capture the element
		const canvas = await html2PDF(downloadElement, {
			scale: 3, // Higher scale for print quality (300 DPI feel)
			useCORS: true,
			backgroundColor: null // Keeps transparency if needed
		});

		const imgData = canvas.toDataURL('image/png');

		// 2. Initialize jsPDF (Custom size for ID cards: 54mm x 86mm is standard CR80)
		const pdf = new jsPDF({
			orientation: 'portrait',
			unit: 'mm',
			format: [54, 86]
		});

		// 3. Add the image to fit the page
		pdf.addImage(imgData, 'PNG', 0, 0, 54, 86);
		pdf.save(`${staff.firstName}_ID_Card.pdf`);
	}

	const handlePrint = () => {
		window.print();
	};
</script>

<div class="printable-area flex flex-col items-center gap-6 p-8">
	<Card.Root
		class="printable-area relative flex w-87.5  overflow-hidden border-t-4 border-t-primary shadow-xl"
	>
		<Card.Header class="items-center pb-2">
			<div class="group relative">
				<img
					src={`/dashboard/files/${staff.photo}` || '/dashboard/files/default.jpg`'}
					alt="Profile"
					class="h-32 w-32 rounded-full border-4 border-secondary object-cover"
				/>

				<img src="/logo.webp" class="absolute top-0 right-0 h-32 w-32 justify-self-center" alt="" />
				<Badge
					class="absolute -bottom-2 left-1/2 -translate-x-1/2"
					variant={staff.isActive ? 'default' : 'destructive'}
				>
					{staff.status}
				</Badge>
			</div>
			<Card.Title class="mt-4 text-lg font-bold capitalize"
				>{staff.firstName} {staff.fatherName}</Card.Title
			>
			<Card.Description class="font-medium text-primary">{staff.department}</Card.Description>
		</Card.Header>

		<Card.Content class="grid grid-cols-2 gap-4 border-t bg-muted/30 pt-4 text-sm">
			<div>
				<p class="text-[10px] text-muted-foreground uppercase">ID Number</p>
				<p class="font-bold">{staff.idNo}</p>
			</div>
			<div>
				<p class="text-[10px] text-muted-foreground uppercase">Blood Type</p>
				<p class="font-bold">{staff.bloodType || 'N/A'}</p>
			</div>
			<div class="col-span-2">
				<p class="text-[10px] text-muted-foreground uppercase">TIN Number</p>
				<p class="font-mono">{staff.tinNo}</p>
			</div>
		</Card.Content>

		<Card.Footer class="justify-center bg-primary py-2 text-primary-foreground">
			<span class="text-[10px] font-bold tracking-widest uppercase">Spotless.</span>
		</Card.Footer>
	</Card.Root>

	<div class="sr-only">
		<Card.Root class="w-87.5 overflow-hidden">
			<div class="flex items-center justify-center border-b bg-slate-50 p-4">
				<img src="/logo.webp" alt="Company Logo" class="h-8 w-auto" />
				<Badge variant="outline" class="text-[10px]">OFFICIAL ID</Badge>
			</div>
		</Card.Root>
		<!-- <div
			bind:this={downloadElement}
			class="relative flex h-81.25 w-51 flex-col items-center border bg-white p-4"
			style="font-family: sans-serif;"
		>
			<div class="absolute top-0 left-0 h-2 w-full bg-blue-600"></div>
			<img
				src="/dashboard/files/{staff.photo}"
				class="mt-4 h-24 w-24 rounded-full border-2 border-blue-600 object-cover"
				alt=""
			/>
			<h4 class="mt-2 text-center leading-tight font-bold uppercase">
				{staff.firstName}<br />{staff.fatherName}
			</h4>
			<p class="text-xs font-bold text-blue-600">{staff.department}</p>

			<div class="mt-auto w-full space-y-1 pb-4 text-[10px]">
				<div class="flex justify-between border-b pb-1">
					<span class="text-gray-500 uppercase">ID NO:</span>
					<span class="font-bold">{staff.idNo}</span>
				</div>
				<div class="flex justify-between border-b pb-1">
					<span class="text-gray-500 uppercase">Blood:</span>
					<span class="font-bold">{staff.bloodType}</span>
				</div>
			</div>
			<div
				class="w-full bg-slate-800 py-1 text-center text-[8px] tracking-widest text-white uppercase"
			>
				Official Identity Card
			</div>
		</div> -->

		<div class="no-print sr-only">
			<div
				bind:this={downloadElement}
				class="relative flex flex-col items-center overflow-hidden border bg-white shadow-none"
				style="width: 2.125in; height: 3.375in; font-family: 'Inter', sans-serif; box-sizing: border-box; padding: 5px"
			>
				<div class="h-4 w-full bg-blue-700"></div>

				<div class="mb-2 flex flex-col items-center gap-2 pt-3">
					<img src="/logo.webp" alt="Company Logo" class="mb-1 h-6 w-auto" />
					<span class="tracking-wildest text-[8px] font-bold text-gray-400 uppercase"
						>Employee Access</span
					>
				</div>

				<div class="relative mt-1">
					<div class="absolute inset-0 scale-110 rounded-full border-[1.5px] border-blue-600"></div>
					<img
						src="/dashboard/files/{staff.photo}"
						class="relative z-10 h-20 w-20 rounded-full bg-gray-100 object-cover"
						alt="Staff Profile"
					/>
				</div>

				<div class="mt-3 px-2 text-center">
					<h4 class="text-[14px] leading-tight font-black tracking-tight text-slate-900 uppercase">
						{staff.firstName}<br />{staff.fatherName}
					</h4>
					<div
						class="mt-1 inline-block rounded bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 uppercase"
					>
						{staff.department}
					</div>
				</div>

				<div class="mt-auto mb-2 w-full px-4">
					<div class="grid grid-cols-2 gap-y-2 border-t border-gray-100 pt-3">
						<div class="flex flex-col">
							<span class="text-[7px] font-bold tracking-wider text-gray-400 uppercase"
								>ID Number</span
							>
							<span class="font-mono text-[10px] font-bold text-slate-800">{staff.idNo}</span>
						</div>
						<div class="flex flex-col text-right">
							<span class="text-[7px] font-bold tracking-wider text-gray-400 uppercase"
								>Blood Group</span
							>
							<span class="text-[10px] font-bold text-red-600">{staff.bloodType}</span>
						</div>
					</div>
				</div>

				<div class="w-full bg-slate-900 py-2 text-center shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
					<p class="tracking-[0.15em] text-white uppercase">Spotless</p>
				</div>
				<img src="/logo.webp" alt="Company Logo" class="mb-1 h-16 w-16 justify-self-center" />
			</div>
		</div>
	</div>
</div>
<div class="no-print flex gap-4 justify-self-center">
	<Button variant="outline" onclick={() => window.print()}>
		<Printer class="mr-2 h-4 w-4" /> Print View
	</Button>
	<Button onclick={download}>
		<Download class="mr-2 h-4 w-4" /> Download PDF
	</Button>
</div>

<style>
	@media print {
		:global(body *) {
			visibility: hidden;
		}
		.printable-area,
		:global(.printable-area *) {
			visibility: visible;
		}
		.printable-area {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
		}
	}
</style>
