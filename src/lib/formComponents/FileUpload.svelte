<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index.js';
	import { X } from '@lucide/svelte';
	import { fileProxy } from 'sveltekit-superforms/client';

	let { form, name, errors } = $props();

	const file = fileProxy(form, name);
</script>

<div class="flex w-full flex-col justify-start gap-2">
	<!-- {#if !$file.length}
		<Label for={name} class="capitalize">{label}</Label>{/if} -->

	<Input
		type="file"
		class=" {$file.length ? 'hidden' : ''} "
		{name}
		accept="image/*,application/pdf"
		bind:files={$file}
		multiple={false}
	/>

	{#if $file?.length}
		<Label for={name} class="capitalize">{$file?.item(0)?.name}</Label>
		<div class="flex flex-row gap-2">
			{#if $file[0].type === 'application/pdf'}
				<iframe
					src={`${URL.createObjectURL($file[0])}#toolbar=0`}
					class="h-64 w-64"
					frameborder="0"
					title="pdf"
				></iframe>
			{:else}
				<img src={URL.createObjectURL($file[0])} class="h-64 w-64 rounded-md object-cover" alt="" />
			{/if}
			<Button variant="ghost" size="icon" onclick={() => file.set(undefined)}>
				<X class="h-4 w-4" />
			</Button>
		</div>
	{/if}

	{#if $errors[name]}
		<p class="text-red-500">{$errors[name]}</p>
	{/if}
</div>
