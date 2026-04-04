<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { formatEthiopianDate } from '$lib/global.svelte.js';
	import { Printer } from '@lucide/svelte';
	import MonthYear from '$lib/formComponents/MonthYear.svelte';

	let { data } = $props();
	let monthYear = $state('');

	// --- Types based on your schema ---
	type Month =
		| 'መስከረም'
		| 'ጥቅምት'
		| 'ህዳር'
		| 'ታህሳስ'
		| 'ጥር'
		| 'የካቲት'
		| 'መጋቢት'
		| 'ሚያዝያ'
		| 'ግንቦት'
		| 'ሰኔ'
		| 'ሐምሌ'
		| 'ነሐሴ';

	const MONTHS: Month[] = [
		'መስከረም',
		'ጥቅምት',
		'ህዳር',
		'ታህሳስ',
		'ጥር',
		'የካቲት',
		'መጋቢት',
		'ሚያዝያ',
		'ግንቦት',
		'ሰኔ',
		'ሐምሌ',
		'ነሐሴ'
	];

	const MONTH_LABELS: Record<Month, string> = {
		መስከረም: 'Meskerem (Sep)',
		ጥቅምት: 'Tikimt (Oct)',
		ህዳር: 'Hidar (Nov)',
		ታህሳስ: 'Tahsas (Dec)',
		ጥር: 'Tir (Jan)',
		የካቲት: 'Yekatit (Feb)',
		መጋቢት: 'Megabit (Mar)',
		ሚያዝያ: 'Miyazya (Apr)',
		ግንቦት: 'Ginbot (May)',
		ሰኔ: 'Sene (Jun)',
		ሐምሌ: 'Hamle (Jul)',
		ነሐሴ: 'Nehasse (Aug)'
	};

	// --- Form state ---
	let siteName = $derived(data.contracts.siteName);
	let customerName = $derived(data?.contracts?.customerName);

	let contractMonthlyAmount = $derived(data?.contracts?.monthlyAmount);
	let contractDate = $derived(formatEthiopianDate(data?.contracts?.contractDate));
	let contractStartDate = $derived(formatEthiopianDate(data?.contracts?.startDate));
	let contractEndDate = $derived(formatEthiopianDate(data?.contracts?.endDate));
	let fsNumber = $state('');
	let invoiceNumber = $state('');
	let [m, y] = $derived(monthYear.split('_'));
	let selectedMonth = $derived(m);
	let selectedYear = $derived<number>(Number(y));
	let requestDate = $state(new Date().toISOString().split('T')[0]);

	let penaltyAmount = $state<number>(0);
	let penaltyReason = $state('');
	let hasPenalty = $state(false);

	let vatRate = $state<number>(15);
	let withholdRate = $state<number>(3);

	let signingOfficer = $derived(data?.contracts.signingOfficer);
	let companyName = $state('Spotless General Trading P.L.C.');

	// --- Derived calculations ---
	let requestAmount = $derived(
		Math.max(0, Number(contractMonthlyAmount) - (hasPenalty ? penaltyAmount : 0))
	);
	let beforeVat = $derived(requestAmount / (1 + vatRate / 100));
	let vat = $derived(requestAmount - beforeVat);
	let withholdAmount = $derived(beforeVat * (withholdRate / 100));
	let paymentAmount = $derived(requestAmount - withholdAmount);

	function fmt(n: number) {
		return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}

	// --- PDF Export ---
	async function exportToPDF() {
		try {
			const { default: jsPDF } = await import('jspdf');
			const { default: html2canvas } = await import('html2canvas');

			const el = document.getElementById('payment-request-document');
			if (!el) {
				alert('Document element not found');
				return;
			}

			// Temporarily hide problematic elements during capture
			const logo = el.querySelector('img');
			const originalLogoDisplay = logo?.style.display;
			if (logo && !logo.complete) {
				// If logo isn't loaded or causes CORS issues, hide it for PDF
				logo.style.display = 'none';
			}

			const canvas = await html2canvas(el, {
				scale: 2,
				useCORS: true,
				allowTaint: true,
				backgroundColor: '#ffffff',
				logging: false,
				onclone: (clonedDoc) => {
					// Ensure fonts are loaded in clone
					clonedDoc.getElementById('payment-request-document')?.style.setProperty('width', '210mm');
				}
			});

			// Restore logo
			if (logo) logo.style.display = originalLogoDisplay || '';

			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF({
				orientation: 'portrait',
				unit: 'mm',
				format: 'a4',
				compress: true
			});

			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();
			const imgWidth = pageWidth;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			if (imgHeight <= pageHeight) {
				pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
			} else {
				let heightLeft = imgHeight;
				let position = 0;
				pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;

				while (heightLeft > 0) {
					position = heightLeft - imgHeight;
					pdf.addPage();
					pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
					heightLeft -= pageHeight;
				}
			}

			const filename = `payment-request-${siteName || 'site'}-${selectedMonth}-${selectedYear}.pdf`;
			pdf.save(filename);
		} catch (error) {
			console.error('PDF Export failed:', error);
			alert('PDF export failed. Check console for details.');
		}
	}

	function printDocument() {
		window.print();
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap"
		rel="stylesheet"
	/>
	<style>
		@media print {
			.no-print {
				display: none !important;
			}
			body {
				background: white;
			}
		}
	</style>
</svelte:head>

<div class="min-h-screen bg-stone-100 font-sans" style="font-family: 'DM Sans', sans-serif;">
	<!-- ── CONTROL PANEL ── -->
	<div class="no-print mx-auto max-w-5xl px-6 py-8">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-stone-800" style="font-family: 'Playfair Display', serif;">
				Payment Request Generator
			</h1>
			<p class="mt-1 text-sm text-stone-500">
				Fill in the details below to generate a monthly payment request letter.
			</p>
		</div>

		<!-- <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<!-- Company / Sender Info -->
		<div class="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-xs font-semibold tracking-widest text-stone-400 uppercase">
				Spotless General Trading P.L.C.
			</h2>
			-->

			<div class="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-xs font-semibold tracking-widest text-stone-400 uppercase">
					Invoice & Period
				</h2>
				<div class="space-y-3">
					<div class="grid grid-cols-2 gap-3">
						<div>
							<Label class="mb-1 block text-xs text-stone-500">Invoice Number</Label>
							<Input
								bind:value={invoiceNumber}
								placeholder="INV-2024-001"
								class="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:ring-2 focus:ring-stone-400 focus:outline-none"
							/>
						</div>
						<div>
							<Label class="mb-1 block text-xs text-stone-500">FS Number</Label>
							<Input
								bind:value={fsNumber}
								placeholder="FS-001"
								class="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:ring-2 focus:ring-stone-400 focus:outline-none"
							/>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div>
							<Label class="mb-1 block text-xs text-stone-500">Month and Year (Ethiopian)</Label>

							<MonthYear bind:value={monthYear} />
						</div>

						<div class="grid grid-cols-2 gap-3">
							<div>
								<Label class="mb-1 block text-xs text-stone-500">VAT Rate (%)</Label>
								<Input
									bind:value={vatRate}
									type="number"
									min="0"
									max="100"
									class="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:ring-2 focus:ring-stone-400 focus:outline-none"
								/>
							</div>
							<div>
								<Label class="mb-1 block text-xs text-stone-500">Withhold Rate (%)</Label>
								<Input
									bind:value={withholdRate}
									type="number"
									min="0"
									max="100"
									class="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm focus:ring-2 focus:ring-stone-400 focus:outline-none"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Penalty -->
				<div class="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
					<div class="mb-4 flex items-center gap-3">
						<h2 class="text-xs font-semibold tracking-widest text-stone-400 uppercase">Penalty</h2>
						<label class="ml-auto flex cursor-pointer items-center gap-2">
							<span class="text-sm text-stone-600">Apply penalty?</span>
							<div class="relative">
								<input type="checkbox" bind:checked={hasPenalty} class="peer sr-only" />
								<div
									class="h-5 w-10 rounded-full bg-stone-200 transition-colors peer-checked:bg-stone-700"
								></div>
								<div
									class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
								></div>
							</div>
						</label>
					</div>
					{#if hasPenalty}
						<div class="grid grid-cols-2 gap-3">
							<div>
								<Label class="mb-1 block text-xs text-stone-500">Penalty Amount (ETB)</Label>
								<Input
									bind:value={penaltyAmount}
									type="number"
									min="0"
									step="0.01"
									class="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm focus:ring-2 focus:ring-red-300 focus:outline-none"
								/>
							</div>
							<div>
								<Label class="mb-1 block text-xs text-stone-500">Penalty Reason</Label>
								<Input
									bind:value={penaltyReason}
									placeholder="Reason for deduction"
									class="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm focus:ring-2 focus:ring-red-300 focus:outline-none"
								/>
							</div>
						</div>
					{:else}
						<p class="text-sm text-stone-400 italic">
							No penalty applied. Full contract amount will be requested.
						</p>
					{/if}
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="mt-6 flex justify-end gap-3">
				<Button onclick={printDocument}>
					<Printer />
					Print
				</Button>
			</div>
		</div>

		<!-- ── DOCUMENT PREVIEW ── -->
		<div class="mx-auto max-w-5xl px-6 pb-16">
			<div class="no-print mb-4">
				<span class="text-xs font-semibold tracking-widest text-stone-400 uppercase"
					>Document Preview</span
				>
			</div>
			<div
				id="payment-request-document"
				class="printable-area overflow-hidden rounded-2xl bg-white shadow-xl"
				style="font-family: 'DM Sans', sans-serif;"
			>
				<!-- Header Band -->
				<div class="flex items-start justify-between bg-stone-900 px-12 py-8 text-white">
					<div>
						<img src="/logo.webp" class="h-32 w-32 justify-self-start" alt="" />
						<p class="mb-1 text-xs tracking-widest text-stone-400 uppercase">Payment Request</p>
						<h1 class="text-2xl font-bold" style="font-family: 'Playfair Display', serif;">
							{companyName || 'Your Company Name'}
						</h1>
					</div>
					<div class="w-sm text-right">
						<p class="mb-1 text-xs tracking-widest text-stone-400 uppercase">Invoice No.</p>
						<p class="font-mono text-lg font-semibold text-white">{invoiceNumber || '—'}</p>
						<p class="mt-2 text-xs text-stone-400">{formatEthiopianDate(new Date(requestDate))}</p>
					</div>
				</div>

				<!-- Period Badge -->
				<div class="flex items-center gap-3 border-b border-amber-100 bg-amber-50 px-12 py-3">
					<svg class="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<span class="text-sm font-medium text-amber-800">
						Billing Period: <strong>{selectedMonth}</strong> ({MONTH_LABELS[selectedMonth]}) — Year {selectedYear}
					</span>
					{#if fsNumber}
						<span class="ml-auto text-xs text-amber-600">FS# {fsNumber}</span>
					{/if}
				</div>

				<div class="px-12 py-8">
					<!-- To / From -->
					<div class="mb-8 grid grid-cols-2 gap-8">
						<div>
							<p class="mb-2 text-xs font-semibold tracking-widest text-stone-400 uppercase">
								Bill To
							</p>
							<p class="text-base font-semibold text-stone-800">{customerName || '—'}</p>
							<p class="text-sm text-stone-500">{siteName || 'Site Name'}</p>
						</div>
						<div class="text-right">
							<p class="mb-2 text-xs font-semibold tracking-widest text-stone-400 uppercase">
								Contract Details
							</p>
							{#if contractDate}<p class="text-sm text-stone-600">Signed: {contractDate}</p>{/if}
							{#if contractStartDate && contractEndDate}
								<p class="text-sm text-stone-600">
									Period: {contractStartDate} → {contractEndDate}
								</p>
							{/if}
							<p class="text-sm text-stone-600">
								Monthly Amount: <span class="font-semibold"
									>ETB {fmt(Number(contractMonthlyAmount))}</span
								>
							</p>
						</div>
					</div>

					<!-- Divider -->
					<div class="my-6 border-t border-stone-100"></div>

					<!-- Line Items Table -->
					<table class="mb-2 w-full text-sm">
						<thead>
							<tr class="border-b border-stone-200">
								<th
									class="py-2 pr-4 text-left text-xs font-semibold tracking-widest text-stone-400 uppercase"
									>Description</th
								>
								<th
									class="py-2 text-right text-xs font-semibold tracking-widest text-stone-400 uppercase"
									>Amount (ETB)</th
								>
							</tr>
						</thead>
						<tbody>
							<tr class="border-b border-stone-50">
								<td class="py-3 pr-4 text-stone-700">
									Monthly service fee — {selectedMonth}
									{selectedYear}
									<span class="block text-xs text-stone-400">{siteName || 'Site'}</span>
								</td>
								<td class="py-3 text-right font-mono font-medium text-stone-800"
									>{fmt(Number(contractMonthlyAmount))}</td
								>
							</tr>
							{#if hasPenalty && penaltyAmount > 0}
								<tr class="border-b border-stone-50">
									<td class="py-3 pr-4 text-red-600">
										Penalty deduction
										{#if penaltyReason}<span class="block text-xs text-red-400"
												>{penaltyReason}</span
											>{/if}
									</td>
									<td class="py-3 text-right font-mono font-medium text-red-600"
										>− {fmt(penaltyAmount)}</td
									>
								</tr>
							{/if}
						</tbody>
					</table>

					<!-- Totals -->
					<div class="mt-4 flex justify-end">
						<div class="w-72 space-y-2">
							<div class="flex justify-between text-sm text-stone-600">
								<span>Request Amount</span>
								<span class="font-mono">{fmt(requestAmount)}</span>
							</div>
							<div class="flex justify-between text-sm text-stone-500">
								<span>Before VAT</span>
								<span class="font-mono">{fmt(beforeVat)}</span>
							</div>
							<div class="flex justify-between text-sm text-stone-500">
								<span>VAT ({vatRate}%)</span>
								<span class="font-mono">{fmt(vat)}</span>
							</div>
							<div class="flex justify-between text-sm text-stone-500">
								<span>Withholding ({withholdRate}%)</span>
								<span class="font-mono text-orange-600">− {fmt(withholdAmount)}</span>
							</div>
							<div
								class="flex justify-between border-t border-stone-200 pt-2 text-base font-semibold text-stone-800"
							>
								<span>Net Payment Due</span>
								<span class="font-mono text-stone-900">{fmt(paymentAmount)}</span>
							</div>
						</div>
					</div>

					<div class="my-8 border-t border-stone-100"></div>

					<!-- Signature & Footer -->
					<div class="grid grid-cols-2 gap-12">
						<div>
							<p class="mb-3 text-xs font-semibold tracking-widest text-stone-400 uppercase">
								Authorized By
							</p>
							<div class="mt-10 mb-2 w-48 border-b border-stone-300"></div>
							<p class="text-sm font-medium text-stone-700">
								{signingOfficer || 'Signing Officer'}
							</p>
							<p class="text-xs text-stone-400">{companyName || 'Company'}</p>
						</div>
						<div>
							<p class="mb-3 text-xs font-semibold tracking-widest text-stone-400 uppercase">
								Received By
							</p>
							<div class="mt-10 mb-2 w-48 border-b border-stone-300"></div>
							<p class="text-sm text-stone-400">Name & Stamp</p>
							<p class="text-xs text-stone-400">{customerName || 'Client'}</p>
						</div>
					</div>

					<!-- Note -->
					<div class="mt-8 rounded-xl bg-stone-50 p-4 text-xs leading-relaxed text-stone-500">
						<strong class="text-stone-600">Note:</strong> This payment request is issued pursuant to
						the service contract
						{#if contractDate}dated {contractDate}{/if}
						between {companyName} and {customerName}. Please process payment within the agreed
						terms. All amounts are in Ethiopian Birr (ETB). Withholding tax certificate to be
						provided upon payment.
					</div>
				</div>

				<!-- Footer Band -->
				<div
					class="flex items-center justify-between border-t border-stone-200 bg-stone-100 px-12 py-4 text-xs text-stone-400"
				>
					<span>{companyName || 'Company Name'}</span>
					<span>Generated {formatEthiopianDate(new Date())}</span>
				</div>
			</div>
			<Button onclick={printDocument}>
				<Printer />
				Print
			</Button>
		</div>
	</div>
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
