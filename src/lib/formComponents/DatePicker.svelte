<script lang="ts">
 import CalendarIcon from "@lucide/svelte/icons/calendar";
 import {
	CalendarDate,
  DateFormatter,
  getLocalTimeZone,

  today

 } from "@internationalized/date";
 import { cn } from "$lib/utils.js";
 import { buttonVariants } from "$lib/components/ui/button/index.js";
 import { Calendar } from "$lib/components/ui/calendar/index.js";
 import * as Popover from "$lib/components/ui/popover/index.js";
 
 const df = new DateFormatter("en-US", {
  dateStyle: "long"
 });

 let { value= $bindable(), name, minValue= new CalendarDate(1995,1,1), maxValue=today(getLocalTimeZone()), captionLayout="dropdown" } = $props();
 
 let contentRef = $state<HTMLElement | null>(null);

 

</script>
 
<Popover.Root>
 <Popover.Trigger
  class={cn(
   buttonVariants({
    variant: "outline",
    class: `w-full border border-gray-300 dark:border-gray-700 
rounded-lg px-4 py-2 bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-100 
focus:outline-none focus:ring-1 dark:focus:ring-white focus:ring-dark transition capitalize flex flex-start justify-start`
   }),
   !value && "text-muted-foreground"
  )}
 >
  <CalendarIcon />
  {value ? df.format(value.toDate(getLocalTimeZone())) : name.replace(/([a-z])([A-Z])/g, '$1 $2')}
 </Popover.Trigger>
 <Popover.Content bind:ref={contentRef} class="w-auto p-0">
  <Calendar type="single" {captionLayout} bind:value
   {minValue}
    class={"dark:bg-dark dark:text-white"}
    {maxValue}
     />

 </Popover.Content>
</Popover.Root>


<input type="hidden" {name} bind:value>
