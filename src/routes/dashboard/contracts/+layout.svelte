<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	import { Plus, Sheet } from '@lucide/svelte';
	let { children } = $props();
</script>

<div class="mb-8 flex flex-row flex-wrap items-center justify-start gap-2">
	<Button
		href="/dashboard/contracts/add-contract"
		variant={page.url.pathname === '/dashboard/contracts/add-contract' ? 'default' : 'outline'}
		><Plus /> Add New Contract</Button
	>
	<Button
		href="/dashboard/contracts"
		variant={page.url.pathname === '/dashboard/contracts' ? 'default' : 'outline'}
		><Sheet /> Active Contracts</Button
	>
	<Button
		href="/dashboard/contracts/inactive"
		variant={page.url.pathname === '/dashboard/contracts/inactive' ? 'destructive' : 'outline'}
		class={page.url.pathname === '/dashboard/contracts/inactive' ? '' : 'text-destructive'}
		><Sheet /> Inactive Contracts</Button
	>
	<Button
		href="/dashboard/contracts/terminated"
		variant={page.url.pathname === '/dashboard/contracts/terminated' ? 'destructive' : 'outline'}
		class={page.url.pathname === '/dashboard/contracts/terminated' ? '' : 'text-destructive'}
		><Sheet /> Terminated Contracts</Button
	>
</div>

{@render children()}
