<script>
	import { page } from "$app/state";
    import Button from "$lib/components/ui/button/button.svelte"; 
	// import DialogComp from "$lib/formComponents/DialogComp.svelte";
	// import AddCustomer from "$lib/forms/AddCustomer.svelte";
	import { Plus } from "@lucide/svelte";
  let { data, children } = $props()

</script>

<div class="flex flex-row gap-2 justify-start items-center mb-8">
    <Button href="/dashboard/supplies/add-supplies" 
    variant = {page.url.pathname === '/dashboard/supplies/add-supplies' ? 'default': 'outline' }  ><Plus /> Add Supplies</Button>
    <!-- <DialogComp title="Add New Customer" {content} /> -->
</div>

<!-- {#snippet content()}

  <AddCustomer data={data?.form} action="/dashbaord/customers?/addCustomer" />
    
{/snippet} -->

{@render children?.()}