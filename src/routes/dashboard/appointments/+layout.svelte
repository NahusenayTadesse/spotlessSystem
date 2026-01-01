<script>
	import { page } from "$app/state";
    import Button from "$lib/components/ui/button/button.svelte";
	import { CalendarArrowDown, Plus, Sheet } from "@lucide/svelte";
    let { children } = $props();

    let today = new Date().toLocaleDateString("en-CA");

</script>
<div class="mb-8 flex flex-row flex-wrap gap-4 justify-start">
<Button href="/dashboard/appointments/{today}" variant={page.url.pathname.endsWith(today) && !page.url.pathname.includes('/dashboard/appointments/all-appointments') ? 'default' : 'outline'}><CalendarArrowDown /> Today </Button>
<Button href="/dashboard/appointments/add-appointment" variant={page.url.pathname === '/dashboard/appointments/add-appointment' ? 'default' : 'outline'}><Plus />Add an Appointment</Button>
<Button href="/dashboard/appointments/all-appointments"  variant={page.url.pathname.includes('/dashboard/appointments/all-appointments') ? 'default' : 'outline'}><Sheet />All Appointments</Button>
</div>

{@render children()}