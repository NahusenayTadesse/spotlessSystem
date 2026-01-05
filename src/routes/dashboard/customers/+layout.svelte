<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import DialogComp from '$lib/formComponents/DialogComp.svelte';
	import AddCustomer from '$lib/forms/AddCustomer.svelte';
	import { Sheet } from '@lucide/svelte';
	let { data, children } = $props();
</script>

<div class="mb-8 flex flex-row items-center justify-start gap-2">
	<Button href="/dashboard/customers"><Sheet /> All Customers</Button>
	<Button href="/dashboard/customers/add-customer"><Sheet /> Add Customers</Button>

	<DialogComp title="Add New Customer" {content} />
</div>

{#snippet content()}
	<AddCustomer data={data?.form} action="/dashboard/customers?/addCustomer" />
{/snippet}

{@render children?.()}
