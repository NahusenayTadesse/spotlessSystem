<script>
	import { page } from "$app/state";
    import Button from "$lib/components/ui/button/button.svelte";
	import { CalendarArrowDown, History, Pen, Plus, Sheet } from "@lucide/svelte";
    let { data, children } = $props();

    let today = new Date().toLocaleDateString("en-CA");

</script>
<div class="mb-8 flex flex-row flex-wrap gap-4 justify-start">
<Button href="/dashboard/salary/single/{data.id}" variant={page.url.pathname.endsWith(data.id) || page.url.pathname.endsWith(data.id + '/') ? 'default' : 'outline'}><Plus /> Add Salary </Button>
<Button href="/dashboard/salary/single/{data.id}/add-deductions" variant={page.url.pathname === '/dashboard/salary/single/' + data.id + '/add-deductions' ? 'default' : 'outline'}><Plus />Add Deductions</Button>
<Button href="/dashboard/salary/single/{data.id}/add-bonus" variant={page.url.pathname === '/dashboard/salary/single/' + data.id + '/add-bonus' ? 'default' : 'outline'}><Plus />Add Bonus</Button>
<Button href="/dashboard/salary/single/{data.id}/add-overtime" variant={page.url.pathname === '/dashboard/salary/single/' + data.id + '/add-overtime' ? 'default' : 'outline'}><Plus />Add Overtime</Button>
<Button href="/dashboard/salary/single/{data.id}/salary-history" variant={page.url.pathname === '/dashboard/salary/single/' + data.id + '/salary-history' ? 'default' : 'outline'}><History />Salary History</Button>
<Button href="/dashboard/salary/single/{data.id}/change-salary" variant={page.url.pathname === '/dashboard/salary/single/' + data.id + '/change-salary' ? 'default' : 'outline'}><Pen />Change Salary</Button>
</div>

{@render children()}