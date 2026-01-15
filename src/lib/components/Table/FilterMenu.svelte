<script lang="ts">
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import pluralize from 'pluralize';
	import { Label } from '$lib/components/ui/label/index';
	import Button from '../ui/button/button.svelte';
	import { RotateCcw } from '@lucide/svelte';

	interface Props {
		data: any[];
		filterKeys: string[];
		filteredList?: any[];
	}

	let { data, filterKeys, filteredList = $bindable(data) }: Props = $props();

	// Create a map of filterKey -> selectedValue
	let selectedFilters = $state<Record<string, string>>({});

	// Initialize selectedFilters for each filterKey
	$effect(() => {
		filterKeys.forEach((key) => {
			if (!(key in selectedFilters)) {
				selectedFilters[key] = '';
			}
		});
	});

	// Get distinct values for each filter key
	const getDistinctValues = (key: string) => {
		return Array.from(
			new Set(data.map((item: any) => item[key]).filter((v) => v !== undefined && v !== null))
		).sort();
	};

	const getCountForValue = (filterKey: string, value: string) => {
		return data.filter((item: any) => {
			return filterKeys.every((key) => {
				if (key === filterKey) {
					return String(item[key]) === value;
				}
				const selectedValue = selectedFilters[key];
				if (selectedValue === '') return true;
				return String(item[key]) === selectedValue;
			});
		}).length;
	};

	// Filter data based on all active filters
	$effect(() => {
		filteredList = data.filter((item: any) => {
			return filterKeys.every((key) => {
				const selectedValue = selectedFilters[key];
				if (selectedValue === '') return true;
				return String(item[key]) === selectedValue;
			});
		});
	});
</script>

<div class="mt-3 flex flex-col gap-3 rounded-lg bg-background p-3">
	<h4 class="text-sm font-medium text-muted-foreground">Filters</h4>
	<Button
		variant="ghost"
		size="icon"
		class="active:animate-[spin_1s_linear_infinite_reverse]"
		onclick={() => (filteredList = data)}
		title="Reset Filters"><RotateCcw /></Button
	>
	<div class="flex flex-row flex-wrap gap-2">
		{#each filterKeys as filterKey (filterKey)}
			<div class="flex flex-col gap-2">
				<Label class="capitalize">{pluralize(filterKey)}</Label>
				<Select type="single" bind:value={selectedFilters[filterKey]}>
					<SelectTrigger class="capitalize">
						{#if selectedFilters[filterKey] === ''}
							All {pluralize(filterKey)}
						{:else}
							{selectedFilters[filterKey]}
						{/if}
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="" class="capitalize">All {pluralize(filterKey)}</SelectItem>
						{#each getDistinctValues(filterKey) as value}
							<SelectItem class="capitalize" value={String(value)}>{value}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</div>
		{/each}
	</div>
</div>
