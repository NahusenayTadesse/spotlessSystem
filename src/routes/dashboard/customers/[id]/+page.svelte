<script lang="ts">
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { editCustomer } from '$lib/Zodschema';

	let { data } = $props();

	import SingleTable from '$lib/components/SingleTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { superForm } from 'sveltekit-superforms/client';

	import { ArrowLeft, MapPin, Pencil, Phone, Save, Sheet } from '@lucide/svelte';
	import type { Snapshot } from '@sveltejs/kit';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { gender } from '$lib/global.svelte';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import Delete from '$lib/forms/Delete.svelte';
	import Empty from '$lib/components/Empty.svelte';
	import SingleView from '$lib/components/SingleView.svelte';
	import Errors from '$lib/formComponents/Errors.svelte';
	import { formatEthiopianDate } from '$lib/global.svelte';
	import { toGregorian, toEthiopian } from 'ethiopian-calendar-new';
	import Section from './section.svelte';
	import EditDetail from './editDetail.svelte';
	import EditAddress from './editAddress.svelte';
	import Contacts from './contacts.svelte';

	let singleTable = $derived([
		{ name: 'Name', value: data.customer?.name },
		{ name: 'Phone', value: data.customer?.phone },
		{ name: 'Email', value: data.customer?.email },
		{ name: 'Tin Number', value: data.customer?.tinNo },
		{ name: 'Number of Sites', value: data.customer?.sites },
		{ name: 'Added By', value: data.customer?.addedBy },
		{ name: 'Added On', value: formatEthiopianDate(new Date(data?.customer?.joinedOn)) }
	]);

	let customerAddress = $derived([
		{ name: 'Subcity', value: data.customerAddress?.subcity },
		{ name: 'Street', value: data.customerAddress?.street },
		{ name: 'Kebele', value: data.customerAddress?.kebele },
		{ name: 'Building', value: data.customerAddress?.buildingNumber },
		{ name: 'Floor', value: data.customerAddress?.floor },
		{ name: 'House Number', value: data.customerAddress?.houseNumber }
	]);

	//   let date = $derived(dateProxy(editForm, 'appointmentDate', { format: 'date'}));
</script>

<svelte:head>
	<title>Customer Details</title>
</svelte:head>

<SingleView title="Customer Details" class="w-full!">
	<div
		class="mt-4 grid w-full grid-cols-1 items-start justify-start gap-4 px-4 py-4 lg:grid-cols-2"
	>
		<Section title="Customer Details" IconComp={Sheet} style="identityIcon" class="h-full!">
			{#snippet editDialog()}
				<EditDetail
					data={data?.detailForm}
					name={data?.customer?.name}
					phone={data?.customer?.phone}
					email={data?.customer?.email}
					tinNo={data?.customer?.tinNo}
				/>
			{/snippet}
			<SingleTable {singleTable} />
		</Section>

		<Section title="Customer Address" IconComp={MapPin} style="addressIcon" class="h-full!">
			{#snippet editDialog()}
				{#key data?.customerAddress}
					<EditAddress
						data={data?.addressForm}
						address={data?.customerAddress}
						subcityList={data?.subcityList}
					/>
				{/key}
			{/snippet}
			<SingleTable singleTable={customerAddress} />
		</Section>
		<Section
			title="Contact Information"
			class="lg:col-span-2"
			IconComp={Phone}
			style="identityIcon"
		>
			<Contacts data={data?.contacts} form={data?.editContactForm} addForm={data?.addContactForm} />
		</Section>
	</div></SingleView
>
