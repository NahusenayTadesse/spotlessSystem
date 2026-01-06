<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	interface CheckboxItem {
		value: string | number;
		name: string;
	}

	let {
		items = [],
		checkedValues = $bindable([])
	}: { items: CheckboxItem[]; checkedValues?: string[] } = $props();

	/**
	 * Handle checkbox change
	 */
	const handleChange = (itemValue: string, isChecked: boolean) => {
		if (isChecked) {
			checkedValues = [...checkedValues, itemValue];
		} else {
			checkedValues = checkedValues.filter((v) => v !== itemValue);
		}
	};
</script>

<div
	class="grid {items.length > 20
		? 'grid-cols-1 lg:grid-cols-3'
		: items.length > 10
			? 'grid-cols-1 lg:grid-cols-2'
			: 'grid-cols-1'} gap-3"
>
	{#each items as item (item.value)}
		<div class="flex items-center gap-2">
			<Label for={String(item.value)} class="cursor-pointer font-normal">
				<Checkbox
					id={String(item.value)}
					checked={checkedValues.includes(String(item.value))}
					onCheckedChange={(c) => handleChange(String(item.value), c)}
				/>

				{item.name}
			</Label>
		</div>
	{/each}
</div>
