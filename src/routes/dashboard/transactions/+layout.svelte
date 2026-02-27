<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	import { Plus, Sheet } from '@lucide/svelte';
	let { children } = $props();
</script>

<div class="mb-8 flex flex-row items-center justify-start gap-2">
	<Button
		href="/dashboard/transactions/expenses/add-expense"
		variant={page.url.pathname === '/dashboard/transactions/expenses/add-expense'
			? 'default'
			: 'outline'}><Plus /> Add Expense</Button
	>
	<Button
		href="/dashboard/transactions/expenses/add-expense"
		variant={page.url.pathname === '/dashboard/transactions/expenses/add-expense'
			? 'default'
			: 'outline'}><Plus /> Add Expense</Button
	>
	<Button
		href="/dashboard/transactions/expenses/add-expense-category"
		variant={page.url.pathname === '/dashboard/transactions/expenses/add-expense-category'
			? 'default'
			: 'outline'}><Plus /> Add Expense Category</Button
	>
</div>

{@render children()}
