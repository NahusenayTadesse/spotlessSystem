<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	import { Plus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { superForm } from 'sveltekit-superforms';
	import type { Snapshot } from '@sveltejs/kit';
	import * as Card from '$lib/components/ui/card/index.js';
	import ChildrenTable from '$lib/ChildrenTable.svelte';

	let { data } = $props();

	const { form, errors, delayed, message, enhance, capture, restore } = superForm(data.form, {
		taintedMessage: () => {
			return new Promise((resolve) => {
				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
			});
		}

		// validators: zod4Client(createRoleSchema),
	});

	export const snapshot: Snapshot = { capture, restore };

	let search = true;
</script>

<svelte:head>
	<title>Add Roles</title>
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
	<div class="flex w-full flex-col justify-start gap-8">
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

<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
	<div>
		<ChildrenTable mainlist={data.allRoles} {search} link="positions" />
		<ChildrenTable mainlist={data.branch} {search} link="positions" />
	</div>

	<Card.Root class="flex w-full flex-col gap-4 lg:w-lg">
		<Card.Header>
			<Card.Title class="text-2xl">Add New Roles for Users</Card.Title>
		</Card.Header>
		<Card.Content>
			<form use:enhance action="?/addRoles" class="flex flex-col gap-4" method="post">
				{@render fe('Role Name', 'name', 'text', 'Enter Role Name', true)}

				<div>
					<Label for="description">Role Description</Label>

					<Textarea
						name="description"
						required
						placeholder="Enter role description"
						bind:value={$form.description}
						aria-invalid={$errors.description ? 'true' : undefined}
					/>

					{#if $errors.description}<span class="text-red-500">{$errors.description}</span>{/if}
				</div>
				<div class="flex w-full flex-col justify-start gap-2">
					<Label for="permissions">Add Permissions</Label>
					<!-- <div class="grid grid-cols-2 gap-2"> -->
					<ScrollArea class="h-[300px] w-full rounded-md border p-4">
						<div class="flex flex-col">
							{#each data.allPermissions as perm}
								<label>
									<input
										type="checkbox"
										name="permissions"
										value={perm.id}
										bind:group={$form.permissions}
									/>
									{perm.description}
								</label>
							{/each}
						</div>
					</ScrollArea>
					{#if $errors.permissions}
						<span class="text-red-500">{$errors.permissions._errors}</span>
					{/if}
				</div>

				<Button type="submit" class="mt-4">
					{#if $delayed}
						<LoadingBtn name="Adding Role" />
					{:else}
						<Plus class="h-4 w-4" />

						Add Role
					{/if}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
