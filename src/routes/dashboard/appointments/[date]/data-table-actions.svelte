<script lang="ts">
 import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
 import { Button } from "$lib/components/ui/button/index.js";
 import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
 	import { Download, ExternalLink, Eye } from "@lucide/svelte";
	import { dropdownClass } from "$lib/global.svelte";

 let { id, phone, bookedById, bookedBy,  customerName, date }:
  { id: string, phone: string, recieptLink: string, customerName: string, date: string } = $props();


</script>
 
<DropdownMenu.Root>
 <DropdownMenu.Trigger>
  {#snippet child({ props })}
   <Button
    {...props}
    variant="ghost"
    size="icon"
    class="relative size-8 p-0"
   >
    <span class="sr-only">Open menu</span>
    <EllipsisIcon />
   </Button>
  {/snippet}
 </DropdownMenu.Trigger>
 <DropdownMenu.Content>
  <DropdownMenu.Group>
   <DropdownMenu.Label>Actions</DropdownMenu.Label>
  
  </DropdownMenu.Group>
  <DropdownMenu.Separator />
   <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(phone)} title= 'Copy {phone}'>
        Copy Phone Number
      </DropdownMenu.Item>
  <DropdownMenu.Item><a href="/dashboard/appointments/single/{id}" class={dropdownClass} ><Eye />View Appointment Details</a></DropdownMenu.Item>
  <DropdownMenu.Item><a href="/dashboard/customers/{id}" target="_blank" class={dropdownClass}><ExternalLink /> View {customerName}'s Details</a></DropdownMenu.Item>
  <DropdownMenu.Item><a href="/dashboard/user/{bookedById}" target="_blank" class={dropdownClass}><ExternalLink /> View {bookedBy}'s Details</a></DropdownMenu.Item>
 </DropdownMenu.Content>
</DropdownMenu.Root>