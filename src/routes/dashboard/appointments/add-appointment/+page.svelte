<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Snapshot } from '@sveltejs/kit';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { ArrowLeft, CalendarIcon, Frown, Plus, X } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { appointmentSchema, existingCustomerAppointment } from '$lib/ZodSchema';
	import { superForm } from 'sveltekit-superforms/client';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import { fly } from 'svelte/transition';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { gender } from '$lib/global.svelte';

	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { cn } from '$lib/utils.js';
	import Errors from '$lib/formComponents/Errors.svelte';
	import { toast } from 'svelte-sonner';
	let { data } = $props();

	const { form, errors, enhance, delayed, capture, restore, allErrors, message } = superForm(
		data.form,
		{
			taintedMessage: () => {
				return new Promise((resolve) => {
					resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
				});
			},

			validators: zod4Client(appointmentSchema)
		}
	);

	const {
		form: existingForm,
		errors: existingErrors,
		enhance: existingEnhance,
		delayed: existingDelayed,
		capture: existingCapture,
		restore: existingRestore,
		allErrors: existingAllErrors,
		message: existingMessage
	} = superForm(data.existingForm, {
		taintedMessage: () => {
			return new Promise((resolve) => {
				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
			});
		},

		validators: zod4Client(existingCustomerAppointment)
	});

	export const snapshot: Snapshot = { capture, restore, existingCapture, existingRestore };

	function getTodayDate() {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
		const day = String(today.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	let customer: string = $state('');

	let customerList = $derived(
		data.customersList.filter(
			(obj) =>
				obj.name != null && // null / undefined guard
				obj.name.toLowerCase().includes(customer.toLowerCase())
		)
	);

	let addNew = $state(false);

	let selectedCustomer = $state(null as { value: number; name: string } | null);

	let todayDate = today(getLocalTimeZone());

	let date = $state(new CalendarDate(todayDate.year, todayDate.month, todayDate.day));
	let date2 = $state(new CalendarDate(todayDate.year, todayDate.month, todayDate.day));

	$effect(() => {
		$existingForm.appointmentDate = date.toString();
		$form.appointmentDate = date2.toString();
	});
	$effect(() => {
		if ($message) {
			if ($message.type === 'error') {
				toast.error($message.text);
			} else {
				toast.success($message.text);
			}
		}
		if ($existingMessage) {
			if ($existingMessage.type === 'error') {
				toast.error($existingMessage.text);
			} else {
				toast.success($existingMessage.text);
			}
		}
		existingMessage;
	});
</script>

<svelte:head>
	<title>Add New Appointment</title>
</svelte:head>
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

{#snippet fe2(
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
			bind:value={$existingForm[name]}
			aria-invalid={$existingErrors[name] ? 'true' : undefined}
		/>
		{#if $existingErrors[name]}
			<span class="text-red-500">{$existingErrors[name]}</span>
		{/if}
	</div>
{/snippet}
<!-- {#snippet selects2(name, items)}
	<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name} class="capitalize">{name.replace(/([a-z])([A-Z])/g, '$1 $2')}:</Label>

		<SelectComp {name} bind:value={$existingForm[name]} {items} />
		{#if $existingErrors[name]}<span class="text-red-500">{$existingErrors[name]}</span>{/if}
	</div>
{/snippet} -->

<div class="mb-8">
	{#if addNew}
		<Button class="mb-4" onclick={() => (addNew = false)}>
			<ArrowLeft /> Back to Existing Customers</Button
		>
	{:else}
		<Button
			class="mb-4"
			onclick={() => (
				(addNew = true),
				/^\d+$/.test(customer) ? ($form.phone = customer) : ($form.firstName = customer)
			)}
		>
			<Plus /> Add New Customer</Button
		>
	{/if}
</div>

{#if !addNew}
	<Input
		type="search"
		placeholder="Search Customers..."
		class="mb-4 w-full max-w-md justify-self-center lg:w-lg"
		bind:value={customer}
	/>
	<!-- {#if customer.length > 0}
			<p class="mt-2 mb-1 font-medium">You are searching for: "{customer}"</p>
		{/if} -->

	{#if customer !== ''}
		<p class="mt-2 mb-2 text-center font-medium">Search Results: {customer}</p>
		<ul class="mb-4 flex flex-col">
			{#if customerList.length === 0}
				<p class="flex flex-row items-end justify-center gap-2 text-center text-red-500">
					<Frown /> No customer found
					<Button
						variant="outline"
						class="text-primary"
						onclick={() => (
							(addNew = true),
							/^\d+$/.test(customer) ? ($form.phone = customer) : ($form.firstName = customer)
						)}><Plus /> Add New Customer</Button
					>
				</p>
			{/if}
			{#each customerList as customer}
				<li transition:fly={{ x: -200, duration: 600 }} class="text-center">
					<Button
						class="w-1/2"
						variant="outline"
						onclick={() => {
							selectedCustomer = customer;
							$existingForm.customerId = customer.value;
						}}>{customer.name}</Button
					>
				</li>
			{/each}
		</ul>
	{/if}

	<Card.Root class="flex w-full flex-col gap-4 justify-self-center lg:w-xl">
		<Card.Header class="mb-4">
			<Card.Title class="text-2xl">Add An Appointment</Card.Title>
			<Card.Description>Add New Appointments to track the how many have</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				use:existingEnhance
				onsubmit={() => {
					selectedCustomer = null;
					customer = '';
				}}
				action="?/addExistingCustomerAppointment"
				id="existing"
				class="flex flex-col gap-4"
				method="post"
			>
				<Errors allErrors={$existingAllErrors} />

				<div class="flex flex-col gap-4">
					<!-- {@render fe('Customer Gender', 'gender', 'text', 'Select Customer Gender', true)} -->
					{#if selectedCustomer}
						<div
							class="flex flex-row justify-between rounded-lg border-1
			  border-gray-400 p-2 dark:border-gray-300"
							transition:fly={{ y: -200, duration: 200 }}
						>
							{selectedCustomer?.name}
							<X onclick={() => (selectedCustomer = null)} />
						</div>
					{/if}
					<input
						type="hidden"
						required
						aria-invalid={$existingErrors.customerId ? 'true' : undefined}
						name="customerId"
						bind:value={$existingForm.customerId}
					/>

					{#if $existingErrors.customerId}
						<span class="text-red-500"> {$existingErrors.customerId}</span>
					{/if}

					<!-- {@render fe2(
				'Appointment Date',
				'appointmentDate',
				'date',
				'Enter Appointment Date',
				true,
				getTodayDate()
			)} -->

					<input type="hidden" bind:value={$existingForm.appointmentDate} name="appointmentDate" />

					<Popover.Root>
						<Popover.Trigger
							class={cn(
								buttonVariants({
									variant: 'outline',
									class: 'justify-start '
								}),
								!date && 'text-muted-foreground'
							)}
						>
							<CalendarIcon />
							{$existingForm.appointmentDate ? date.toString() : 'Select Appointment Date'}
						</Popover.Trigger>

						<Popover.Content class="flex flex-wrap gap-2 border-t p-0 px-2 !pt-4">
							{#each [{ label: 'Today', value: 0 }, { label: 'Tomorrow', value: 1 }, { label: 'In a week', value: 7 }] as preset (preset.value)}
								<Button
									variant="outline"
									size="sm"
									class="flex-1"
									onclick={() => {
										date = todayDate?.add({ days: preset.value });
									}}
								>
									{preset.label}
								</Button>
							{/each}
							<Calendar type="single" minValue={todayDate} bind:value={date} />
						</Popover.Content>
					</Popover.Root>
					{#if $existingErrors.appointmentDate}
						<span class="text-red-500">{$existingErrors.appointmentDate}</span>
					{/if}
					{@render fe2(
						'Appointment Time',
						'appointmentTime',
						'time',
						'Enter Appointment Time',
						true
					)}

					<div class="flex w-full flex-col justify-start gap-2">
						<Label for="notes">Special Request (optional)</Label>

						<Textarea
							name="notes"
							placeholder="Enter special requests from customer"
							bind:value={$existingForm.notes}
							aria-invalid={$existingErrors.notes ? 'true' : undefined}
						/>

						{#if $existingErrors.notes}<span class="text-red-500">{$existingErrors.notes}</span
							>{/if}
					</div>
				</div>

				<Button type="submit" class="mt-4" form="existing">
					{#if $existingDelayed}
						<LoadingBtn name="Adding Appointment" />
					{:else}
						<Plus class="h-4 w-4" />

						Add Appointment
					{/if}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
{/if}

<!-- <div class="flex flex-col items-center justify-center w-screen px-4 lg:px-0"> -->

<!-- <div class="flex flex-col items-center justify-center w-screen px-4 lg:px-0"> -->

{#if addNew}
	<Card.Root class="flex w-full flex-col gap-4 justify-self-center lg:w-xl">
		<Card.Header>
			<Card.Title class="text-2xl">Add An Appointment</Card.Title>
			<Card.Description>Add New Appointments to track the how many have</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				use:enhance
				action="?/addAppointment"
				id="new"
				class="flex flex-col gap-4"
				method="post"
			>
				<Errors allErrors={$allErrors} />

				<div class="grid-col-1 grid gap-4 lg:grid-cols-2">
					{@render fe(
						'Customer First Name',
						'firstName',
						'text',
						'Enter Customer First Name',
						true
					)}
					{@render fe('Customer Last Name', 'lastName', 'text', 'Enter Customer Last Name', false)}
					{@render fe('Customer Phone Number', 'phone', 'tel', 'Enter Customer Phone Number', true)}
					<!-- {@render fe('Customer Gender', 'gender', 'text', 'Select Customer Gender', true)} -->
					{@render selects('gender', gender)}

					<!-- {@render fe(
				'Appointment Date',
				'appointmentDate',
				'date',
				'Enter Appointment Date',
				true,
				getTodayDate()
			)} -->

					<input type="hidden" bind:value={$form.appointmentDate} name="appointmentDate" />

					<Popover.Root>
						<Popover.Trigger
							class={cn(
								buttonVariants({
									variant: 'outline',
									class: 'justify-start '
								}),
								!date && 'text-muted-foreground'
							)}
						>
							<CalendarIcon />
							{$form.appointmentDate ? date2.toString() : 'Select Appointment Date'}
						</Popover.Trigger>

						<Popover.Content class="flex flex-wrap gap-2 border-t p-0 px-2 !pt-4">
							{#each [{ label: 'Today', value: 0 }, { label: 'Tomorrow', value: 1 }, { label: 'In a week', value: 7 }] as preset (preset.value)}
								<Button
									variant="outline"
									size="sm"
									class="flex-1"
									onclick={() => {
										date2 = todayDate?.add({ days: preset.value });
									}}
								>
									{preset.label}
								</Button>
							{/each}
							<Calendar type="single" minValue={todayDate} bind:value={date2} />
						</Popover.Content>
					</Popover.Root>
					{#if $errors.appointmentDate}
						<span class="text-red-500">{$errors.appointmentDate}</span>
					{/if}
					{@render fe(
						'Appointment Time',
						'appointmentTime',
						'time',
						'Enter Appointment Time',
						true
					)}

					<div class="flex w-full flex-col justify-start gap-2">
						<Label for="notes">Special Request (optional)</Label>

						<Textarea
							name="notes"
							placeholder="Enter special requests from customer"
							bind:value={$form.notes}
							aria-invalid={$errors.notes ? 'true' : undefined}
						/>

						{#if $errors.notes}<span class="text-red-500">{$errors.notes}</span>{/if}
					</div>
				</div>

				<Button type="submit" class="mt-4" form="new">
					{#if $delayed}
						<LoadingBtn name="Adding Appointment" />
					{:else}
						<Plus class="h-4 w-4" />

						Add Appointment
					{/if}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>

	<!-- </div> -->
{/if}
