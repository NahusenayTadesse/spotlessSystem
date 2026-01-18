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

	let {
		data,
		id,
		field,
		educationalLevel,
		schoolName,
		graduationDate,
		eduLevel,
		certificate,
		icon = false
	}: {
		data: SuperValidated<Infer<EditQualification>>;
		id: number;
		field: string;
		schoolName: string;
		educationalLevel: number;
		graduationDate: Date;
		certificate?: string;
		eduLevel: Item[];
		icon: boolean;
	} = $props();

	const { form, errors, enhance, delayed, message, allErrors } = superForm(data, {
		resetForm: false
	});

	let open = $state(false);

	$form.id = id;
	$form.field = field;
	$form.schoolName = schoolName;
	$form.educationalLevel = educationalLevel;
	$form.graduationDate = graduationDate?.toLocaleDateString('en-CA');

	import { toast } from 'svelte-sonner';
	import InputComp from '$lib/formComponents/InputComp.svelte';
	import type { Item } from '$lib/global.svelte';
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
				<Dialog.Trigger class="flex flex-row items-center justify-center gap-2 border-0">
					{#if icon}
						<SquarePen /> Edit
					{:else}
						{field}
					{/if}
				</Dialog.Trigger>
				<Dialog.Content class="w-full bg-background">
					<Dialog.Header>
						<Dialog.Title class="text-center text-4xl">Edit {field}</Dialog.Title>
					</Dialog.Header>
					<ScrollArea class="h-auto w-full px-2 pr-4" orientation="both">
						<form
							action="?/editQualification"
							use:enhance
							method="post"
							id="edit"
							class="flex h-96 w-full flex-col gap-4 p-4 pt-8"
							enctype="multipart/form-data"
						>
							<Errors allErrors={$allErrors} />
							<input type="hidden" name="id" value={$form.id} />
							<InputComp
								label="Field"
								name="field"
								type="text"
								{form}
								{errors}
								placeholder="Enter Field Name"
							/>
							<InputComp
								label="Educational Level"
								name="educationalLevel"
								type="combo"
								{form}
								{errors}
								items={eduLevel}
								required
							/>

							<InputComp
								label="School Name "
								name="schoolName"
								type="text"
								{form}
								{errors}
								required
								placeholder="Enter School Name"
							/>
							<InputComp
								label="Graduation Date"
								name="graduationDate"
								type="date"
								{form}
								{errors}
								oldDays
								futureDays={false}
							/>
							<InputComp
								label="Certificate"
								name="certificate"
								type="file"
								image={certificate}
								{form}
								{errors}
							/>

							<Button type="submit" class="mt-4" form="edit">
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
			<p>Edit {field}</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
