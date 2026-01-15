<script lang="ts">
	interface Props {
		label: string;
		value: string | undefined | null;
	}

	const { label, value }: Props = $props();
</script>

<div class="flex flex-col gap-1">
	<p class="text-sm font-medium text-muted-foreground">{label}</p>
	<p class="text-sm font-semibold text-foreground">{value || '—'}</p>
</div>
