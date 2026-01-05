<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	let { title, children, description = '' } = $props();
</script>

<Card.Root class="flex w-full flex-col gap-4 lg:w-2xl">
	<Card.Header>
		<Card.Title class="text-2xl">{title}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content>
		{@render children?.()}
	</Card.Content>
</Card.Root>
