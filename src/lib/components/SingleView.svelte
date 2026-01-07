<script>
	let { title, children } = $props();
</script>

<div
	class="flex w-full flex-col items-center justify-center rounded-md
 bg-white shadow-lg lg:w-md lg:min-w-3xl dark:bg-black dark:shadow-md dark:shadow-gray-900"
>
	<div
		class="from-dark flex w-full flex-col items-center justify-start rounded-lg bg-gradient-to-r from-gray-200 to-black px-8 py-6 text-white dark:from-gray-600"
	>
		<h1 class="text-center">{title}</h1>
	</div>

	{@render children()}
</div>
