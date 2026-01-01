<script lang="ts">
 import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
 import { Button } from "$lib/components/ui/button/index.js";
 import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Download, ExternalLink, Eye } from "@lucide/svelte";
	import { dropdownClass } from "$lib/global.svelte";
 
 let { id,  recieptLink, customerName, date, booker }:
  { id: string, booker: string, recieptLink: string, customerName: string, date: string } = $props();
 
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
   <DropdownMenu.Label>Settings</DropdownMenu.Label>
  
  </DropdownMenu.Group>
  <DropdownMenu.Separator />

  <DropdownMenu.Item><a href="/dashboard/customers/{id}" class={dropdownClass} ><ExternalLink /> Check out Customer Profile</a></DropdownMenu.Item>
  <DropdownMenu.Item><a href="/dashboard/user/{booker}" class={dropdownClass}> <ExternalLink /> Check out Staff Profile</a></DropdownMenu.Item>
  <DropdownMenu.Item><a href="/dashboard/files/{recieptLink}" class={dropdownClass} ><Eye /> View Reciept</a></DropdownMenu.Item>
  <DropdownMenu.Item><a href="/dashboard/files/{recieptLink}" class={dropdownClass} download="{customerName} Booking Reciept for {date} Appointment" ><Download />Download Reciept</a></DropdownMenu.Item>
 
 </DropdownMenu.Content>
</DropdownMenu.Root>