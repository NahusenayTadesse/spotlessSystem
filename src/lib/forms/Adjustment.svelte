<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Pen } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import type { InventoryAdjustmentForm } from '$lib/ZodSchema';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import FileUpload from '$lib/formComponents/FileUpload.svelte';
	let isOpen = $state(false);

	let {
		data,
		name = 'product'
	}: { data: SuperValidated<Infer<InventoryAdjustmentForm>>; name: string } = $props();
	const { form, errors, enhance, delayed, message } = superForm(data, {});
	import { toast } from 'svelte-sonner';
	$effect(() => {
		if ($message) {
			if ($message.type === 'error') {
				toast.error($message.text);
			} else {
				toast.success($message.text);
			}
		}
	});
</script>

{#snippet fe(
	label = '',
	name = '',
	type = '',
	placeholder = '',
	required = false,
	min = '',
	max = '',
	textArea = false
)}
	<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name}>{label}</Label>
		{#if textArea}
			<Textarea
				{name}
				{placeholder}
				{required}
				bind:value={$form[name]}
				aria-invalid={$errors[name] ? 'true' : undefined}
			/>
		{:else}
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
		{/if}
		{#if $errors[name]}
			<span class="text-red-500">{$errors[name]}</span>
		{/if}
	</div>
{/snippet}

{#snippet select(name, items)}
	<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name} class="capitalize">{name.replace(/([a-z])([A-Z])/g, '$1 $2')}:</Label>

		<SelectComp {name} bind:value={$form[name]} {items} />
		{#if $errors[name]}<span class="text-red-500">{$errors[name]}</span>{/if}
	</div>
{/snippet}

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'default' })}
		title="Change the quantity of {name}"
	>
		<Pen /> Change Quantity
	</Dialog.Trigger>
	<Dialog.Content class="w-full">
		<Dialog.Header>
			<Dialog.Title>Change Quantity of {name}</Dialog.Title>
		</Dialog.Header>
		<ScrollArea class="h-auto rounded-md border p-2">
			<h5 class="text-center">Change {name} Quantity</h5>
			<div class="flex flex-col items-center justify-center gap-4 pt-4">
				<form
					method="post"
					action="?/adjust"
					use:enhance
					class="flex w-full flex-col gap-2"
					enctype="multipart/form-data"
				>
					{@render select('intent', [
						{ value: 'add', name: '+ Add' },
						{ value: 'remove', name: '- Remove' }
					])}
					{@render fe('Quantity of change', 'quantity', 'number', 'Enter Quantity', true, '0')}
					{@render fe(
						'Reason for the adjustment',
						'reason',
						'',
						'Enter reason',
						false,
						'',
						'',
						true
					)}
					{#if $form.intent === 'add'}
						<FileUpload {form} {errors} name="reciept" />
					{/if}

					<Button type="submit" variant="default" size="lg">
						{#if $delayed}
							<LoadingBtn name="Changing" />
						{:else}
							<Pen /> Change Quantity
						{/if}
					</Button>
				</form>
			</div>
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>
