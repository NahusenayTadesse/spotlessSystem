<script lang="ts">
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';

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

<div class="flex flex-col gap-3 rounded-lg bg-background p-3">
	<h4 class="text-sm font-medium text-muted-foreground">Filters</h4>
	<div class="flex flex-row flex-wrap gap-2">
		{#each filterKeys as filterKey (filterKey)}
			<Select type="single" bind:value={selectedFilters[filterKey]}>
				<SelectTrigger class="capitalize">
					{#if selectedFilters[filterKey] === ''}
						All {filterKey}
					{:else}
						{selectedFilters[filterKey]}
					{/if}
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="">All {filterKey}</SelectItem>
					{#each getDistinctValues(filterKey) as value}
						<SelectItem value={String(value)}>{value}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		{/each}
	</div>
</div>
