<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
  import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/svelte";

  type Props = { value?: string }; // "March-2025"
  let { value = $bindable("") }: Props = $props();

  let isOpen = $state(false);

  /* ---------- derived state ---------- */
  const months     = ["January","February","March","April","May","June",
                      "July","August","September","October","November","December"];
  const monthsShort = months.map(m => m.slice(0,3));

  let selectedYear = $derived(value ? parseInt(value.split("_")[1]) : new Date().getFullYear());
  let selectedMonth = $derived(value ? value.split("_")[1] : "");

  let displayValue = $derived(value || "Select month and year");

  /* ---------- actions ---------- */
  const selectMonth = (month: string) => {
    value = `${month}_${selectedYear}`;
    isOpen = false;
  };

  const previousYear = () => (selectedYear -= 1);
  const nextYear     = () => (selectedYear += 1);
</script>

<Popover bind:open={isOpen}>
  <PopoverTrigger>
    <Button variant="outline" class="w-full justify-start text-left font-normal">
	{displayValue.replaceAll('_', ' ')}
    </Button>
  </PopoverTrigger>

  <PopoverContent class="w-72 p-0" align="start">
    <div class="flex flex-col gap-4 p-4">
      <!-- month grid -->
      <div>
        <h3 class="mb-3 text-sm font-semibold text-center">{selectedYear}</h3>
        <div class="grid grid-cols-3 gap-2">
          {#each months as month, i}
            <Button
              variant={selectedMonth === month ? "default" : "outline"}
              size="sm"
              class="h-8"
              onclick={() => selectMonth(month)}>
              {monthsShort[i]}
            </Button>
          {/each}
        </div>
      </div>

      <!-- year changer -->
      <div class="flex items-center justify-between pt-2 border-t">
        <Button variant="ghost" size="sm" onclick={previousYear}>
          <ChevronLeftIcon class="size-4" />
        </Button>
        <span class="text-sm font-medium">{selectedYear}</span>
        <Button variant="ghost" size="sm" onclick={nextYear}>
          <ChevronRightIcon class="size-4" />
        </Button>
      </div>
    </div>
  </PopoverContent>
</Popover>