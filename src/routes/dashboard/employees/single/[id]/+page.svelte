<script lang="ts">
	let { data } = $props();

	import SingleTable from '$lib/components/SingleTable.svelte';

	import {
		BriefcaseBusiness,
		Baby,
		IdCard,
		User,
		Settings,
		MapPin,
		GraduationCap,
		FileUser,
		ShieldUser
	} from '@lucide/svelte';
	import { formatETB, formatEthiopianDate } from '$lib/global.svelte.js';

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

	let employeeGuarantor = $derived([
		{ name: 'Name', value: data?.guarantor?.name },
		{ name: 'Phone', value: data?.guarantor?.phone.slice(0, 15) },
		{ name: 'Email', value: data?.guarantor?.email },
		{
			name: 'Relationship',
			value:
				data?.guarantor?.relationship !== 'other'
					? data?.guarantor?.relationship
					: data?.guarantor?.relation
		},
		{ name: 'Job Type', value: data?.guarantor?.jobType },
		{ name: 'Company', value: data?.guarantor?.company },
		{ name: 'Salary', value: formatETB(Number(data?.guarantor?.salary), true) }
	]);

	let guarantorAddress = $derived([
		{ name: 'Street', value: data?.guarantor?.address?.street },
		{ name: 'Kebele', value: data?.guarantor?.address?.kebele },
		{ name: 'Building', value: data?.guarantor?.address?.buildingNumber },
		{ name: 'Floor', value: data?.guarantor?.address?.floor },
		{ name: 'House Number', value: data?.guarantor?.address?.houseNumber },
		{ name: 'Status', value: data?.guarantor?.address?.status ? 'Active' : 'Inactive' }
	]);

	import Terminate from './terminate.svelte';
	import Reinstate from './reinstate.svelte';
	import EditIdentity from './editIdentity.svelte';
	import EditEmployment from './editEmployment.svelte';
	import EditPersonal from './editPersonal.svelte';
	import EditAddress from './editAddress.svelte';
	import Section from './section.svelte';
	import Families from './Families.svelte';
	import Qualifications from './qualifications.svelte';
	import Experience from './experience.svelte';
	import EditGuarantor from './editGuarantor.svelte';
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
			<Section
				title="Guarantor"
				class="gap-4! lg:col-span-2"
				IconComp={ShieldUser}
				style="identityIcon"
			>
				<div class="grid grid-cols-1 gap-4 wrap-break-word lg:grid-cols-2">
					<div class="flex flex-col gap-2">
						<h4 class="flex items-center gap-2">
							Guarantor Details
							{#if data?.guarantor?.address}
								{#key data?.guarantor}
									<EditGuarantor
										data={data?.editGuarantorForm}
										name={data?.guarantor?.name}
										phone={data?.guarantor?.phone}
										email={data?.guarantor?.email}
										relationShip={data?.guarantor?.relationShip}
										relation={data?.guarantor?.relation}
										jobtype={data?.guarantor?.jobtype}
										company={data?.guarantor?.company}
										salary={data?.guarantor?.salary}
										photo={data?.guarantor?.photo}
										document={data?.guarantor?.document}
										govtId={data?.guarantor?.govtId}
										id={data?.guarantor?.id}
									/>
								{/key}
							{/if}
						</h4>

						<SingleTable singleTable={employeeGuarantor} />
					</div>
					<div class="flex flex-col gap-2">
						<h4 class="flex items-center gap-2">
							<MapPin class="text-red-400" /> Guarantor Address
							{#if data?.guarantor?.address}
								{#key data?.guarantor}
									<EditAddress
										data={data?.addressForm}
										address={data?.guarantor?.address}
										subcityList={data?.subcityList}
									/>
								{/key}
							{/if}
						</h4>
						<SingleTable singleTable={guarantorAddress} />
					</div>
				</div>
			</Section>
			<Section title="Family Members" class="lg:col-span-3" IconComp={Baby} style="identityIcon">
				<Families data={data?.family} form={data?.familyForm} addForm={data?.addfamilyForm} />
			</Section>

			<Section
				title="Qualifications"
				class="lg:col-span-3"
				IconComp={GraduationCap}
				style="identityIcon"
			>
				<Qualifications
					data={data?.qualifications}
					form={data?.editQualificationForm}
					addForm={data?.addQualificationForm}
					eduLevel={data?.educationalLevelList}
				/>
			</Section>

			<Section
				title="Work Experiences"
				class="lg:col-span-3"
				IconComp={FileUser}
				style="employmentIcon"
			>
				<Experience
					data={data?.experience}
					form={data?.editExperienceForm}
					addForm={data?.addExperienceForm}
				/>
			</Section>

			<Section title="System Information" IconComp={Settings} style="systemIcon">
				<SingleTable singleTable={systemInformation} />
			</Section>
		</div>
	</SingleView>
{/key}
