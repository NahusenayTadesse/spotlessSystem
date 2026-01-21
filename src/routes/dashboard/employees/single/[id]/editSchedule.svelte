<script lang="ts">
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { SquarePen, Save } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import Errors from '$lib/formComponents/Errors.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { type EditSchedule } from './schema';
	function getWeekdayName(dayIndex: number): string {
		const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

		// Optional: Handle numbers out of range
		if (dayIndex < 0 || dayIndex > 6) {
			throw new Error('Invalid day index. Please provide a number between 0 and 6.');
		}

		return days[dayIndex];
	}
	const weekDays = [
		{ value: 0, name: 'Monday' },
		{ value: 1, name: 'Tuesday' },
		{ value: 2, name: 'Wednesday' },
		{ value: 3, name: 'Thursday' },
		{ value: 4, name: 'Friday' },
		{ value: 5, name: 'Saturday' },
		{ value: 6, name: 'Sunday' }
	];

	let {
		data,
		id,
		startTime,
		endTime,
		day,
		status,
		icon = false
	}: {
		data: SuperValidated<Infer<EditSchedule>>;
		id: number;
		startTime: string;
		endTime: string;
		day: number;
		status: boolean;
		icon: boolean;
	} = $props();

	const { form, errors, enhance, delayed, message, allErrors } = superForm(data, {
		resetForm: false
	});

	let open = $state(false);

	$form.id = id;
	$form.day = day;
	$form.startTime = startTime;
	$form.endTime = endTime;
	$form.status = status;

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
						{getWeekdayName(day)}
					{/if}
				</Dialog.Trigger>
				<Dialog.Content class="w-full bg-background">
					<Dialog.Header>
						<Dialog.Title class="text-center text-4xl">Edit {getWeekdayName(day)}</Dialog.Title>
					</Dialog.Header>
					<ScrollArea class="h-auto w-full px-2 pr-4" orientation="both">
						<form
							action="?/editSchedule"
							use:enhance
							method="post"
							id="edit"
							class="flex h-96 w-full flex-col gap-4 p-4 pt-8"
							enctype="multipart/form-data"
						>
							<Errors allErrors={$allErrors} />
							<input type="hidden" name="id" value={$form.id} />
							<InputComp label="Day" name="day" type="select" {form} {errors} items={weekDays} />
							<InputComp label="Start Time" name="startTime" type="time" {form} {errors} required />
							<InputComp label="End Time" name="endTime" type="time" {form} {errors} required />
							<InputComp
								label="Status"
								name="status"
								type="select"
								{form}
								{errors}
								items={[
									{ value: true, name: 'Active' },
									{ value: false, name: 'Inactive' }
								]}
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
			<p>Edit {getWeekdayName(day)}</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
