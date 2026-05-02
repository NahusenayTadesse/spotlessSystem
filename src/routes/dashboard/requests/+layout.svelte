<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	import { Loader, Plus, CircleCheckBig, OctagonMinus } from '@lucide/svelte';
	let { children } = $props();
</script>

<div class="mb-8 flex flex-row items-center justify-start gap-2">
	<Button
		variant={page.url.pathname === '/dashboard/requests/add-request' ? 'default' : 'outline'}
		href="/dashboard/requests/add-request"><Plus /> Add New Request</Button
	>
	<Button
		variant={page.url.pathname === '/dashboard/requests/pending' ? 'default' : 'outline'}
		href="/dashboard/requests/pending"><Loader /> Pending Requests</Button
	>
	<Button
		variant={page.url.pathname === '/dashboard/requests/approved' ? 'default' : 'outline'}
		href="/dashboard/requests/approved"><CircleCheckBig /> Approved Requests</Button
	>

	<Button
		variant={page.url.pathname === '/dashboard/requests/cancelled' ? 'default' : 'outline'}
		href="/dashboard/requests/cancelled"><OctagonMinus /> Cancelled Requests</Button
	>
</div>

{@render children()}
