<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	import { Loader, Plus, CircleCheckBig, OctagonMinus } from '@lucide/svelte';
	let { children } = $props();
</script>

<div class="mb-8 flex flex-row items-center justify-start gap-2">
	<Button
		variant={page.url.pathname === '/dashboard/employees/leaves/pending' ? 'default' : 'outline'}
		href="/dashboard/employees/leaves/pending"><Loader /> Pending Leaves</Button
	>
	<Button
		variant={page.url.pathname === '/dashboard/employees/leaves/approved' ? 'default' : 'outline'}
		href="/dashboard/employees/leaves/approved"><CircleCheckBig /> Approved Leaves</Button
	>
	<Button
		variant={page.url.pathname === '/dashboard/employees/leaves/cancelled' ? 'default' : 'outline'}
		href="/dashboard/employees/leaves/cancelled"><OctagonMinus /> Cancelled Leaves</Button
	>
</div>

{@render children()}
