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
		Plus,
		MapPin,
		Building2,
		Sheet
	} from '@lucide/svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import { bgGradient } from '$lib/global.svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';

	import NavMain from './NavMain.svelte';

	const navigation = [
		{ title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
		{
			title: 'Customers',
			url: '/dashboard/customers',
			icon: Users,
			items: [
				{ title: 'All Customers', url: '/dashboard/customers', icon: List },
				{ title: 'Add Customer', url: '/dashboard/customers/add-customer', icon: Plus }
			]
		},
		{ title: 'Appointments', url: '/dashboard/appointments', icon: Calendar },
		{ title: 'Products', url: '/dashboard/products', icon: ShoppingBasket },
		{ title: 'Services', url: '/dashboard/services', icon: SquareChartGantt },
		{
			title: 'Supplies',
			url: '/dashboard/supplies',
			icon: Container,
			items: [
				{ title: 'All Supplies', url: '/dashboard/supplies', icon: Sheet },
				{ title: 'Add Supply', url: '/dashboard/supplies/add-supplies', icon: Plus },
				{ title: 'Suppliers', url: '/dashboard/supplies/suppliers', icon: Sheet },
				{ title: 'Add Supplier', url: '/dashboard/supplies/add-supplier', icon: Plus },
				{ title: 'Damaged Supplies', url: '/dashboard/supplies/damaged', icon: Sheet },
				{ title: 'Add Damaged Supply', url: '/dashboard/supplies/add-damaged', icon: Plus },
				{ title: 'Categories', url: '/dashboard/supplies/categories', icon: Sheet },
				{ title: 'Add Category', url: '/dashboard/supplies/add-category', icon: Plus }
			]
		},
		{ title: 'Reports', url: '/dashboard/reports', icon: ChartArea },
		{ title: 'Employees', url: '/dashboard/employees', icon: IdCardLanyard },
		{ title: 'Salary', url: '/dashboard/salary', icon: Banknote },
		{ title: 'Sales', url: '/dashboard/sales', icon: BanknoteArrowUp },
		{ title: 'Transactions', url: '/dashboard/transactions', icon: ScanLine },
		{
			title: 'Admin Panel',
			url: '/dashboard/admin-panel',
			icon: UserRoundCog,
			items: [
				{ title: 'Regions', url: '/dashboard/admin-panel/regions', icon: MapPin },
				{ title: 'Cities', url: '/dashboard/admin-panel/cities', icon: MapPin },
				{ title: 'Subcities', url: '/dashboard/admin-panel/subcities', icon: MapPin },
				{ title: 'Departments', url: '/dashboard/admin-panel/department', icon: Building2 },
				{
					title: 'Payment Methods',
					url: '/dashboard/admin-panel/payment-methods',
					icon: Building2
				},
				{ title: 'Users', url: '/dashboard/admin-panel/users', icon: Users },
				{ title: 'Roles', url: '/dashboard/admin-panel/roles', icon: Users }
			]
		}
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
		class="z-[9999]! h-full
  overflow-y-scroll pt-4
  [scrollbar-color:#a3a3a3_transparent]
  [scrollbar-width:thin]
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-thumb]:bg-gray-400
  [&::-webkit-scrollbar-thumb:hover]:bg-gray-500 [&::-webkit-scrollbar-track]:bg-transparent
  {bgGradient}
"
	>
		<Sidebar.Group>
			<Sidebar.GroupLabel>
				<div class="flex flex-row items-center justify-center gap-4">
					<img src="/logo.webp" class="block h-16 w-16 dark:hidden" alt="Logo" />
					<img src="/logoWhite.webp" class="hidden h-16 w-16 dark:block" alt="Logo" />
					<h4 class="!text-[22px] text-gray-900 dark:text-white">Spotless</h4>
				</div></Sidebar.GroupLabel
			>
			<Sidebar.GroupContent class="my-4">
				<NavMain items={navigation} />
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
