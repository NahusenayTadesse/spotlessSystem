<script lang="ts">
	import { Input } from '$lib/components/ui/input/index';
	import { Textarea } from '$lib/components/ui/textarea/index';
	import { Label } from '$lib/components/ui/label/index.js';
	import FileUpload from './FileUpload.svelte';
	import DatePicker2 from './DatePicker2.svelte';
	import SelectComp from './SelectComp.svelte';
	import ComboboxComp from './ComboboxComp.svelte';

	let {
		label,
		form,
		name,
		errors,
		type,
		required = false,
		max = '',
		min = '',
		placeholder = '',
		rows = 5,
		items = [],
		oldDays = true
	} = $props();
</script>

<div class="flex w-full flex-col justify-start gap-2">
	<Label for={name} class="capitalize">{label}</Label>
	{#if type === 'textarea'}
		<Textarea {name} bind:value={$form[name]} {required} {rows} {placeholder} />
	{:else if type === 'file'}
		<FileUpload {name} {form} {errors} />
	{:else if type === 'select'}
		<SelectComp {name} bind:value={$form[name]} {items} />
	{:else if type === 'date'}
		<DatePicker2 bind:data={$form[name]} {oldDays} />
		<input type="hidden" {name} bind:value={$form[name]} />
	{:else if type === 'combo'}
		<ComboboxComp {name} bind:value={$form[name]} {items} />
	{:else}
		<Input {type} {name} bind:value={$form[name]} {max} {min} {placeholder} {required} />
	{/if}

	{#if $errors[name]}
		<p class="text-red-500">{$errors[name]}</p>
	{/if}
</div>
