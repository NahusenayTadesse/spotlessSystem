<script lang="ts">
	import { columns } from './columns';

	let { data } = $props();

	import DataTable from '$lib/components/Table/data-table.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	import { BanknoteArrowUp, Frown, Loader } from '@lucide/svelte';
	import DateMonth from '$lib/formComponents/DateMonth.svelte';
	import Filter from '$lib/components/Table/FilterMenu.svelte';
	import InputComp from '$lib/formComponents/InputComp.svelte';
	let filteredList = $derived(data?.payrollData);

	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { payrollSchema as schema, type EmployeeFormType } from './schema';
	import { superForm } from 'sveltekit-superforms/client';
	import Errors from '$lib/formComponents/Errors.svelte';
	import type { Snapshot } from '@sveltejs/kit';

	const { form, errors, enhance, delayed, allErrors, capture, restore, message } = superForm(
		data.form,
		{
			validators: zod4Client(schema),
			dataType: 'json'
		}
	);

	export const snapshot: Snapshot = { capture, restore };

	import { toast } from 'svelte-sonner';
	import FormCard from '$lib/formComponents/FormCard.svelte';
	import PayrollTotals from './payroll-totals.svelte';
	$effect(() => {
		if ($message) {
			if ($message.type === 'error') {
				toast.error($message.text);
			} else {
				toast.success($message.text);
			}
		}
	});

	$form.start = data?.start;
	$form.end = data?.end;

	$effect(() => {
		if (filteredList.length > 0) {
			$form.employees = filteredList.map(
				(emp): EmployeeFormType => ({
					...emp,
					// Ensure numeric fields from LEFT JOINs aren't null
					id: emp.id,
					positionAllowance: emp.positionAllowance ?? 0,
					housingAllowance: emp.housingAllowance ?? 0,
					transportAllowance: emp.transportAllowance ?? 0,
					nonTaxable: emp.nonTaxable ?? 0,
					overtime: emp.overtime ?? 0,
					bonus: emp.bonus ?? 0,
					paymentMethodId: emp.paymentMethodId ?? null,
					absent: emp.absent ?? 0,
					attendancePenality: emp.attendancePenality ?? 0,
					commission: emp.commission ?? 0,
					deductions: emp.deductions ?? 0,
					gross: emp.gross ?? 0,
					taxable: emp.taxable ?? 0,
					taxAmount: Number(emp.taxAmount) ?? 0,
					netPay: emp.netPay ?? 0,
					// Ensure strings aren't null if the schema doesn't allow it
					account: emp.account ?? '',
					employmentStatus: emp.employmentStatus ?? ''
				})
			);
		}
	});

	const calculateTotal = (employees: any[], key: keyof EmployeeFormType): number => {
		// If employees hasn't been populated by the effect yet, return 0
		if (!employees || !Array.isArray(employees)) return 0;

		const total = employees.reduce((sum, emp) => {
			const value = emp[key];
			// Cast to number just in case they are stringified numbers from an input
			const numValue = typeof value === 'string' ? parseFloat(value) : value;
			return sum + (typeof numValue === 'number' && !isNaN(numValue) ? numValue : 0);
		}, 0);

		return Math.round(total * 100) / 100;
	};

	let totals = $derived({
		gross: calculateTotal(filteredList, 'gross'),
		tax: calculateTotal(filteredList, 'taxAmount'),
		penalty: calculateTotal(filteredList, 'attendancePenality'),
		netPay: calculateTotal(filteredList, 'netPay'),
		overtime: calculateTotal(filteredList, 'overtime')
	});

	import MonthYear from '$lib/formComponents/MonthYear.svelte';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import DialogComp from '$lib/formComponents/DialogComp.svelte';
	import { formatETB, formatEthiopianYearMonth } from '$lib/global.svelte';
</script>

<svelte:head>
	<title>UnPaid Salaries</title>
</svelte:head>

{#await data?.payrollData}
	<div class="flex justify-center p-10">
		<Loader class="animate-spin" />
	</div>
{:then payrollData}
	{#if data.payrollData.length === 0}
		<div class="flex h-96 w-5xl flex-col items-center justify-center">
			<p class="justify-self-cente mt-4 flex flex-row gap-4 text-center text-4xl">
				<Frown class="h-12 w-16  animate-bounce" />

				Transactions is Empty for this Date Range Choose Another Range
			</p>
			<DateMonth start={data?.start} end={data?.end} link="/dashboard/salary/add-payroll" />
		</div>
	{:else}
		{$form?.employees[2]?.paymentMethodId}
		<DialogComp
			title="Finalise Payroll for Filtered Employees {filteredList?.length}"
			variant="default"
			IconComp={BanknoteArrowUp}
		>
			<Errors allErrors={$allErrors} />
			<div class="w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
				<h3 class="mb-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
					Payroll Summary
				</h3>

				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span class="text-slate-600">Gross Pay </span>
						<span class="font-medium text-slate-900">{formatETB(totals.gross)}</span>
					</div>

					<div class="flex justify-between">
						<span class="text-slate-600">Overtime</span>
						<span class="font-medium text-emerald-600">+{formatETB(totals.overtime)}</span>
					</div>

					<div class="flex justify-between border-b border-slate-100 pb-2">
						<span class="text-slate-600">Tax & Penalties</span>
						<span class="font-medium text-rose-600">
							-{formatETB(totals.tax + totals.penalty)}
						</span>
					</div>

					<div class="flex justify-between pt-1">
						<span class="font-bold text-slate-900">Net Pay</span>
						<span class="text-base font-bold text-indigo-600">
							{formatETB(totals.netPay)}
						</span>
					</div>
				</div>
			</div>
			<form
				method="POST"
				action="?/runPayroll"
				use:enhance
				class="flex w-full flex-col gap-2"
				enctype="multipart/form-data"
				id="payroll"
			>
				<InputComp type="hidden" label="" name="start" {form} {errors} />
				<InputComp type="hidden" label="" name="end" {form} {errors} />
				<InputComp type="hidden" label="Month" name="month" {form} {errors} required />
				<MonthYear bind:value={$form.month} />

				<InputComp label="" type="hidden" name="employees" {form} {errors} />
				<InputComp label="Payment Date" type="date" name="paymentDate" {form} {errors} />
				<InputComp
					label="Upload Bank Statement"
					type="file"
					name="reciept"
					{form}
					{errors}
					placeholder="Upload a pdf or image of bank statemeent"
				/>

				<Button form="payroll" type="submit" class="text-md px-2 py-6">
					{#if $delayed}
						<LoadingBtn name="Finalising Payroll" />
					{:else}
						<BanknoteArrowUp class="size-6" />
						Finalise Payroll for Filtered Employees {filteredList?.length}
					{/if}
				</Button>
			</form>
		</DialogComp>
		<div class="mt-4 flex flex-col gap-4">
			<h2 class="my-4 text-2xl">No of Salaries {filteredList?.length}</h2>
			<DateMonth start={data?.start} end={data?.end} link="/dashboard/salary/add-payroll" />
			<PayrollTotals {totals} />
			<Filter
				data={data?.payrollData}
				bind:filteredList
				filterKeys={[
					'employmentStatus',
					'absent',
					'bank',
					'department',
					'overtime',
					'basicSalary',
					'housingAllowance',
					'transportAllowance',
					'positionAllowance'
				]}
			/>

			<DataTable data={filteredList} class="w-6xl!" {columns} fileName="Bank Accounts" />
		</div>
	{/if}
{:catch}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<h1 class="text-red-500">Unexpected Error: Reload</h1>
	</div>
{/await}
