<script lang="ts">
	import { Input } from '$lib/components/ui/input/index';
	import { Textarea } from '$lib/components/ui/textarea/index';
	import { Label } from '$lib/components/ui/label/index.js';

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
		rows = 5
	} = $props();
</script>

<div class="my-8 flex w-full flex-col justify-start gap-2">
	<Label for={name} class="capitalize">{label}</Label>
	{#if type === 'textarea'}
		<Textarea {name} bind:value={$form[name]} {required} {rows} {placeholder} />
	{:else}
		<Input {type} {name} bind:value={$form[name]} {max} {min} {placeholder} {required} />
	{/if}

	{#if $errors[name]}
		<p class="text-red-500">{$errors[name]}</p>
	{/if}
</div>
