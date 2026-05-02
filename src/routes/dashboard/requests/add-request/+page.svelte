<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { formatETB, formatEthiopianDate } from '$lib/global.svelte.js';
	import { FileText, ImageIcon, FileImage, Loader2, Save } from '@lucide/svelte';
	import MonthYear from '$lib/formComponents/MonthYear.svelte';
	import ComboboxComp from '$lib/formComponents/ComboboxComp.svelte';
	import { toPng } from 'html-to-image';
	import jsPDF from 'jspdf';

	let { data } = $props();

	// --- State Management ---
	let monthYear = $state('');
	let requestor = $state<number>();
	let authorizer = $state<number>();
	let isExporting = $state(false);

	// --- Derived UI Logic ---

	const [m, y] = $derived(monthYear.split('_'));
	let selectedMonth = $derived(m || '---');
	let selectedYear = $derived(y || '---');

	// --- Calculations & Generators ---
	const generateUniqueInvoiceNo = (siteId: number) => {
		const prefix = 'INV';
		const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
		return `${prefix}-${siteId}-${datePart}-${Math.floor(1000 + Math.random() * 9000)}`;
	};

	const calculateSiteTotals = (siteId: number) => {
		const siteContracts = data.contracts.filter((c) => c.siteId === siteId);
		const subtotal = siteContracts.reduce((sum, c) => sum + (Number(c.monthlyAmount) || 0), 0);

		const vatRate = Number(data.vats.vat) / 100;
		const withholdRate = Number(data.vats.withHold) / 100;

		// Assuming the monthlyAmount in DB is inclusive of VAT
		const beforeVat = subtotal / (1 + vatRate);
		const vatAmount = subtotal - beforeVat;
		const withholdAmount = beforeVat * withholdRate;
		const finalPayable = subtotal - withholdAmount;

		return { subtotal, vatAmount, withholdAmount, finalPayable };
	};

	const fmt = (n: number) =>
		n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	// --- Export Logic ---
	const downloadAllPDF = async () => {
		const elements = document.querySelectorAll('.invoice-page');
		if (elements.length === 0) return;

		isExporting = true;
		try {
			const pdf = new jsPDF('p', 'mm', 'a4');

			for (let i = 0; i < elements.length; i++) {
				const el = elements[i] as HTMLElement;
				const dataUrl = await toPng(el, { pixelRatio: 2, backgroundColor: '#fff' });

				const imgProps = pdf.getImageProperties(dataUrl);
				const pdfWidth = pdf.internal.pageSize.getWidth();
				const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

				if (i > 0) pdf.addPage();
				pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
			}

			pdf.save(`Batch-Invoices-${selectedMonth}-${selectedYear}.pdf`);
		} catch (err) {
			console.error('Export failed', err);
		} finally {
			isExporting = false;
		}
	};

	const downloadAllSeparate = async (format: 'pdf' | 'png') => {
		const elements = document.querySelectorAll('.invoice-page');
		if (elements.length === 0) return;

		isExporting = true;

		for (let i = 0; i < elements.length; i++) {
			const el = elements[i] as HTMLElement;

			// Extract Site Name from the data attribute we'll add to the HTML
			const siteName = el.getAttribute('data-sitename') || 'Site';
			const fileName = `${siteName}-${selectedMonth}-${selectedYear}`;

			try {
				const dataUrl = await toPng(el, { pixelRatio: 2, backgroundColor: '#fff' });

				if (format === 'png') {
					const link = document.createElement('a');
					link.download = `${fileName}.png`;
					link.href = dataUrl;
					link.click();
				} else {
					const pdf = new jsPDF('p', 'mm', 'a4');
					const imgProps = pdf.getImageProperties(dataUrl);
					const pdfWidth = pdf.internal.pageSize.getWidth();
					const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

					pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
					pdf.save(`${fileName}.pdf`);
				}

				// Small delay to prevent browser download blocking
				await new Promise((resolve) => setTimeout(resolve, 500));
			} catch (err) {
				console.error(`Export failed for ${siteName}:`, err);
			}
		}
		isExporting = false;
	};

	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { add } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import FormCard from '$lib/formComponents/FormCard.svelte';
	import InputComp from '$lib/formComponents/InputComp.svelte';
	import Errors from '$lib/formComponents/Errors.svelte';
	import { flattenDiagnosticMessageText } from 'typescript';
	import { toast } from 'svelte-sonner';

	const { form, errors, enhance, message, delayed, allErrors } = superForm(data.form, {
		taintedMessage: () => {
			return new Promise((resolve) => {
				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
			});
		},
		validators: zod4Client(add),
		dataType: 'json'
	});

	$effect(() => {
		if ($message) {
			if ($message.type === 'error') {
				toast.error($message.text);
			} else {
				toast.success($message.text);
			}
		}
	});

	let disabled = $derived(!$form.month || !$form.requestor);
</script>

<svelte:head>
	<title>Bulk Invoice Generator</title>
</svelte:head>

<div class="min-h-screen bg-zinc-50 p-4 lg:p-8 dark:bg-zinc-950">
	<!-- Control Panel -->
	<header
		class="mx-auto mb-8 max-w-6xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
	>
		<div class="flex flex-wrap items-center justify-between gap-6">
			<div>
				<h1 class="text-2xl font-black tracking-tight">Invoice Generator</h1>
				<p class="text-sm text-zinc-500">Generate and batch export site invoices.</p>
			</div>

			<form use:enhance method="post" action="?/request" id="request" enctype="multipart/form-data">
				<Errors allErrors={$allErrors} />
				{#if $message}
					<p class="text-sm text-zinc-500">{@html $message.text}</p>
				{/if}
				<InputComp {form} {errors} type="hidden" label="" name="contracts" />
				<InputComp {form} {errors} type="date" label="Request Date" name="requestDate" />
				<div>
					<MonthYear bind:value={$form.month} />
					<InputComp type="hidden" label="Month" name="month" {form} {errors} required />
				</div>
				<InputComp type="hidden" label="" name="invoiceNumbers" {form} {errors} />
				<InputComp type="hidden" label="" name="penalityAmounts" {form} {errors} />

				<InputComp
					type="combo"
					label="Requestor"
					name="requestor"
					{form}
					{errors}
					items={data?.employees}
				/>
				<InputComp type="hidden" label="" name="vat" {form} {errors} />
				<InputComp type="hidden" label="" name="withhold" {form} {errors} />

				<!-- <div class="flex items-end gap-4">
				<div class="grid gap-1.5">
					<Label class="text-[10px] font-bold uppercase">Billing Period</Label>
					<MonthYear bind:value={monthYear} />
				</div>
				<div class="grid w-48 gap-1.5">
					<Label class="text-[10px] font-bold uppercase">Requestor</Label>
					<ComboboxComp items={data?.employees} name="requestor" bind:value={requestor} />
				</div>
				<!-- <div class="grid w-48 gap-1.5">
					<Label class="text-[10px] font-bold uppercase">Authorizer</Label>
					<ComboboxComp items={data?.employees} name="authorizer" bind:value={authorizer} />
				</div> -->
				<!--
				<Button
					disabled={disabled || isExporting}
					onclick={downloadAllPDF}
					class="bg-zinc-900 text-white hover:bg-zinc-800"
				>
					{#if isExporting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Processing...
					{:else}
						<FileText class="mr-2 h-4 w-4" />
						Export All PDF
					{/if}
				</Button>  -->

				<Button
					type="submit"
					{disabled}
					title={disabled ? 'Form is invalid' : 'Save Request'}
					class="w-full"
					form="request"
					variant="default"
				>
					{#if $delayed}
						<LoadingBtn name="Saving Changes" />
					{:else}
						<Save class="h-4 w-4" />
						Save Request
					{/if}
				</Button>
			</form>
		</div>
	</header>

	<!-- Invoices Preview -->
	<div class="flex flex-col items-center gap-16 pb-20">
		{#each data?.sitesList as site, index}
			{@const totals = calculateSiteTotals(site.value)}
			{@const invNo = generateUniqueInvoiceNo(site.value)}

			<div class="grid w-lg gap-1.5">
				<Label class="text-[10px] font-bold uppercase">Penality</Label>
				<Input type="number" name="penalityAmounts" bind:value={$form.penalityAmounts[index]} />
			</div>

			<section
				class="invoice-page relative w-full max-w-212.5 bg-white p-16 text-zinc-800 shadow-2xl"
				data-sitename={site.name.replace(/\s+/g, '-')}
			>
				<!-- Header -->
				<div class="mb-12 flex items-start justify-between">
					<div class="flex items-center gap-4">
						<div class="flex h-18 w-18 items-center justify-center rounded-xl bg-zinc-900">
							<img src="/logo.webp" class="h-16 w-16" alt="Logo" />
						</div>
						<div>
							<h2 class="text-2xl font-black tracking-tighter uppercase">Spotless</h2>
							<p class="text-[10px] font-medium tracking-widest text-zinc-500 uppercase">
								General Trading PLC
							</p>
						</div>
					</div>
					<div class="text-right">
						<div
							class="mb-2 inline-block bg-zinc-900 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase"
						>
							Invoice
						</div>
						<p class="text-sm font-bold">{$form.invoiceNumbers[index]}</p>
						<p class="text-[10px] text-zinc-400">
							{formatEthiopianDate(new Date($form.requestDate))}
						</p>
					</div>
				</div>

				<!-- Client Info -->
				<div class="mb-10 grid grid-cols-1 gap-12 border-y border-zinc-100 py-8">
					<div class="flex gap-2">
						<p class="mb-2 text-[10px] font-bold text-zinc-400 uppercase">To:</p>
						<p class="text-lg font-extrabold underline">{site.customerName} ({site.name})</p>
						<!-- <p class="text-sm text-zinc-600">{site.name} Site</p> -->
					</div>
					<div class="">
						<!-- <p class="mb-2 text-[10px] font-bold text-zinc-400 uppercase">Period</p> -->
						<p class="text-sm font-semibold">
							ድርጅታችን ለድርጅታቹ ከታች የተደረደሩትን {data?.contracts.filter((c) => c.siteId === site.value)
								.length === 1
								? 'አገልግሎት'
								: 'አገልግሎቶች'} እየሰጠ መሆኑ ይታወቃል። በዚሁ መሰረት የ
							<span class="font-bold">{$form.month.split('_')[0]} </span> ወር/ጊዜ
							<span class="font-bold">{$form.month.split('_')[1]} </span> ወርሃዊ/የአንድ ጊዜ ክፍያ ወርሃዊ/የአንድ ጊዜ
							ክፍያ እንደሚከተለው እንጠ ይቃለን፡፡
						</p>
					</div>
				</div>

				<!-- Items Table -->
				<table class="mb-10 w-full">
					<thead>
						<tr class="border-b-2 border-zinc-900 text-left text-[10px] font-black uppercase">
							<th class="pb-3">Service Description</th>
							<th class="pb-3 text-right">Rate (ETB)</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-zinc-100 text-sm">
						{#each data?.contracts.filter((c) => c.siteId === site.value) as contract}
							<tr>
								<td class="py-5">
									<span class="font-bold">{contract.serviceName || 'Maintenance Service'}</span>
								</td>
								<td class="py-5 text-right font-semibold">
									{formatETB(Number(contract.monthlyAmount), true)}</td
								>
							</tr>
						{/each}
						<!-- {#if $form.penalityAmounts[index] !== 0}
							<tr>
								<td class="py-5 font-bold">Penality Amount </td>
								<td class="py-5 text-right font-semibold"
									>ETB {fmt($form.penalityAmounts[index])}
								</td>
							</tr>
						{/if} -->
					</tbody>
				</table>

				<!-- Totals -->
				<div class="ml-auto w-80 space-y-3 rounded-2xl bg-zinc-50 p-8">
					<div class="flex justify-between text-xs text-zinc-400 italic">
						<span>Withholding ({fmt(Number(data.vats.vat))}%)</span>
						<span>-{formatETB(totals.vatAmount, true)}</span>
					</div>
					<div class="flex justify-between text-xs text-zinc-400 italic">
						<span>Withholding ({fmt(Number(data.vats.withHold))}%)</span>
						<span>-{formatETB(totals.withholdAmount, true)}</span>
					</div>
					<div class="flex justify-between text-xs">
						<span class="text-zinc-500">Subtotal (Inc. VAT)</span>
						<span class="font-bold">{formatETB(totals.subtotal, true)}</span>
					</div>
					{#if $form.penalityAmounts[index] !== 0}
						<div class="flex justify-between text-xs">
							<span class="text-zinc-500">Penality</span>
							<span class="font-bold">{formatETB($form.penalityAmounts[index], true)}</span>
						</div>
					{/if}
					<div class="flex items-center justify-between border-t border-zinc-200 pt-4">
						<span class="text-xs font-bold uppercase">Total Payable</span>
						<span class="text-2xl font-black text-zinc-900">
							{formatETB(totals.finalPayable - $form.penalityAmounts[index], true)}</span
						>
					</div>
				</div>

				<!-- Signatures -->
				<div class="mt-20 grid grid-cols-2 gap-20">
					<div class="flex flex-col items-center">
						<div
							class="relative flex h-24 w-full items-center justify-center border-b border-zinc-200"
						>
							{#if data?.employees?.find((e) => e.value === $form.requestor)?.signiture}
								<img
									src="/dashboard/files/{data.employees.find((e) => e.value === $form.requestor)
										.signiture}"
									class="max-h-full mix-blend-multiply"
									alt="signature"
								/>
							{/if}
						</div>
						<p class="mt-4 text-[10px] font-bold uppercase">Requested By</p>
						<p class="text-[10px] text-zinc-500 italic">
							{data.employees.find((e) => e.value === $form.requestor)?.name || '---'}
						</p>
					</div>

					<div class="flex flex-col items-center">
						<div
							class="relative flex h-24 w-full items-center justify-center border-b border-zinc-200"
						>
							<!-- {#if data?.employees?.find((e) => e.value === authorizer)?.signiture}
								<img
									src="/dashboard/files/{data.employees.find((e) => e.value === authorizer)
										.signiture}"
									class="max-h-full mix-blend-multiply"
									alt="signature"
								/>
							{/if} -->
						</div>
						<p class="mt-4 text-[10px] font-bold uppercase">Authorized By</p>
						<p class="text-[10px] text-zinc-500 italic">
							<!-- {data.employees.find((e) => e.value === authorizer)?.name || '---'} -->
						</p>
					</div>
				</div>

				<!-- Footer -->
				<div class="mt-16 text-center text-[9px] tracking-widest text-zinc-400 uppercase">
					Spotless General Trading PLC • Addis Ababa, Ethiopia • Thank you for your business
				</div>
			</section>
		{/each}
	</div>
</div>

<style>
	/* Ensures high quality export */
	:global(.invoice-page) {
		font-family: 'Inter', system-ui, sans-serif;
		line-height: 1.5;
	}

	@media print {
		.invoice-page {
			box-shadow: none !important;
			margin: 0 !important;
		}
	}
</style>
