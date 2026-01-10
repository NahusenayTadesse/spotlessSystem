<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import { selectItem } from '$lib/global.svelte';
	import { ChevronDown } from '@lucide/svelte';
	import { fly, slide } from 'svelte/transition';
	import { or } from 'drizzle-orm';

	let { children } = $props();

	let locations = [
		{ name: 'Regions', href: '/dashboard/admin-panel/regions' },
		{ name: 'Cities', href: '/dashboard/admin-panel/cities' },
		{ name: 'Subcities', href: '/dashboard/admin-panel/subcities' }
	];

	let organization = [
		{ name: 'Departments', href: '/dashboard/admin-panel/department' },
		{ name: 'Educational Levels', href: '/dashboard/admin-panel/educational-level' },
		{ name: 'Employement Status ', href: '/dashboard/admin-panel/employment-status' },
		{ name: 'Payment Methods', href: '/dashboard/admin-panel/payment-methods' },
		{ name: 'Services', href: '/dashboard/admin-panel/services' }
	];

	let userManagement = [
		{ name: 'Users', href: '/dashboard/admin-panel/users' },
		{ name: 'Roles', href: '/dashboard/admin-panel/roles' }
	];
</script>

{#snippet menu(trigger = '', array = [{ name: '', href: '' }])}
	<Menubar.Menu>
		<Menubar.Trigger class={selectItem}>{trigger} <ChevronDown /></Menubar.Trigger>

		<div transition:fly={{ y: 20, duration: 300 }}>
			<Menubar.Content>
				{#each array as menu}
					<Menubar.Item class={selectItem}
						><a href={menu.href} class="w-full" transition:slide|global>{menu.name}</a
						></Menubar.Item
					>
					<Menubar.Separator />
				{/each}
			</Menubar.Content>
		</div>
	</Menubar.Menu>
{/snippet}

<Menubar.Root class="sticky mb-8 bg-transparent">
	{@render menu('Organization', organization)}
	{@render menu('Locations', locations)}
	{@render menu('User Management', userManagement)}
</Menubar.Root>

{@render children?.()}
