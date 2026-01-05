<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, type ButtonVariant } from '$lib/components/ui/button/index.js';
	import { Trash } from '@lucide/svelte';

	let { title, children, variant }: { title: string; variant: ButtonVariant } = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-auto border-0 px-4"
		><Button size="sm" class="border-0" {variant}>
			{#if variant === 'destructive'}
				<Trash />
			{/if}
			{title}
		</Button></Dialog.Trigger
	>
	<Dialog.Content class="w-full">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
		</Dialog.Header>
		{@render children()}
	</Dialog.Content>
</Dialog.Root>
