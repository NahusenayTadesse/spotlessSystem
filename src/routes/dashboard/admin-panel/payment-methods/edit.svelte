<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { SquarePen, Plus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { EditPaymentMethod as schema } from './schema';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import Errors from '$lib/formComponents/Errors.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	type Category = {
		value: number;
		name: string;
	};

	let {
		data,
		action = '/dashboard/customers?/addCustomer',
		id,
		name,
		icon = false
	}: {
		data: SuperValidated<Infer<schema>>;
		action: string;
		id: number;
		name: string;
		icon: boolean;
	} = $props();

	const { form, errors, enhance, delayed, message, allErrors } = superForm(data, {
		resetForm: false
	});

	let open = $state(false);

	$form.id = id;
	$form.name = name;

	import { toast } from 'svelte-sonner';
	import InputComp from '$lib/formComponents/InputComp.svelte';
	$effect(() => {
		if ($message) {
			if ($message.type === 'error') {
				toast.error($message.text);
			} else {
				toast.success($message.text);
				open = false;
			}
		}
	});
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger class="{buttonVariants({ variant: 'ghost' })} justify-self-start p-0!">
			<Dialog.Root bind:open>
				<Dialog.Trigger class="flex w-auto flex-row items-center justify-center gap-2 border-0">
					{#if icon}
						<SquarePen /> Edit
					{:else}
						{name}
					{/if}
				</Dialog.Trigger>
				<Dialog.Content class="w-full bg-white">
					<Dialog.Header>
						<Dialog.Title class="text-center text-4xl">Edit {name}</Dialog.Title>
					</Dialog.Header>
					<form {action} use:enhance method="post" id="edit" class="flex w-full flex-col gap-4 p-4">
						<Errors allErrors={$allErrors} />
						<input type="hidden" name="id" value={$form.id} />
						<InputComp
							label="Name"
							name="name"
							type="text"
							{form}
							{errors}
							placeholder="Enter Name of Payment Method"
						/>

						<Button type="submit" class="mt-4" form="edit">
							{#if $delayed}
								<LoadingBtn name="Adding Menu Item" />
							{:else}
								<Plus class="h-4 w-4" />

								Save Changes
							{/if}
						</Button>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Edit {name}</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
