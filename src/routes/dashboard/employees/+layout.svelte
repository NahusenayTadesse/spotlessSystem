<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	import { Plus } from '@lucide/svelte';
	let { children } = $props();
</script>

<div class="mb-8 flex flex-row items-center justify-start gap-2">
	<Button
		href="/dashboard/employees/add-employee"
		variant={page.url.pathname === '/dashboard/employees/add-employee' ? 'default' : 'outline'}
		><Plus /> Add Employee</Button
	>
</div>

{@render children()}
