<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button, type ButtonVariant } from '$lib/components/ui/button/index.js';
	import { Trash } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

	let {
		title,
		children,
		variant,
		class: className = ''
	}: { title: string; children: Snippet; variant: ButtonVariant; class?: string } = $props();
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
	<Dialog.Content class={className}>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
		</Dialog.Header>
		<ScrollArea class="h-96 w-full lg:h-[calc(100vh-10rem)]" orientation="both">
			{@render children()}
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>
