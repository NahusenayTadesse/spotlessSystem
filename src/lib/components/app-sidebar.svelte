<script lang="ts">
	import {
		User,
		Users,
		UserRoundCog,
		ChartArea,
		Calendar,
		SquareChartGantt,
		IdCardLanyard,
		LayoutDashboard,
		ShoppingBasket,
		Container,
		Banknote,
		BanknoteArrowUp,
		ScanLine,
		List,
		Plus
	} from '@lucide/svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import { bgGradient, selectItem } from '$lib/global.svelte';
	import { fade } from 'svelte/transition';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { ScrollArea } from './ui/scroll-area/index';
	import NavMain from './NavMain.svelte';

	const navigation = [
		{ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
		{
			title: 'Customers',
			url: '/dashboard/customers',
			icon: Users,
			items: [
				{ title: 'All Customers', url: '/dashboard/customers/', icon: List },
				{ title: 'Add Customer', url: '/dashboard/customers/add-customer', icon: Plus }
			]
		},
		{ title: 'Appointments', url: '/dashboard/appointments', icon: Calendar },
		{ title: 'Products', url: '/dashboard/products', icon: ShoppingBasket },
		{ title: 'Services', url: '/dashboard/services', icon: SquareChartGantt },
		{ title: 'Supplies', url: '/dashboard/supplies', icon: Container },
		{ title: 'Reports', url: '/dashboard/reports', icon: ChartArea },
		{ title: 'Staff', url: '/dashboard/staff', icon: IdCardLanyard },
		{ title: 'Salary', url: '/dashboard/salary', icon: Banknote },
		{ title: 'Sales', url: '/dashboard/sales', icon: BanknoteArrowUp },
		{ title: 'Transactions', url: '/dashboard/transactions', icon: ScanLine },
		{ title: 'Users', url: '/dashboard/users', icon: User },
		{ title: 'Admin Panel', url: '/dashboard/admin-panel', icon: UserRoundCog }
	];

	let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	const on = 'bg-sidebar-primary text-sidebar-primary-foreground';
	const off = 'text-sidebar-foreground';
	function blacken(url: string) {
		const currentPath = page.url.pathname;

		// Special case for root dashboard
		if (url === '/dashboard') {
			return currentPath === '/dashboard' ? on : off;
		}

		// For other items, check if current path starts with their URL but is not just /dashboard
		return currentPath.startsWith(url) && currentPath !== '/dashboard' ? on : off;
	}

	let open = $state(false);

	const sidebar = useSidebar();

	function closeSidebar() {
		if (sidebar.isMobile) {
			sidebar.setOpenMobile(false);
		}
	}
</script>

<Sidebar.Root collapsible="icon" {...restProps}>
	<Sidebar.Content
		class="{bgGradient} h-full
  overflow-y-scroll [scrollbar-color:#a3a3a3_transparent]
  [scrollbar-width:thin]
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-thumb]:bg-gray-400
  [&::-webkit-scrollbar-thumb:hover]:bg-gray-500
  [&::-webkit-scrollbar-track]:bg-transparent
"
	>
		<Sidebar.Group>
			<Sidebar.GroupLabel class="sticky top-0 z-10 bg-white py-4 dark:bg-gray-700">
				<div class="flex flex-row items-center justify-center gap-4 py-8">
					<img src="/logo.webp" class="block h-8 w-8 dark:hidden" alt="Logo" />
					<img src="/logoWhite.webp" class="hidden h-8 w-8 dark:block" alt="Logo" />
					<h4 class="!text-[22px] text-gray-900 dark:text-white">Spotless</h4>
				</div></Sidebar.GroupLabel
			>
			<Sidebar.GroupContent class="mt-8">
				<NavMain items={navigation} label="Customers" />
				<!-- <Sidebar.Menu class="w-full gap-3">
					{#each navigation as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								class="flex items-center gap-3 rounded-lg px-3 py-5 text-lg
          font-normal transition-colors duration-300 hover:bg-sidebar-accent
          hover:text-sidebar-accent-foreground {selectItem}
          {blacken(item.url)}"
							>
								{#snippet child({ props })}
									<a href={item.url} onclick={closeSidebar} {...props} transition:fade>
										<item.icon class="!h-5 !w-5" />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu> -->
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer class="flex flex-row bg-white dark:bg-black">
		<Sidebar.GroupLabel>
			Powered By <a href="https://pulsedata.com" target="_blank" class="ml-1">PulseData</a>
		</Sidebar.GroupLabel>
	</Sidebar.Footer>
</Sidebar.Root>
