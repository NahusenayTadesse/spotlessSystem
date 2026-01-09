<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	// import DialogComp from "$lib/formComponents/DialogComp.svelte";
	// import AddCustomer from "$lib/forms/AddCustomer.svelte";
	import { Plus, Sheet } from '@lucide/svelte';
	let { children } = $props();
</script>

<div class="mb-8 flex flex-row flex-wrap items-center justify-start gap-2">
	<Button
		href="/dashboard/supplies"
		variant={page.url.pathname === '/dashboard/supplies' ? 'default' : 'outline'}
		><Sheet /> All Supplies</Button
	>
	<Button
		href="/dashboard/supplies/add-supplies"
		variant={page.url.pathname === '/dashboard/supplies/add-supplies' ? 'default' : 'outline'}
		><Plus /> Add Supplies</Button
	>
	<Button
		href="/dashboard/supplies/suppliers"
		variant={page.url.pathname === '/dashboard/supplies/suppliers' ? 'default' : 'outline'}
		><Sheet />Suppliers</Button
	>
	<Button
		href="/dashboard/supplies/suppliers/add-suppliers"
		variant={page.url.pathname === '/dashboard/supplies/suppliers/add-suppliers'
			? 'default'
			: 'outline'}><Sheet />Add Suppliers</Button
	>

	<!-- <DialogComp title="Add New Customer" {content} /> -->
</div>

<!-- {#snippet content()}

  <AddCustomer data={data?.form} action="/dashbaord/customers?/addCustomer" />

{/snippet} -->

{@render children?.()}
