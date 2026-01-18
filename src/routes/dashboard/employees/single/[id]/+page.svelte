<script lang="ts">
	let { data } = $props();

	import SingleTable from '$lib/components/SingleTable.svelte';

	import { BriefcaseBusiness, Baby, IdCard, User, Settings, MapPin } from '@lucide/svelte';
	import { formatEthiopianDate } from '$lib/global.svelte.js';

	import SingleView from '$lib/components/SingleView.svelte';

	let identity = $derived([
		{
			name: 'Full Name',
			value: `${data?.staffMember?.firstName} ${data?.staffMember?.fatherName} ${data?.staffMember?.grandFatherName}`
		},
		{ name: 'Gender', value: data?.staffMember?.gender },
		{ name: 'Birth Date', value: formatEthiopianDate(data?.staffMember?.birthDate) },
		{ name: 'Age', value: `${data?.staffMember?.age} years old` },
		{ name: 'Nationality', value: data?.staffMember?.nationality }
	]);

	let personalDetails = $derived([
		{ name: 'Tin Number', value: data?.staffMember?.tinNo },
		{ name: 'Marital Status', value: data?.staffMember?.maritalStatus },
		{ name: 'Religion', value: data?.staffMember?.religion },
		{ name: 'Blood Type', value: data?.staffMember?.bloodType }
	]);

	let employment = $derived([
		{ name: 'ID Number', value: data?.staffMember?.idNo },
		{ name: 'Employment Status', value: data?.staffMember?.status },
		{ name: 'Department', value: data?.staffMember?.department },
		{ name: 'Educational Level', value: data?.staffMember?.educationalLevel },
		{
			name: 'Hired On',
			value: formatEthiopianDate(new Date(data?.staffMember?.hireDate))
		},
		{ name: 'Years of Service', value: `${data?.staffMember?.years} years` },

		{
			name: 'Termination Date',
			value:
				formatEthiopianDate(new Date(data?.staffMember?.terminationDate)) || 'Employee is Active'
		}
	]);

	let systemInformation = $derived([
		{ name: 'Added By', value: data?.staffMember?.addedBy },
		{ name: 'Last Updated By', value: data?.staffMember?.updatedBy }
	]);
	let employeeAddress = $derived([
		{ name: 'Subcity', value: data?.address?.subcity },
		{ name: 'Street', value: data?.address?.street },
		{ name: 'Kebele', value: data?.address?.kebele },
		{ name: 'Building', value: data?.address?.buildingNumber },
		{ name: 'Floor', value: data?.address?.floor },
		{ name: 'House Number', value: data?.address?.houseNumber },
		{ name: 'Status', value: data?.address?.status ? 'Active' : 'Inactive' }
	]);
	import Terminate from './terminate.svelte';
	import Reinstate from './reinstate.svelte';
	import EditIdentity from './editIdentity.svelte';
	import EditEmployment from './editEmployment.svelte';
	import EditPersonal from './editPersonal.svelte';
	import EditAddress from './editAddress.svelte';
	import Section from './section.svelte';
	import Families from './Families.svelte';
</script>

<svelte:head>
	<title>
		{data.staffMember?.firstName}
		{data.staffMember?.fatherName}
	</title>
</svelte:head>
{#key data.staffMember}
	<SingleView
		title="{data.staffMember?.firstName} {data.staffMember?.fatherName}"
		class="w-full!"
		photo={data.staffMember?.photo}
	>
		<div class="mt-4 flex w-full flex-row items-start justify-start gap-2 pl-4">
			{#if data?.staffMember.isActive}
				<Terminate
					data={data.terminateForm}
					employee="{data.staffMember?.firstName} {data.staffMember?.fatherName}"
				/>
			{:else}
				<Reinstate
					data={data.reinstateForm}
					employee="{data.staffMember?.firstName} {data.staffMember?.fatherName}"
					statusList={data.statusList}
				/>
			{/if}
		</div>
		<div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
			<Section title="Identity" IconComp={IdCard} style="identityIcon">
				{#snippet editDialog()}
					<EditIdentity
						data={data.identityForm}
						firstName={data?.staffMember.firstName}
						fatherName={data?.staffMember.fatherName}
						grandFatherName={data?.staffMember.grandFatherName}
						gender={data?.staffMember.gender}
						birthDate={data?.staffMember.birthDate}
					/>
				{/snippet}
				<SingleTable singleTable={identity} />
			</Section>

			<Section title="Address" IconComp={MapPin} style="addressIcon">
				{#snippet editDialog()}
					{#key data?.address}
						<EditAddress
							data={data?.addressForm}
							address={data?.address}
							subcityList={data?.subcityList}
						/>
					{/key}
				{/snippet}
				<SingleTable singleTable={employeeAddress} />
			</Section>

			<Section title="Employement" IconComp={BriefcaseBusiness} style="employmentIcon">
				{#snippet editDialog()}
					{#key data?.address}
						<EditEmployment
							data={data?.employmentForm}
							idNo={data?.staffMember.idNo}
							department={data?.staffMember.departmentId}
							educationalLevel={data?.staffMember.educationalLevelId}
							educationalLevelList={data?.educationalLevelList}
							employmentStatus={data?.staffMember.statusId}
							employmentStatusList={data?.statusList}
							hireDate={data?.staffMember.hireDate}
							statusList={data?.statusList}
							departmentList={data?.departmentList}
						/>
					{/key}
				{/snippet}
				<SingleTable singleTable={employment} />
			</Section>

			<Section title="Personal Details" IconComp={User} style="personalIcon">
				{#snippet editDialog()}
					<EditPersonal
						data={data?.personalForm}
						tinNo={data?.staffMember.tinNo}
						bloodType={data?.staffMember.bloodType}
						martialStatus={data?.staffMember.maritalStatus}
						religion={data?.staffMember.religion}
					/>
				{/snippet}
				<SingleTable singleTable={personalDetails} />
			</Section>
			<Section title="Family Members" class="col-span-3" IconComp={Baby} style="identityIcon">
				<Families data={data?.family} form={data?.familyForm} />
			</Section>

			<Section title="System Information" IconComp={Settings} style="systemIcon">
				<SingleTable singleTable={systemInformation} />
			</Section>
		</div>
	</SingleView>
{/key}
