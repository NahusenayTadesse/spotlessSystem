<script lang="ts">
	import { formatETB } from '$lib/global.svelte';
	import {
		DollarSignIcon,
		Minus as MinusCircleIcon,
		CircleAlert as AlertTriangleIcon,
		WalletIcon,
		ClockIcon
	} from '@lucide/svelte';

	type Totals = {
		gross: number;
		tax: number;
		penalty: number;
		netPay: number;
		overtime: number;
	};

	let { totals }: { totals: Totals } = $props();

	/** Format currency */
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		}).format(value);
	};
</script>

<h4>Totals</h4>
<div
	class="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-4 lg:max-w-6xl"
>
	<!-- Gross Pay -->
	<div class="flex items-center gap-2 border-r border-border pr-4">
		<div class="flex size-8 items-center justify-center rounded-full bg-emerald-500/20">
			<DollarSignIcon class="size-4 text-emerald-600 dark:text-emerald-400" />
		</div>
		<div>
			<p class="text-xs text-muted-foreground">Gross</p>
			<p class="font-semibold text-emerald-600 dark:text-emerald-400">
				{formatETB(totals.gross, true)}
			</p>
		</div>
	</div>

	<!-- Overtime -->
	<div class="flex items-center gap-2 border-r border-border pr-4">
		<div class="flex size-8 items-center justify-center rounded-full bg-blue-500/20">
			<ClockIcon class="size-4 text-blue-600 dark:text-blue-400" />
		</div>
		<div>
			<p class="text-xs text-muted-foreground">Overtime</p>
			<p class="font-semibold text-blue-600 dark:text-blue-400">
				+{formatETB(totals.overtime, true)}
			</p>
		</div>
	</div>

	<!-- Tax -->
	<div class="flex items-center gap-2 border-r border-border pr-4">
		<div class="flex size-8 items-center justify-center rounded-full bg-orange-500/20">
			<MinusCircleIcon class="size-4 text-orange-600 dark:text-orange-400" />
		</div>
		<div>
			<p class="text-xs text-muted-foreground">Tax</p>
			<p class="font-semibold text-orange-600 dark:text-orange-400">
				-{formatETB(totals.tax, true)}
			</p>
		</div>
	</div>

	<!-- Penalty -->
	<div class="flex items-center gap-2 border-r border-border pr-4">
		<div class="flex size-8 items-center justify-center rounded-full bg-red-500/20">
			<AlertTriangleIcon class="size-4 text-red-600 dark:text-red-400" />
		</div>
		<div>
			<p class="text-xs text-muted-foreground">Penalty</p>
			<p class="font-semibold text-red-600 dark:text-red-400">-{formatETB(totals.penalty, true)}</p>
		</div>
	</div>

	<!-- Net Pay -->
	<div class="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
		<div class="flex size-8 items-center justify-center rounded-full bg-primary/20">
			<WalletIcon class="size-4 text-primary" />
		</div>
		<div>
			<p class="text-xs text-muted-foreground">Net Pay</p>
			<p class="font-bold text-primary">{formatETB(totals.netPay, true)}</p>
		</div>
	</div>
</div>
