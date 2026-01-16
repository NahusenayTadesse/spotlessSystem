<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	import { Plus, Sheet } from '@lucide/svelte';
	let { children } = $props();
</script>

<div class="mb-8 flex flex-row items-center justify-start gap-2">
	<Button
		href="/dashboard/employees/add-employee"
		variant={page.url.pathname === '/dashboard/employees/add-employee' ? 'default' : 'outline'}
		><Plus /> Add Employee</Button
	>
	<Button
		href="/dashboard/employees"
		variant={page.url.pathname === '/dashboard/employees' ? 'default' : 'outline'}
		><Sheet /> Active Employees</Button
	>
	<Button
		href="/dashboard/employees/inactive"
		variant={page.url.pathname === '/dashboard/employees/inactive' ? 'destructive' : 'outline'}
		class={page.url.pathname === '/dashboard/employees/inactive' ? '' : 'text-destructive'}
		><Sheet /> Inactive Employees</Button
	>
</div>

{@render children()}
