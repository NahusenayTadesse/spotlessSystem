<script lang="ts">
	import '../app.css';
	import { getFlash } from 'sveltekit-flash-message';
	import { page, updated } from '$app/state';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
	import { toastmsg } from '$lib/global.svelte';

	const flash = getFlash(page, { clearAfterMs: 5000 });

	import { ModeWatcher } from 'mode-watcher';
	import { fly } from 'svelte/transition';

	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	async function notifyBrowser(title: string, body: string) {
		if (!('Notification' in window)) return; // Safari iOS etc.
		if (Notification.permission === 'granted') {
			new Notification(title, { body, icon: '/logo.png' });
		} else if (Notification.permission !== 'denied') {
			const perm = await Notification.requestPermission();
			if (perm === 'granted') new Notification(title, { body, icon: '/logo.png' });
		}
	}

	let { children } = $props();

	async function requestNotificationPermission() {
		if (!('Notification' in window)) return;
		await Notification.requestPermission();
	}

	// let iconify = $state('h-6 w-6 animate-ping');

	$effect(() => {
		if (!$flash) return;
		if (page.data.flash?.type === 'success') toast.success($flash.message);
		if (page.data.flash?.type === 'error') toast.error($flash?.message);

		if (Notification.permission === 'granted') {
			notifyBrowser(
				page.data.flash?.type === 'success'
					? 'Success'
					: page.data.flash?.type === 'error'
						? 'Error'
						: 'Message',
				$flash.message
			);
		}
		$flash = undefined;
	});
</script>

<svelte:head>
	<link rel="icon" href="/logo.webp" />
</svelte:head>
<ModeWatcher />
<Toaster position="bottom-right" richColors closeButton />

<!-- {#if navigating.to}
	<div
		class="fixed top-0.5 right-0.5 bottom-0.5 left-0.5 z-1 flex w-auto flex-col items-center justify-center"
	>
		<div class="flex flex-row items-center gap-2">
			<Loader class="h-12 w-12 animate-spin" />
			<h2 class="animate-pulse capitalize">Loading...</h2>
		</div>
	</div>
{/if} -->

<ProgressBar class="text-accent" />

{#if updated.current}
	<div class={toastmsg} transition:fly={{ x: 20, duration: 300 }}>
		<p>
			A new version of the app is available

			<Button onclick={() => location.reload()}>Reload the page</Button>
		</p>
	</div>
{/if}
{@render children()}
