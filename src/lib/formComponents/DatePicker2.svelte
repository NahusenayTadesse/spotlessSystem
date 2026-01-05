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

	import { toEthiopian } from 'ethiopian-calendar-new';

	let ethioDate = $state();
	$effect(() => {
		ethioDate = toEthiopian(
			Number(data.slice(0, 4)),
			Number(data.slice(5, 7)),
			Number(data.slice(8, 10))
		);
	});

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const readableDate = $derived.by(() => {
		if (!form) return 'Select Appointment Date';
		return `${monthNames[form.month - 1]} ${form.day}, ${form.year}`;
	});

	function getEthiopianMonthAmharic(num: number): string {
		const months = [
			'መስከረም', // 1
			'ጥቅምት', // 2
			'ህዳር', // 3
			'ታህሳስ', // 4
			'ጥር', // 5
			'የካቲት', // 6
			'መጋቢት', // 7
			'ሚያዝያ', // 8
			'ግንቦት', // 9
			'ሰኔ', // 10
			'ሐምሌ', // 11
			'ነሐሴ', // 12
			'ጳጉሜ' // 13
		];

		return num >= 1 && num <= 13 ? months[num - 1] : 'የተሳሳተ ቁጥር';
	}
</script>

<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'justify-between '
			}),
			!form && 'text-muted-foreground'
		)}
	>
		<div class="flex items-center gap-2">
			<CalendarIcon />
			{readableDate}
		</div>
		{getEthiopianMonthAmharic(ethioDate?.month)}
		{ethioDate?.day}

		{ethioDate?.year}
	</Popover.Trigger>

	<Popover.Content class="flex flex-wrap gap-2 border-t p-0 px-2 !py-4">
		<p class="justify-self-center text-center">
			{ethioDate?.day}
			{getEthiopianMonthAmharic(ethioDate?.month)}
			{ethioDate?.year}
		</p>

		<Calendar type="single" minValue={todayDate} bind:value={form} />
		{#each [{ label: 'Today', value: 0 }, { label: 'Tomorrow', value: 1 }, { label: 'In 3 days', value: 3 }, { label: 'In a week', value: 7 }, { label: 'In 2 weeks', value: 14 }] as preset (preset.value)}
			<Button
				variant="outline"
				size="sm"
				class="flex-1"
				onclick={() => {
					form = today(getLocalTimeZone()).add({ days: preset.value });
				}}
			>
				{preset.label}
			</Button>
		{/each}
	</Popover.Content>
</Popover.Root>
