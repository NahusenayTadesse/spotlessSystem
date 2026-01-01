<script lang='ts'>
    import { columns } from "./columns";
  

  let { data } = $props();
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import DataTable from '$lib/components/Table/data-table.svelte';

      import { getLocalTimeZone, today } from "@internationalized/date";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import { CalendarDate } from "@internationalized/date";
  import { page } from '$app/state'
	import * as Card from '$lib/components/ui/card/index.js';

	import { goto } from '$app/navigation';
    import Button from "$lib/components/ui/button/button.svelte";
	import { CalendarDays, Frown } from '@lucide/svelte';

  let todayDate = today(getLocalTimeZone());
  let value = $state<CalendarDate | undefined>(todayDate);
  let urlDate = $state(page.url.pathname.split('/').pop() || today(getLocalTimeZone()).toString());
    const [year, month, day] = urlDate.split("-").map(Number);

  let placeholder = $derived(todayDate);
  let open = $state(false);

   
</script>

<svelte:head>
        <title> Appointments on {placeholder}</title>
</svelte:head>
 <div>
  
<Popover.Root bind:open>
  <Popover.Trigger  class={buttonVariants({ variant: "outline" })}>
    <CalendarDays /> Select Another Date</Popover.Trigger
  >
  <Popover.Content class="p-0">
<Card.Root>
  <Card.Header>
    <Card.Title>Appointment</Card.Title>
  </Card.Header>
  <Card.Content>
    <Calendar type="single"   bind:placeholder
 bind:value   onValueChange={() =>{ goto(`/dashboard/appointments/${value}`);
  open=false;}}
 class="bg-transparent p-0" />
  </Card.Content>
  <Card.Footer class="flex flex-wrap gap-2 border-t px-4 !pt-4">
    {#each [{ label: "Today", value: 0 }, { label: "Tomorrow", value: 1 }, { label: "In 3 days", value: 3 }, { label: "In a week", value: 7 }, { label: "In 2 weeks", value: 14 }] as preset (preset.value)}
      <Button
        variant="outline"
        size="sm"
        class="flex-1"
        onclick={() => {
          value = todayDate?.add({ days: preset.value });
          goto(`/dashboard/appointments/${value}`);
          open=false;

        }}
      >
        {preset.label}
      </Button>
    {/each}
  </Card.Footer>
</Card.Root>
 </Popover.Content>
</Popover.Root>

  
  </div>
  <!-- <div class="lg:w-full w-4/5 mt-8">
 {#if data.appointmentsList.length === 0}
   <p class="text-center">No appointments for this date.</p>
 {:else}
 <ChildrenTable {tableHeaders} mainlist={data.appointmentsList} search={true} link="appointments/single"  />
  {/if}
 </div> -->
  {#if data.appointmentsList.length === 0}
   <div class="w-5xl h-96 flex justify-center items-center">
   <p class="text-center flex flex-row gap-4 mt-4 text-4xl justify-self-cente"><Frown class="animate-bounce w-16  h-12" />
     No appointments for this date, try another date. </p>
     </div>
 {:else}
     <h2 class="text-2xl my-4">No of appointments {data.appointmentsList?.length} </h2>

 <div class="lg:w-[99%] w-[350px] lg:p-0 p-2 mt-8 mb-4 pt-4">
   <DataTable data={data.appointmentsList} {columns} />
 </div>
 {/if}
