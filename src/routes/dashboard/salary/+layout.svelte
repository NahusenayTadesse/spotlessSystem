<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	import { Plus, Sheet } from '@lucide/svelte';
	let { children } = $props();
</script>

<div class="mb-8 flex flex-row items-center justify-start gap-2">
	<Button
		href="/dashboard/salary"
		variant={page.url.pathname === '/dashboard/salary' ? 'default' : 'outline'}
		><Sheet /> Paid Salary History</Button
	>
	<Button
		href="/dashboard/salary/add-payroll"
		variant={page.url.pathname === '/dashboard/salary/add-payroll' ? 'default' : 'outline'}
		><Sheet /> Unpaid Salaries</Button
	>
</div>

{@render children()}
