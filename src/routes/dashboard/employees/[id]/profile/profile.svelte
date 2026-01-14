<script lang="ts">
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import InfoSection from './section.svelte';
	import InfoItem from './info-item.svelte';

	interface EmployeeData {
		staffMember: {
			firstName: string;
			lastName: string;
			grandFatherName: string;
			gender: string;
			birthDate: string;
			age: number;
			nationality: string;
			maritalStatus: string;
			religion: string;
			bloodType: string;
			educationalLevel: string;
			status: string;
			department: string;
			hireDate: string;
			years: number;
			tinNo: string;
			addedBy: string;
		};
	}

	import { formatEthiopianDate } from '$lib/global.svelte';

	interface Props {
		data: EmployeeData;
		formatEthiopianDate?: (date: string | Date) => string;
	}

	const { data }: Props = $props();

	const fullName = $derived(
		`${data.staffMember.firstName} ${data.staffMember.lastName} ${data.staffMember.grandFatherName}`
	);
	const isActive = $derived(data.staffMember.status?.toLowerCase() === 'active');
</script>

<div class="min-h-dvh bg-linear-to-br from-background via-background to-primary/5 p-4 md:p-8">
	<div class="mx-auto max-w-4xl space-y-6">
		<!-- Header Section -->
		<Card class="shadow-lg-md border-0 bg-linear-to-r from-primary/10 to-accent/10">
			<CardHeader class="pb-4">
				<div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div class="flex flex-col gap-2">
						<h1 class="text-3xl font-bold text-foreground">{fullName}</h1>
						<p class="text-sm text-muted-foreground">{data.staffMember.department}</p>
					</div>
					<div class="flex flex-wrap gap-2">
						<Badge variant={isActive ? 'default' : 'secondary'} class="text-xs">
							{data.staffMember.status}
						</Badge>
						<Badge variant="outline" class="text-xs">
							{data.staffMember.years} years
						</Badge>
					</div>
				</div>
			</CardHeader>
		</Card>

		<!-- Identity Section -->
		<InfoSection title="Identity Information">
			{#snippet children()}
				<InfoItem label="Gender" value={data.staffMember.gender} />
				<InfoItem label="Birth Date" value={formatEthiopianDate(data?.staffMember?.birthDate)} />
				<InfoItem label="Age" value={`${data.staffMember.age} years old`} />
				<InfoItem label="Nationality" value={data.staffMember.nationality} />
			{/snippet}
		</InfoSection>

		<!-- Personal Details Section -->
		<InfoSection title="Personal Details">
			{#snippet children()}
				<InfoItem label="Marital Status" value={data.staffMember.maritalStatus} />
				<InfoItem label="Religion" value={data.staffMember.religion} />
				<InfoItem label="Blood Type" value={data.staffMember.bloodType} />
			{/snippet}
		</InfoSection>

		<!-- Education Section -->
		<InfoSection title="Education">
			{#snippet children()}
				<InfoItem label="Educational Level" value={data.staffMember.educationalLevel} />
			{/snippet}
		</InfoSection>

		<!-- Employment Details Section -->
		<InfoSection title="Employment Details">
			{#snippet children()}
				<InfoItem label="Employment Status" value={data.staffMember.status} />
				<InfoItem label="Department" value={data.staffMember.department} />
				<InfoItem label="Hired On" value={formatEthiopianDate(data.staffMember.hireDate)} />
				<InfoItem label="Years of Service" value={`${data.staffMember.years} years`} />
			{/snippet}
		</InfoSection>

		<!-- Administrative Information Section -->
		<InfoSection title="Administrative Information">
			{#snippet children()}
				<InfoItem label="TIN Number" value={data.staffMember.tinNo} />
				<InfoItem label="Added By" value={data.staffMember.addedBy} />
			{/snippet}
		</InfoSection>
	</div>
</div>
