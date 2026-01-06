<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { BadgeCheck, Loader, OctagonMinus } from '@lucide/svelte';

	/* ---------- public prop ---------- */
	interface Props {
		status: string;
	}
	let { status }: Props = $props();

	/* ---------- lookup tables ---------- */
	const statusMeta = {
		/* confirmed / paid */
		confirmed: { icon: BadgeCheck, colour: 'bg-green-400' },
		paid: { icon: BadgeCheck, colour: 'bg-green-400' },

		/* cancelled / unpaid */
		cancelled: { icon: OctagonMinus, colour: 'bg-red-500' },
		unpaid: { icon: OctagonMinus, colour: 'bg-red-500' },

		/* pending */
		pending: { icon: Loader, colour: 'bg-yellow-500' },

		/* active */
		active: { icon: BadgeCheck, colour: 'bg-green-400' },
		inactive: { icon: OctagonMinus, colour: 'bg-red-500' },

		/* fallback */
		unknown: { icon: Loader, colour: 'bg-gray-500' }
	} as const;

	/* ---------- derived ---------- */
	const key = String(status).trim().toLowerCase() as keyof typeof statusMeta;
	const { icon: Icon, colour } = statusMeta[key] ?? statusMeta.unknown;
</script>

<Badge variant="secondary" class="{colour} text-white">
	<Icon />
	{status}
</Badge>
