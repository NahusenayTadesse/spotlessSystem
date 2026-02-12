<script lang="ts">
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { editStaff } from '$lib/zodschemas/appointmentSchema';

	let { data } = $props();

	import SingleTable from '$lib/components/SingleTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { superForm } from 'sveltekit-superforms/client';
	const styles = {
		container: 'min-h-screen  p-4 transition-colors duration-300 md:p-8',
		sectionWrapper: 'mx-auto max-w-6xl grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',

		// Card Styles
		card: 'rounded-2xl border shadow-lg bg-accent transition-all overflow-hidden',
		cardHeader: 'flex items-center gap-3 border-b border-background px-6 py-4',
		cardContent: 'p-6',

		// Typography
		mainHeading: 'text-3xl text-cetner font-extrabold tracking-tight text-gray-900 dark:text-white',
		subHeading: 'mt-1 text-sm text-gray-500 dark:text-slate-400',
		sectionTitle: 'text-lg font-bold text-gray-800 dark:text-slate-100',

		// Icon Styles
		iconBox: 'flex bg-white dark:bg-black h-10 w-10 items-center justify-center rounded-lg',
		// Specific Icon Variants
		identityIcon: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
		employmentIcon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
		personalIcon: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
		systemIcon: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
	};

	import {
		ArrowLeft,
		BriefcaseBusiness,
		IdCard,
		Pencil,
		Plus,
		Save,
		Trash,
		User,
		Settings
	} from '@lucide/svelte';
	import { formatEthiopianDate } from '$lib/global.svelte.js';

	import SingleView from '$lib/components/SingleView.svelte';

	let identity = $derived([
		{
			name: 'Full Name',
			value: `${data?.staffMember?.firstName} ${data?.staffMember?.lastName} ${data?.staffMember?.grandFatherName}`
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

	let educations = $derived([
		{ name: 'Educational Level', value: data?.staffMember?.educationalLevel }
	]);

	let employment = $derived([
		{ name: 'Employment Status', value: data?.staffMember?.status },
		{ name: 'Department', value: data?.staffMember?.department },
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

	import Terminate from './terminate.svelte';

	let edit = $state(false);
</script>

<svelte:head>
	<title>
		{data.staffMember?.firstName}
		{data.staffMember?.lastName}
	</title>
</svelte:head>

<SingleView
	title="{data.staffMember?.firstName} {data.staffMember?.lastName}"
	class="w-full!"
	photo={data.staffMember?.photo}
>
	<div class="mt-4 flex w-full flex-row items-start justify-start gap-2 pl-4">
		<Button onclick={() => (edit = !edit)}>
			{#if !edit}
				<Pencil class="h-4 w-4" />
				Edit
			{:else}
				<ArrowLeft class="h-4 w-4" />

				Back
			{/if}
		</Button>

		<Terminate
			data={data.terminateForm}
			employee="{data.staffMember?.firstName} {data.staffMember?.lastName}"
		/>
	</div>
	<div class={styles.container}>
		<div
			class="mx-auto mb-8 flex max-w-6xl flex-col items-center justify-center border-b border-background"
		>
			<p class={styles.subHeading}>Comprehensive overview of personnel records.</p>
		</div>

		<div class={styles.sectionWrapper}>
			<section class={`${styles.card} lg:col-span-2`}>
				<div class={styles.cardHeader}>
					<div class={`${styles.iconBox} ${styles.identityIcon}`}><IdCard /></div>
					<h4 class={styles.sectionTitle}>Identity</h4>
				</div>
				<div class={styles.cardContent}>
					<SingleTable singleTable={identity} />
				</div>
			</section>

			<section class={styles.card}>
				<div class={styles.cardHeader}>
					<div class="{styles.iconBox} {styles.employmentIcon}"><BriefcaseBusiness /></div>
					<h4 class={styles.sectionTitle}>Employment</h4>
				</div>
				<div class={styles.cardContent}>
					<SingleTable singleTable={employment} />
				</div>
			</section>

			<section class="{styles.card} md:col-span-2 lg:col-span-2">
				<div class={styles.cardHeader}>
					<div class="{styles.iconBox} {styles.personalIcon}"><User /></div>
					<h4 class={styles.sectionTitle}>Personal Details</h4>
				</div>
				<div class={styles.cardContent}>
					<SingleTable singleTable={personalDetails} />
				</div>
			</section>

			<section class={styles.card}>
				<div class={styles.cardHeader}>
					<div class="{styles.iconBox} {styles.systemIcon}"><Settings /></div>
					<h4 class={styles.sectionTitle}>System Information</h4>
				</div>
				<div class={styles.cardContent}>
					<SingleTable singleTable={systemInformation} />
				</div>
			</section>
		</div>
	</div>
</SingleView>
