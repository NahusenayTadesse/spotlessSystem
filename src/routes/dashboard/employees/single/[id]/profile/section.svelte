<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children: Snippet;
	}

	const { title, children }: Props = $props();
</script>

<Card class="border-0 shadow-lg">
	<CardHeader class="pb-3">
		<CardTitle class="text-base font-semibold text-primary">{title}</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{@render children()}
		</div>
	</CardContent>
</Card>
