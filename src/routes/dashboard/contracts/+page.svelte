<script lang="ts">
	import { columns } from './columns';

	let { data } = $props();

	import DataTable from '$lib/components/Table/data-table.svelte';

	import Loading from '$lib/components/Loading.svelte';
	import { Frown } from '@lucide/svelte';
	import FilterMenu from '$lib/components/Table/FilterMenu.svelte';
	import { formatEthiopianDate } from '$lib/global.svelte';

	let filteredList = $derived(data?.contracts);

	let urgentContracts = $derived(
		data?.contracts?.filter((c) => c.daysRemaining !== null && c.daysRemaining < 30)
	);

	// Sort by most urgent (closest to 0 or negative)
	let sortedUrgent = $derived(
		[...urgentContracts].sort((a, b) => a.daysRemaining - b.daysRemaining)
	);
</script>

<svelte:head>
	<title>Active Contracts</title>
</svelte:head>

{#if data.contracts.length === 0}
	<div class="flex h-96 w-5xl items-center justify-center">
		<p class="justify-self-cente mt-4 flex flex-row gap-4 text-center text-4xl">
			<Frown class="h-12 w-16  animate-bounce" />
			No InActive Contracts.
		</p>
	</div>
{:else}
	<h2 class="my-4 text-2xl">No of Active Contracts: {data.contracts?.length}</h2>

	<!-- <div class="lg:w-full w-[350px] lg:p-0 p-2 mt-8 mb-4 pt-4">

   <DataTable data={data.customersList} {columns} />
 </div> -->
	{#if sortedUrgent.length > 0}
		<section
			class="mb-8 w-auto justify-self-center overflow-hidden rounded-xl border border-red-200 bg-red-50 p-1 shadow-lg transition-all dark:border-red-900/50 dark:bg-red-950/30"
		>
			<div class="flex items-center gap-3 px-4 py-3 text-red-800 dark:text-red-200">
				<div class="relative flex h-3 w-3">
					<span
						class="absolute inline-flex h-full w-full scale-200 animate-ping rounded-full bg-red-400 opacity-75"
					></span>
					<span class="relative inline-flex h-3 w-3 scale-200 rounded-full bg-red-600"></span>
				</div>

				<h3 class="text-sm font-bold tracking-wider uppercase">
					Urgent: {sortedUrgent.length}
					{sortedUrgent.length === 1 ? 'Contract' : 'Contracts'} Expiring Soon
				</h3>
			</div>

			<div class="grid gap-2 p-2 sm:grid-cols-2 lg:grid-cols-3">
				{#each sortedUrgent as contract (contract.id)}
					<div
						class="group relative flex flex-col justify-between rounded-lg border border-red-200 bg-white p-4 shadow-sm transition-colors hover:bg-red-100/50 dark:border-red-800/40 dark:bg-neutral-900 dark:hover:bg-red-900/20"
					>
						<div>
							<div class="flex items-start justify-between">
								<h4 class="font-bold text-neutral-900 dark:text-white">
									{contract.site}
								</h4>
								<span class="text-xs font-medium text-red-600 dark:text-red-400">
									{contract.daysRemaining <= 0 ? 'Expired' : `${contract.daysRemaining}d left`}
								</span>
							</div>
							<p class="text-sm text-neutral-500 dark:text-neutral-400">
								{contract.service}
							</p>
						</div>

						<div
							class="mt-3 flex items-center justify-between border-t border-red-100 pt-3 dark:border-red-900/30"
						>
							<span class="text-xs text-neutral-400">
								Ends: {formatEthiopianDate(new Date(contract.endDate))}
							</span>
							<a
								href="/dashboard/contracts/{contract.id}/payment-history"
								class="text-xs font-semibold text-red-600 hover:underline dark:text-red-400"
							>
								Renew →
							</a>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
	<FilterMenu
		data={data?.contracts}
		bind:filteredList
		filterKeys={[
			'site',
			'service',
			'monthlyAmount',
			'signingOfficer',
			'contractYear',
			'officeCommission',
			'expectedPayments',
			'actualPayments',
			'missingPayments'
		]}
	/>
	<DataTable data={filteredList} fileName="Site List" class="w-6xl!" {columns} />
{/if}
