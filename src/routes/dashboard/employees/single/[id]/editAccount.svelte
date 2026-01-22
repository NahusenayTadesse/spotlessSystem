<script lang="ts">
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { SquarePen, Plus, Save } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import Errors from '$lib/formComponents/Errors.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import InputComp from '$lib/formComponents/InputComp.svelte';
	const isActives = [
		{ value: true, name: 'Active' },
		{ value: false, name: 'Inactive' }
	];

	let {
		data,
		id,
		paymentMethods,
		paymentMethod,
		accountDetail,
		name,
		status,
		icon
	}: {
		data: SuperValidated<Infer<EditAccount>>;
		id: number;
		name: string;
		paymentMethods: Item[];
		paymentMethod: number;
		accountDetail: string;
		status: boolean;
		icon: boolean;
	} = $props();

	const { form, errors, enhance, delayed, message, allErrors } = superForm(data, {
		resetForm: false,
		invalidateAll: true
	});
	import { toast } from 'svelte-sonner';
	import type { Item } from '$lib/global.svelte';
	$effect(() => {
		if ($message) {
			if ($message.type === 'error') {
				toast.error($message.text);
			} else {
				toast.success($message.text);
			}
		}
	});
	$form.id = id;
	$form.paymentMethod = paymentMethod;
	$form.accountDetail = accountDetail;
	$form.status = status;
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger class="{buttonVariants({ variant: 'ghost' })} justify-self-start p-0!">
			<Dialog.Root>
				<Dialog.Trigger class="flex flex-row items-center justify-center gap-2 border-0">
					{#if icon}
						<SquarePen /> Edit
					{:else}
						{name}
					{/if}
				</Dialog.Trigger>
				<Dialog.Content class="w-full bg-background">
					<Dialog.Header>
						<Dialog.Title class="text-center text-4xl">Edit {name}</Dialog.Title>
					</Dialog.Header>
					<ScrollArea class="h-auto w-full px-2 pr-4" orientation="both">
						<form
							id="main"
							action="?/editAccount"
							class="flex w-full! min-w-full! flex-col items-center justify-center gap-3"
							use:enhance
							method="post"
						>
							<input type="hidden" bind:value={$form.id} name="id" />
							<InputComp
								label="Bank"
								name="paymentMethod"
								type="select"
								{form}
								{errors}
								required
								items={paymentMethods}
							/>
							<InputComp
								label="Account Detail"
								name="accountDetail"
								type="text"
								{form}
								{errors}
								required
								placeholder="Enter Account Details"
							/>

							<InputComp
								label="Status"
								name="status"
								type="select"
								{form}
								{errors}
								required
								items={isActives}
							/>

							<Errors allErrors={$allErrors} />
							<Button type="submit" class="w-full" form="main" variant="default">
								{#if $delayed}
									<LoadingBtn name="Saving Changes" />
								{:else}
									<Save class="h-4 w-4" />
									Save Changes
								{/if}
							</Button>
						</form>
					</ScrollArea>
				</Dialog.Content>
			</Dialog.Root>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Edit {accountDetail}</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
