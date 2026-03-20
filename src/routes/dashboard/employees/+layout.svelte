<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	import { Calendar, List, Plus, Sheet } from '@lucide/svelte';
	let { children } = $props();
</script>

<div class="mb-8 flex flex-row flex-wrap items-center justify-start gap-2">
	<Button
		href="/dashboard/employees/sites"
		variant={page.url.pathname === '/dashboard/employees/add-employee' ? 'default' : 'outline'}
		><List /> Site List</Button
	>
	<Button
		href="/dashboard/employees"
		variant={page.url.pathname === '/dashboard/employees' ? 'default' : 'outline'}
		><Sheet />All Active Employees</Button
	>
	<Button
		href="/dashboard/employees/inactive"
		variant={page.url.pathname === '/dashboard/employees/inactive' ? 'destructive' : 'outline'}
		class={page.url.pathname === '/dashboard/employees/inactive' ? '' : 'text-destructive'}
		><Sheet />All Inactive Employees</Button
	>
	<Button
		href="/dashboard/employees/add-employee"
		variant={page.url.pathname === '/dashboard/employees/add-employee' ? 'default' : 'outline'}
		><Plus /> Add New Employee</Button
	>
	<Button
		href="/dashboard/employees/attendance"
		variant={page.url.pathname === '/dashboard/employees/attendance' ? 'default' : 'outline'}
		><Calendar /> Attendance</Button
	>
</div>

{@render children()}
