  
  <script lang='ts'>
    import { columns } from "./columns";
  

  let { data } = $props();

  import DataTable from '$lib/components/Table/data-table.svelte';

	import Loading from "$lib/components/Loading.svelte";
	import { Frown, ArrowRight } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import MonthYear from "$lib/formComponents/MonthYear.svelte";

  
   
let month = $state(
  new Date(new Date().setMonth(new Date().getMonth() + 1))
    .toLocaleDateString(undefined, { month: 'long' }) + '_' + new Date().getFullYear()
);


  let link = $derived(`${month}`)
</script>

<svelte:head>
        <title> Salariy History for {data?.name}</title>
</svelte:head>
  
 {#await data}
  
  <Loading  name="Salary History"/>
 {:then payrollData} 

  {#if data?.salaryHistory.length === 0}
   <div class="w-5xl h-96 flex flex-col justify-center items-center">
   <p class="text-center flex flex-row gap-4 mt-4 text-4xl justify-self-cente"><Frown class="animate-bounce w-16  h-12" />
     No salaries entered for {data?.salaryDetail.name} </p>
     <!-- <Button href="/dashboard/services/add-services"><Plus />Add New Staff Members</Button> -->

     </div>
 {:else}
    <div class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm rounded-lg p-4 lg:flex lg:items-center lg:justify-between gap-4">
      <div class="flex-1">
        <h1 class="text-lg lg:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Salaries History for {data?.salaryDetail.name}
        </h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Total salary changes: <span class="font-medium text-gray-800 dark:text-gray-100">{data?.salaryHistory.length - 1}</span>
        </p>
      </div>
    </div>

 <div class="lg:w-full w-[350px] lg:p-0 p-2 mt-8 mb-4 pt-4">

   <DataTable data={data.salaryHistory} {columns}  />
 </div>
 {/if}
  {:catch}

    <div class="w-screen h-screen flex flex-col justify-center items-center"> 
         <h1 class="text-red-500">Unexpected Error: Reload</h1>
    </div>
  {/await}
 

