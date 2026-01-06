<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, type ButtonVariant } from '$lib/components/ui/button/index.js';
	import { Trash } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	let { title, children, variant }: { title: string; children: Snippet; variant: ButtonVariant } =
		$props();
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-auto border-0 px-4">
		{#snippet child({ props })}
			<Button size="sm" class="border-0" {variant} {...props}>
				{#if variant === 'destructive'}
					<Trash />
				{/if}
				{title}
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="w-full">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
		</Dialog.Header>
		{@render children()}
	</Dialog.Content>
</Dialog.Root>
