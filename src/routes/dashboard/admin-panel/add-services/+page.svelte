<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Snapshot } from '@sveltejs/kit';

	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Plus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { serviceSchema } from '$lib/ZodSchema';
	import { superForm } from 'sveltekit-superforms/client';
	import ServiceCategory from '$lib/forms/ServiceCategory.svelte';
	import DialogComp from '$lib/formComponents/DialogComp.svelte';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import ChildrenTable from '$lib/ChildrenTable.svelte';

	let { data } = $props();

	const { form, errors, enhance, delayed, message, capture, restore } = superForm(data.form, {
		taintedMessage: () => {
			return new Promise((resolve) => {
				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
			});
		},

		validators: zod4Client(serviceSchema)
	});

	export const snapshot: Snapshot = { capture, restore };
	// 	 function getItemNameById(items: any, value: any) {
	//   const item = items.find(i=> i.value === value);
	//   return item ? item.name : null; // returns null if not found
	// }

	let search = true;
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
</script>

<svelte:head>
	<title>Add New Service</title>
</svelte:head>
{#snippet content()}
	<ServiceCategory data={data.form} action="?/addCategory" />
{/snippet}
<DialogComp title="Add New Service Category" {content} />

{#snippet fe(
	label = '',
	name = '',
	type = '',
	placeholder = '',
	required = false,
	min = '',
	max = ''
)}
	<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name}>{label}</Label>
		<Input
			{type}
			{name}
			{placeholder}
			{required}
			{min}
			{max}
			bind:value={$form[name]}
			aria-invalid={$errors[name] ? 'true' : undefined}
		/>
		{#if $errors[name]}
			<span class="text-red-500">{$errors[name]}</span>
		{/if}
	</div>
{/snippet}
{#snippet selects(name, items)}
	<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name} class="capitalize">{name.replace(/([a-z])([A-Z])/g, '$1 $2')}:</Label>

		<SelectComp {name} bind:value={$form[name]} {items} />
		{#if $errors[name]}<span class="text-red-500">{$errors[name]}</span>{/if}
	</div>
{/snippet}
<div class="grid w-full gap-8 lg:grid-cols-2">
	<div>
		<div class="flex w-full flex-col gap-4 lg:w-lg">
			<h1>Service Categories</h1>
			<ScrollArea class="w-76 lg:w-lg" orientation="horizontal">
				<ChildrenTable mainlist={data.allCategories} search={false} link="positions" />
			</ScrollArea>
		</div>
	</div>
</div>
