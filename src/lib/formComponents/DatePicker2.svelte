<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import { CalendarDate, getLocalTimeZone, today, parseDate } from '@internationalized/date';
	import { CalendarIcon } from '@lucide/svelte';

	function getTodayDate() {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
		const day = String(today.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}
	let { data = $bindable(), oldDays = false }: { data: string; oldDays?: boolean } = $props();

	const todayDate = oldDays ? undefined : today(getLocalTimeZone());

	//     function formatDateIntl(dateStr: string): string {
	//   const date = new Date(dateStr);

	//   if (isNaN(date.getTime())) {
	//     throw new Error("Invalid date string");
	//   }

	//   return new Intl.DateTimeFormat("en-US", {
	//     year: "numeric",
	//     month: "long",
	//     day: "numeric"
	//   }).format(date);

	// let form = $state(parseDate(data));

	let form = $state(
		parseDate(data || todayDate?.toString() || new Date().toISOString().split('T')[0])
	);

	$effect(() => {
		data = form.toString();
	});
</script>

<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'justify-start '
			}),
			!form && 'text-muted-foreground'
		)}
	>
		<CalendarIcon />
		{form ? form.toString() : 'Select Appointment Date'}
	</Popover.Trigger>

	<Popover.Content class="flex flex-wrap gap-2 border-t p-0 px-2 !pt-4">
		<!-- {#each [{ label: 'Today', value: 0 }, { label: 'Tomorrow', value: 1 }, { label: 'In a week', value: 7 }] as preset (preset.value)}
			<Button
				variant="outline"
				size="sm"
				class="flex-1"
				onclick={() => {
					form = todayDate?.add({ days: preset.value });
				}}
			>
				{preset.label}
			</Button>
		{/each} -->

		<Calendar type="single" minValue={todayDate} bind:value={form} />
	</Popover.Content>
</Popover.Root>
