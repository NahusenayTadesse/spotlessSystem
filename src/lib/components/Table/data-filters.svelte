<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import Label from '../ui/label/label.svelte';

	interface Props {
		data: Record<string, any>[];
		filterKey: string;
		filteredData?: Record<string, any>[];
		children?: Snippet<[item: Record<string, any>]>;
	}

	let { data, filterKey, children, filteredData = $bindable(data) }: Props = $props();

	// Get distinct values for the filter key
	const distinctValues = $derived(
		Array.from(
			new Set(data.map((item) => item[filterKey]).filter((v) => v !== undefined && v !== null))
		).sort()
	);

	// Selected filter value
	let selectedValue = $state<string>('');

	// Update filteredData whenever selectedValue changes
	$effect(() => {
		filteredData =
			selectedValue === ''
				? data
				: data.filter((item) => String(item[filterKey]) === selectedValue);
	});
</script>

<div class="flex w-full flex-col gap-4">
	<!-- Filter Dropdown -->
	<div class="flex flex-col gap-2">
		<Label class="text-sm font-medium">Filter by {filterKey}</Label>
		<Select type="single" bind:value={selectedValue}>
			<SelectTrigger class="w-full">
				{selectedValue === '' ? `Select a ${filterKey}...` : selectedValue}
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="">All {filterKey}s</SelectItem>
				{#each distinctValues as value}
					<SelectItem value={String(value)}>{value}</SelectItem>
				{/each}
			</SelectContent>
		</Select>
	</div>

	<!-- Results Info -->
	<div class="text-sm text-muted-foreground">
		Showing {filteredData.length} of {data.length} items
	</div>

	<!-- Filtered Data Display -->
	<div class="grid max-h-96 gap-3 overflow-y-auto">
		{#if filteredData.length > 0}
			{#each filteredData as item (item.id)}
				{#if children}
					{@render children(item)}
				{:else}
					<Card class="hover:shadow-lg-lg-lg transition-shadow-lg-lg">
						<CardHeader class="pb-3">
							<div class="flex items-start justify-between gap-2">
								<div class="flex-1">
									<CardTitle class="text-base">{item[filterKey]}</CardTitle>
									<CardDescription class="mt-1 text-xs">
										{Object.keys(item).length} properties
									</CardDescription>
								</div>
								<Badge variant="outline">{item[filterKey]}</Badge>
							</div>
						</CardHeader>
						<CardContent class="space-y-1 text-xs">
							{#each Object.entries(item) as [key, value]}
								{#if key !== filterKey}
									<div class="flex justify-between gap-2">
										<span class="font-medium text-muted-foreground">{key}:</span>
										<span class="truncate text-foreground">{String(value)}</span>
									</div>
								{/if}
							{/each}
						</CardContent>
					</Card>
				{/if}
			{/each}
		{:else}
			<Card class="border-dashed">
				<CardContent class="flex items-center justify-center py-8 text-muted-foreground">
					No items found for the selected {filterKey}
				</CardContent>
			</Card>
		{/if}
	</div>
</div>
