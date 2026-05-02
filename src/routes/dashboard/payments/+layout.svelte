<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	import { Loader, Plus, CircleCheckBig, OctagonMinus } from '@lucide/svelte';
	let { children } = $props();
</script>

<div class="mb-8 flex flex-row items-center justify-start gap-2">
	<Button
		variant={page.url.pathname === '/dashboard/payments/add-payment' ? 'default' : 'outline'}
		href="/dashboard/payments/add-payment"><Plus /> Add New Payment Collection</Button
	>
	<Button
		variant={page.url.pathname === '/dashboard/payments/pending' ? 'default' : 'outline'}
		href="/dashboard/payments/pending"><Loader /> Pending Payments</Button
	>
	<Button
		variant={page.url.pathname === '/dashboard/payments/approved' ? 'default' : 'outline'}
		href="/dashboard/payments/approved"><CircleCheckBig /> Approved Payments</Button
	>

	<Button
		variant={page.url.pathname === '/dashboard/payments/cancelled' ? 'default' : 'outline'}
		href="/dashboard/payments/cancelled"><OctagonMinus /> Cancelled Payments</Button
	>
</div>

{@render children()}
