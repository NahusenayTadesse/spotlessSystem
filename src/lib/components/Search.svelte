<script>
	import * as Command from '$lib/components/ui/command/index.js';
	import { Disc, Search } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	let isOpen = $state(false);
	let list = [
		{ label: 'Dashboard', path: '/dashboard' },

		// Customers & Sites
		{ label: 'Customers', path: '/dashboard/customers' },
		{ label: 'Contracted Customers', path: '/dashboard/customers/contracted' },
		{ label: 'Sites', path: '/dashboard/sites' },
		{ label: 'Contracted Sites', path: '/dashboard/sites/contracted' },

		// Employees
		{ label: 'Employees', path: '/dashboard/employees' },
		{ label: 'Add Employee', path: '/dashboard/employees/add-employee' },
		{ label: 'Inactive Employees', path: '/dashboard/employees/inactive' },

		// Inventory & Services
		{ label: 'Services', path: '/dashboard/services' },
		{ label: 'Supplies', path: '/dashboard/supplies' },
		{ label: 'Suppliers', path: '/dashboard/supplies/suppliers' },

		// Finance & Payroll
		{ label: 'Paid Salaries', path: '/dashboard/salary' },
		{ label: 'Unpaid Salaries', path: '/dashboard/salary/add-payroll' },
		{ label: 'Pensions', path: '/dashboard/salary/pensions' },
		{ label: 'Tax Types', path: '/dashboard/salary/tax-types' },
		{ label: 'Transactions', path: '/dashboard/transactions' },
		{ label: 'Expenses', path: '/dashboard/transactions/expenses' },

		// Miscellaneous
		{ label: 'Reports', path: '/dashboard/reports' },

		//Admin Panel
		{ label: 'Cities', path: '/dashboard/admin-panel/cities' },
		{ label: 'Departments', path: '/dashboard/admin-panel/department' },
		{ label: 'Educational Levels', path: '/dashboard/admin-panel/educational-level' },
		{ label: 'Employment Status', path: '/dashboard/admin-panel/employment-status' },
		{ label: 'Payment Methods', path: '/dashboard/admin-panel/payment-methods' },
		{ label: 'Regions', path: '/dashboard/admin-panel/regions' },
		{ label: 'Roles', path: '/dashboard/admin-panel/roles' },
		{ label: 'Services Categories', path: '/dashboard/admin-panel/services/categories' },
		{ label: 'Sub-cities', path: '/dashboard/admin-panel/subcities' },
		{ label: 'System Users', path: '/dashboard/admin-panel/users' }
	];
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="w-auto px-4" title="Search for Pages"><Search /></Dialog.Trigger>
	<Dialog.Content class="w-full">
		<Dialog.Header>
			<Dialog.Title>Search the Whole Site</Dialog.Title>
		</Dialog.Header>
		<ScrollArea class="h-auto rounded-md border p-2">
			<Command.Root class="rounded-lg shadow-md md:min-w-112.5">
				<Command.Input placeholder="Type a command or search..." type="search" />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Suggestions">
						{#each list as item (item.path)}
							<Command.Item>
								<Disc />
								<a href={item.path} onclick={() => (isOpen = false)}>{item.label}</a>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>
