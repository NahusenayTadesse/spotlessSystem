<script>
	import { page } from "$app/state";
    import Button from "$lib/components/ui/button/button.svelte"; 
	
	import { Plus } from "@lucide/svelte";
  let { children } = $props()

</script>

<div class="flex flex-row gap-2 justify-start items-center mb-8">
    <Button href="/dashboard/staff/add-staff" 
    variant = {page.url.pathname === '/dashboard/staff/add-staff' ? 'default': 'outline' }  ><Plus /> Add Staff</Button>
</div>

{@render children()}