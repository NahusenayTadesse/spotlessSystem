<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	import { List, Plus, Sheet } from '@lucide/svelte';
	let { children } = $props();
	const isSalaryHistoryPage = $derived(
		page.url.pathname.startsWith('/dashboard/salary/paid-salaries') &&
			!page.url.pathname.includes('/dashboard/salary/add-payroll')
	);
</script>

<div class="mb-8 flex flex-row flex-wrap items-center justify-start gap-2">
	<Button
		href="/dashboard/salary/add-payroll/sites"
		variant={page.url.pathname === '/dashboard/salary/add-payroll/sites' ? 'default' : 'outline'}
		><List /> Site List</Button
	>
	<Button href="/dashboard/salary" variant={isSalaryHistoryPage ? 'default' : 'outline'}
		><Sheet /> Paid Salary History</Button
	>
	<Button
		href="/dashboard/salary/add-payroll"
		variant={page.url.pathname.includes('/dashboard/salary/add-payroll') &&
		!page.url.pathname.endsWith('sites')
			? 'default'
			: 'outline'}><Sheet /> Unpaid Salaries</Button
	>

	<Button
		href="/dashboard/salary/add-overtime"
		variant={page.url.pathname.startsWith('/dashboard/salary/add-overtime') ? 'default' : 'outline'}
		><Sheet /> All Overtime</Button
	>
	<Button
		href="/dashboard/salary/add-deductions"
		variant={page.url.pathname.startsWith('/dashboard/salary/add-deduction')
			? 'default'
			: 'outline'}><Sheet /> All Deductions</Button
	>

	<Button
		href="/dashboard/salary/tax-types"
		variant={page.url.pathname === '/dashboard/salary/tax-types' ? 'default' : 'outline'}
		><Sheet /> Tax Types</Button
	>
	<Button
		href="/dashboard/salary/overtime-types"
		variant={page.url.pathname === '/dashboard/salary/overtime-types' ? 'default' : 'outline'}
		><Sheet /> Overtime Types</Button
	>
	<Button
		href="/dashboard/salary/transactions"
		variant={page.url.pathname === '/dashboard/salary/transactions' ? 'default' : 'outline'}
		><Sheet /> Transactions</Button
	>
</div>

{@render children()}
